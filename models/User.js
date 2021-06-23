const knex = require("../database/connection");
const bcrypt = require("bcrypt");
const PasswordToken = require("./PasswordToken");

class User {
  async findAll() {
    try {
      let result = await knex
        .select(["id", "name", "email", "role"])
        .table("users");
      return result;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  async findById(id) {
    try {
      let result = await knex
        .select(["id", "name", "email", "role"])
        .where({ id: id })
        .table("users");

      if (result.length > 0) {
        return result;
      } else {
        return undefined;
      }
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  async findByEmail(email) {
    try {
      let result = await knex.select(["id", "name", "email", "password", "role"]).where({email:email}).table("users");
      if (result.length > 0) {
        return result[0];
      } else {
        return undefined;
      }
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }
  async new(name, email, password) {
    try {
      let hash = await bcrypt.hash(password, 10);
      await knex
        .insert({ name, email, password: hash, role: 0 })
        .table("users");
    } catch (error) {
      console.log(error);
    }
  }

  async findEmail(email) {
    try {
      let result = await knex.select("*").from("users").where({ email: email });

      if (result.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async update(id, name, email, role) {
    let user = await this.findById(id);

    if (user != undefined) {
      let editUser = {};

      if (email != undefined) {
        if (email != user.email) {
          let resultEmail = await this.findEmail(email);
          if (resultEmail == false) {
            editUser.email = email;
          } else {
            return {
              status: false,
              error: "O e-mail já está cadastrado",
            };
          }
        }
      }

      if (name != undefined) {
        editUser.name = name;
      }

      if (role != undefined) {
        editUser.role = role;
      }

      try {
        await knex.update(editUser).where({ id: id }).table("users");
        return { stauts: true };
      } catch (error) {
        return { status: false, error: error };
      }
    } else {
      return { status: false, err: "O usuário não existe" };
    }
  }

  async delete(id) {
    let user = await this.findById(id);

    if (user != undefined) {
      try {
        await knex.delete().where({ id: id }).table("users");
        return { status: true };
      } catch (error) {
        return {
          status: false,
          error: "O Usário não existe, impossivel deletar",
        };
      }
    } else {
      return {
        status: false,
        error: "O Usário não existe, impossivel deletar",
      };
    }
  }

  async changePassword(newPassword, id, token) {
    let hash = await bcrypt.hash(newPassword, 10);
    await knex.update({password: hash}).where({id:id}).table('users');
    await PasswordToken.setUsed(token);
  }
}

module.exports = new User();
