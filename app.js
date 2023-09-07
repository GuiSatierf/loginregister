require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.static("public"));

// models
const User = require("./models/User");

// Config JSON response
app.use(express.json());

app.use(
  express.static("public", {
    setHeaders: (res, path, stat) => {
      res.set("Content-Type", "text/css");
    },
  })
);

// Private Route
app.get("/user/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  // check if user exists
  const user = await User.findById(id, "-password");

  if (!user) {
    return res.status(404).json({ msg: "Usuário não encontrado!" });
  }

  res.status(200).json({ user });
});

function checkToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "Acesso negado!" });

  try {
    const secret = process.env.SECRET;

    jwt.verify(token, secret);

    next();
  } catch (err) {
    res.status(400).json({ msg: "O Token é inválido!" });
  }
}

//Database

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPassword}@dashboard-floruit.g8lddki.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Conectou ao banco!");
    app.listen(3000);
  })
  .catch((err) => console.log(err));

//================================================================================================================================

// Open Route
app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/register.html");
});

app.post("/auth/register", async (req, res) => {
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

    //const salt = await bcrypt.genSalt(12);
    //const passwordHash = await bcrypt.hash(password, salt);

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

    res.status(201).json({ msg: "Usuário registrado com sucesso!" });
  } catch (error) {
    // Em caso de erro, envie uma resposta de erro
    console.error(error);
    res.status(500).json({
      msg: "Erro ao criar o usuário no banco de dados.",
      error: error.message,
    });
  }
});

//================================================================================================================================


app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.post("/auth/login", async (req, res) => {
  
  try {
    const { email, password } = req.body;

    // Validações
    if (!email) {
      return res.status(422).json({ msg: "O email é obrigatório!" });
    }

    if (!password) {
      return res.status(422).json({ msg: "A senha é obrigatória!" });
    }

    // Verificar se o usuário existe no banco de dados
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado!" });
    }

    // Verificar se a senha está correta
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(422).json({ msg: "Senha inválida" });
    }

    // Gerar um token de autenticação
    const secret = process.env.SECRET;
    const token = jwt.sign({ id: user._id }, secret);

    // Responder com sucesso e enviar o token
    res.status(200).json({ msg: "Autenticação realizada com sucesso!", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Erro ao processar a autenticação", error: error.message });
  }
});
