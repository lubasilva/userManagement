const User = require('../models/User');
const PasswordToken = require('../models/PasswordToken');

class userController {
    async index(request, response) {
        let users =  await User.findAll();
        response.json(users);
    }

    async findUser(request, response) {
        let id = request.params.id;
        let user = await User.findById(id);

        if(user == undefined) {
            response.status(404);
            response.json({error: 'Id não encontrado!'});
        } else {
            response.json(user);
        }
    }

    async deleteUser(request, response) {
        let id = request.params.id;
        let user = await User.delete(id);

        if(user.status) {
            response.status(200);
            response.send('Usuario Deletado');
        } else {
            response.status(406);
            response.send(user.error);
        }
    }

    async edit(request, response) {
        let {id, name, email, role} = request.body;
        console.log(id, name, email, role);
        let result = await User.update(id,name,email, role);
        if (result != undefined) {
          if (!result.status) {
            response.status(200);
            response.send("Update Ok");
          } else {
              console.log('falso')
            response.status(406);
            response.json(result.error);
            return;
          }
        } else {
          response.status(406);
          response.json('Erro no servidor');
          return;
        }
    }

    async create(request, response) {
        let { email, name, password, role} = request.body;

        if (email == undefined || email == "" || email == " " || email.length < 2 ) {
            response.status(400);
            response.json({err: 'Email é inválido'});
            return;
        }

        if (name == undefined || name == "" || name == " " || name.length < 2 ) {
            response.status(400);
            response.json({err: 'nome é inválido'});
            return;
        }

        if (password == undefined || password == "" || password == " " || password.length < 2 ) {
            response.status(400);
            response.json({err: 'senha é inválida'});
            return;
        }

        let emailExists = await User.findEmail(email);

        if(emailExists) {
            response.status(406);
            response.json({error: 'O e-mail já está cadastrado'});
            return;
        }

        await User.new(name, email, password);

        response.status(200);
        response.send('Create Ok');
    }

    async recoverPassword(request, response) {
        let email = request.body.email;
        let result = await PasswordToken.create(email);
        console.log(result);
        if(result.status) {
            response.status(200);
            response.send('' + result.token);
        } else {
            response.status(406);
            response.send(result.error);
        }
    }

    async changePassword(request, response) {
        let token = request.body.token;
        let password = request.body.password;

        let IsValid = await PasswordToken.validate(token);

        if(IsValid.status) {
            await User.changePassword(password, IsValid.token.user_id, IsValid.token.token);
            response.status(200);
            response.send('Senha alterada');
        } else {
            response.status(406);
            response.send('Invalid token');
        }
    }
}

module.exports = new userController();