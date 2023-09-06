require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

// models
const User = require("./models/User");

// Config JSON response
app.use(express.json());

// Open Route
app.get("/", (req, res) => {
  res.status(200).json({ msg: "Bem vindo a API!" });
});

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

app.post("/auth/register", async (req, res) => {
  const { firstname, secondname, cpf, idrg, email, cellphone, job, maritialstats, adress, city, state, postalcode, country, password, confirmpassword } = req.body;

  // validations
  if (!firstname) {
    return res.status(422).json({ msg: "O nome é obrigatório!" });
  }
  if (!secondname) {
    return res.status(422).json({ msg: "O nome é obrigatório!" });
  }
  if (!cpf) {
    return res.status(422).json({ msg: "O nome é obrigatório!" });
  }
  if (!idrg) {
    return res.status(422).json({ msg: "O nome é obrigatório!" });
  }
  if (!cellphone) {
    return res.status(422).json({ msg: "O nome é obrigatório!" });
  }
  if (!job) {
    return res.status(422).json({ msg: "O nome é obrigatório!" });
  }
  if (!maritialstats) {
    return res.status(422).json({ msg: "O nome é obrigatório!" });
  }
  if (!adress) {
    return res.status(422).json({ msg: "O nome é obrigatório!" });
  }
  if (!city) {
    return res.status(422).json({ msg: "O nome é obrigatório!" });
  }
  if (!state) {
    return res.status(422).json({ msg: "O nome é obrigatório!" });
  }
  if (!postalcode) {
    return res.status(422).json({ msg: "O nome é obrigatório!" });
  }
  if (!country) {
    return res.status(422).json({ msg: "O nome é obrigatório!" });
  }
  if (!email) {
    return res.status(422).json({ msg: "O email é obrigatório!" });
  }
  if (!password) {
    return res.status(422).json({ msg: "A senha é obrigatória!" });
  }

  if (password != confirmpassword) {
    return res
      .status(422)
      .json({ msg: "A senha e a confirmação precisam ser iguais!" });
  }

  // check if user exists
  const userExists = await User.findOne({ email: email, cpf: cpf, idrg: idrg, cellphone: cellphone });

  if (userExists) {
    return res.status(422).json({ msg: "Por favor, utilize outro e-mail!" });
  }

  // create password
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  // create user
  const user = new User({
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
    password: passwordHash,
  });

  try {
    await user.save();

    res.status(201).json({ msg: "Usuário criado com sucesso!" });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  // validations
  if (!email) {
    return res.status(422).json({ msg: "O email é obrigatório!" });
  }

  if (!password) {
    return res.status(422).json({ msg: "A senha é obrigatória!" });
  }

  // check if user exists
  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({ msg: "Usuário não encontrado!" });
  }

  // check if password match
  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(422).json({ msg: "Senha inválida" });
  }

  try {
    const secret = process.env.SECRET;

    const token = jwt.sign(
      {
        id: user._id,
      },
      secret
    );

    res.status(200).json({ msg: "Autenticação realizada com sucesso!", token });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

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