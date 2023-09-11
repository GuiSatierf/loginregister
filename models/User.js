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
  password: String,
  
  task: {
    type: String,
    required: true,
  },
  check: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
