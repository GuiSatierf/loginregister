// Importação de módulos e configurações iniciais
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const path = require("path");
const app = express();
app.use(express.static("public"));

// Importe o módulo 'fs' para manipulação de arquivos (exemplo de ação)
const fs = require("fs");

// Importação de modelos e classes
const User = require("./models/User");
const Register = require("./register");
const register = new Register();
app.use("/auth", register.router);
app.use("/public", express.static("public"));
app.use("/public", express.static("views"));

// Configuração do servidor e banco de dados
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

// Middleware para verificação de token
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

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

// Rotas públicas
app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/views/register.html");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/views/login.html");
});

app.get("/payment", (req, res) => {
  res.sendFile(__dirname + "/views/payment.html");
});

app.get("/thankyou", (req, res) => {
  res.sendFile(__dirname + "/views/thank.html");
});

app.get("/user", (req, res) => {
  res.sendFile(__dirname + "/views/dashboardUser.html");
});

app.get("/admin", (req, res) => {
  res.sendFile(__dirname + "/views/dashboardAdmin.html");
});

// Autenticação de usuário
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

    // Verificar a senha sem o uso do bcrypt (não recomendado)
    if (password !== user.password) {
      return res.status(422).json({ msg: "Senha inválida" });
    }

    if (email === "a@a") {
      res.redirect("/admin");
    }

    if (password === user.password) {
      // Redirecionar o usuário após o login
      res.redirect("/user");
    }

    // Gerar um token de autenticação
    const secret = process.env.SECRET;
    const token = jwt.sign({ id: user._id }, secret);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "Erro ao processar a autenticação", error: error.message });
  }
});

// Rota privada
app.get("/user/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  // Verificar se o usuário existe
  const user = await User.findById(id, "-password");

  if (!user) {
    return res.status(404).json({ msg: "Usuário não encontrado!" });
  }

  res.status(200).json({ user });
});

const personSchema = new mongoose.Schema({
  firstname: String,
  email: String,
});

const Person = mongoose.model("Person", personSchema);

// Rota para buscar os dados e enviá-los como JSON
app.get("/api/inv", async (req, res) => {
  try {
    const data = await Person.find({});
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar dados" });
  }
});
