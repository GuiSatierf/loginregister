const mongoose = require('mongoose')

const User = mongoose.model('User', {
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
  country: String
})

module.exports = User
