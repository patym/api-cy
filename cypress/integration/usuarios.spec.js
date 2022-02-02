/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {

     let token,
          geradorEmail = () => {
               return `teste${Math.floor(Math.random() * 100000000)}@email.com`
          }
          
     before(() => {
          cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })
     });

     it('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(response => {
               return contrato.validateAsync(response.body)
          })
     });

     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios'
          }).then((response) => {
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('usuarios')
               expect(response.duration).to.be.lessThan(20)
          })
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          let usuario = `Usuario 123 ${Math.floor(Math.random() * 100000000)}`/*,
               email = `teste${Math.floor(Math.random() * 100000000)}@email.com`*/
          cy.request({
               method: 'POST',
               url: 'usuarios',
               body: {
                    "nome": usuario,
                    "email": geradorEmail(),
                    "password": "teste123",
                    "administrador": "true"
               },
               headers: { authorization: token }
          }).then((response) => {
               expect(response.status).to.equal(201)
               expect(response.body.message).to.equal('Cadastro realizado com sucesso')
          })
     });

     it('Deve validar um usuário com email inválido', () => {
          cy.cadastrarUsuario(token, 'Usuario Novo 1', "teste@email.com", "54321", "false")
          .then((response) => {
               expect(response.status).to.equal(400)
               expect(response.body.message).to.equal('Este email já está sendo usado')
          })
     });

     it('Deve editar um usuário previamente cadastrado', () => {
          let usuario = `Usuario 123 ${Math.floor(Math.random() * 100000000)}`/*,
               email = `teste${Math.floor(Math.random() * 100000000)}@email.com`,
               emailEditado = `teste${Math.floor(Math.random() * 100000000)}@email.com`*/

          cy.cadastrarUsuario(token, 'Usuario Novo 1', geradorEmail(), "54321", "false")
          .then(response => {
               let id = response.body._id

               cy.request({
                    method: 'PUT',
                    url: `usuarios/${id}`,
                    headers: { authorization: token },
                    body:
                    {
                         "nome": usuario,
                         "email": geradorEmail(),
                         "password": "12345",
                         "administrador": "true"
                    }
               }).then(response => {
                    expect(response.body.message).to.equal('Registro alterado com sucesso')
               })
          })
     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          
          cy.cadastrarUsuario(token, "UsuarioDeletado", "teste13@email.com", "54321", "false")
          .then(response => {
               let id = response.body._id
               cy.request({
                    method: 'DELETE',
                    url: `usuarios/${id}`,
                    headers: { authorization: token }
               }).then(response => {
                    expect(response.body.message).to.equal('Registro excluído com sucesso')
                    expect(response.status).to.equal(200)
               })
          })
     });
});



