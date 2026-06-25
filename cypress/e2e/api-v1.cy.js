describe('GET /customers', () => {

    const baseUrl = 'http://localhost:3001/customers'

    it('Deve retornar clientes utilizando os parâmetros padrão', () => {
        cy.request('GET', baseUrl)
            .then((response) => {

                expect(response.status).to.eq(200)

                expect(response.body).to.have.property('customers')
                expect(response.body).to.have.property('pageInfo')

                expect(response.body.pageInfo.currentPage).to.eq(1)
                expect(response.body.customers).to.have.length.at.most(10)
            })
    })

    it('Deve retornar clientes da página solicitada', () => {
        cy.request('GET', `${baseUrl}?page=2&limit=10`)
            .then((response) => {

                expect(response.status).to.eq(200)
                expect(response.body.pageInfo.currentPage).to.eq(2)
                expect(response.body.customers).to.have.length.at.most(10)
            })
    })

    it('Deve filtrar clientes por tamanho Medium', () => {
        cy.request('GET', `${baseUrl}?size=Medium`)
            .then((response) => {

                expect(response.status).to.eq(200)

                response.body.customers.forEach(customer => {
                    expect(customer.size).to.eq('Medium')
                })
            })
    })

    it('Deve filtrar clientes por indústria Technology', () => {
        cy.request('GET', `${baseUrl}?industry=Technology`)
            .then((response) => {

                expect(response.status).to.eq(200)

                response.body.customers.forEach(customer => {
                    expect(customer.industry).to.eq('Technology')
                })
            })
    })

    it('Deve filtrar clientes por tamanho e indústria simultaneamente', () => {
        cy.request(
            'GET',
            `${baseUrl}?size=Medium&industry=Technology`
        ).then((response) => {

            expect(response.status).to.eq(200)

            response.body.customers.forEach(customer => {
                expect(customer.size).to.eq('Medium')
                expect(customer.industry).to.eq('Technology')
            })
        })
    })

    it('Deve validar a estrutura do cliente retornado', () => {
        cy.request('GET', baseUrl)
            .then((response) => {

                const customer = response.body.customers[0]

                expect(customer).to.have.property('id')
                expect(customer).to.have.property('name')
                expect(customer).to.have.property('employees')
                expect(customer).to.have.property('size')
                expect(customer).to.have.property('industry')
                expect(customer).to.have.property('contactInfo')
                expect(customer).to.have.property('address')
            })
    })

    it('Deve validar a classificação dinâmica do size', () => {
        cy.request('GET', `${baseUrl}?limit=100`)
            .then((response) => {

                response.body.customers.forEach(customer => {

                    if (customer.employees < 100) {
                        expect(customer.size).to.eq('Small')
                    }
                    else if (customer.employees < 1000) {
                        expect(customer.size).to.eq('Medium')
                    }
                    else if (customer.employees < 10000) {
                        expect(customer.size).to.eq('Enterprise')
                    }
                    else if (customer.employees < 50000) {
                        expect(customer.size).to.eq('Large Enterprise')
                    }
                    else {
                        expect(customer.size).to.eq('Very Large Enterprise')
                    }
                })
            })
    })

    it('Deve permitir contactInfo nulo ou preenchido corretamente', () => {
        cy.request('GET', baseUrl)
            .then((response) => {

                response.body.customers.forEach(customer => {

                    if (customer.contactInfo !== null) {
                        expect(customer.contactInfo).to.have.property('name')
                        expect(customer.contactInfo).to.have.property('email')
                    }
                })
            })
    })

    it('Deve permitir address nulo ou preenchido corretamente', () => {
        cy.request('GET', baseUrl)
            .then((response) => {

                response.body.customers.forEach(customer => {

                    if (customer.address !== null) {
                        expect(customer.address).to.have.property('street')
                        expect(customer.address).to.have.property('city')
                        expect(customer.address).to.have.property('state')
                        expect(customer.address).to.have.property('zipCode')
                        expect(customer.address).to.have.property('country')
                    }
                })
            })
    })

    it('Deve retornar 400 para page negativo', () => {
        cy.request({
            method: 'GET',
            url: `${baseUrl}?page=-1`,
            failOnStatusCode: false
        }).then((response) => {

            expect(response.status).to.eq(400)
        })
    })

    it('Deve retornar 400 para limit inválido', () => {
        cy.request({
            method: 'GET',
            url: `${baseUrl}?limit=abc`,
            failOnStatusCode: false
        }).then((response) => {

            expect(response.status).to.eq(400)
        })
    })

    it('Deve retornar 400 para size inválido', () => {
        cy.request({
            method: 'GET',
            url: `${baseUrl}?size=InvalidSize`,
            failOnStatusCode: false
        }).then((response) => {

            expect(response.status).to.eq(400)
        })
    })

    it('Deve retornar 400 para industry inválido', () => {
        cy.request({
            method: 'GET',
            url: `${baseUrl}?industry=InvalidIndustry`,
            failOnStatusCode: false
        }).then((response) => {

            expect(response.status).to.eq(400)
        })
    })

})