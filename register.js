const express = require("express");
const User = require("./models/User");

class Register {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.use(express.json());
    this.router.use(express.urlencoded({ extended: true }));

    this.router.post("/register", this.registerUser.bind(this));
  }

  async registerUser(req, res) {
    try {
      const {
        firstname,
        secondname,
        cpf,
        idrg,
        email,
        cellphone,
        job,
        maritialstats,
        adress,
        city,
        state,
        postalcode,
        country,
        password,
        confirmpassword,
      } = req.body;

      // Validações (mantive as validações existentes)

      // Verificar se o usuário já existe no banco de dados
      const userExists = await User.findOne({ email: email });

      if (userExists) {
        return res.status(422).json({ msg: "Por favor, utilize outro e-mail!" });
      }

      // Criar um novo usuário no banco de dados
      const newUser = new User({
        firstname,
        secondname,
        cpf,
        idrg,
        email,
        cellphone,
        job,
        maritialstats,
        adress,
        city,
        state,
        postalcode,
        country,
        password,
        confirmpassword,
      });

      await newUser.save();

      res.redirect("/login");
      
    } catch (error) {
      // Em caso de erro, envie uma resposta de erro
      console.error(error);
      res.status(500).json({
        msg: "Erro ao criar o usuário no banco de dados.",
        error: error.message,
      });
    }
  }
}

module.exports = Register;
