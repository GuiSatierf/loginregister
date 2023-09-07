const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: String,
  secondname: String,
  cpf: String,
  idrg: String,
  email: String,
  cellphone: String,
  job: String,
  maritialstats: String,
  adress: String,
  city: String,
  state: String,
  postalcode: String,
  country: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
