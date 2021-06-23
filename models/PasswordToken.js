const knex = require('../database/connection');
const User = require('./User');

class PasswordToken {
    async create(email) {
        let user = await User.findByEmail(email);
        if(user != undefined) {
            try {
                let token  = Date.now();
                await knex.insert({
                    user_id: user.id,
                    used: 0,
                    token: token,
                  })
                  .table("passwordtokens");
                  return {status: true, token: token}
            } catch (error) {
                return {status: false, error: error}
            }
            
        } else {
            return {status: false, error: 'O e-email não existe no nosso sistema'}
        }
    }

    async validate(token) {
        try {
            let result = await knex.select().where({ token: token }).table("passwordtokens");
            if(result.length > 0) {
                let tokenResult = result[0];

                if(tokenResult.used) {
                    return {status: false, error: 'Esté token já foi usado!' };
                } else {
                    return {status: true, token: tokenResult};
                }

            } else {
                return {status: false, error: 'Token inválido'};
            }
        } catch (error) {
            console.log(error);
            return {status: false, error: error};
        }
    }

    async setUsed(token) {
        await knex.update({used:1}).where({token:token}).table('passwordtokens');
    }
}

module.exports = new PasswordToken();