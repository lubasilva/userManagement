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
                    token: token
                  }).table("passwordtokens");
                  return {status: true, token: token}
            } catch (error) {
                return {status: false, error: error}
            }
            
        } else {
            return {status: false, error: 'O e-email não existe no nosso sistema'}
        }
    }
}

module.exports = new PasswordToken();