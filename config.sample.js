const { Module } = require("module")
const MONGO_CONNECTION_STRING_ORDER = "mongodb+srv://xxxx:xxxx@[cluster].mlquu.mongodb.net/order-service"
const MONGO_CONNECTION_STRING_PRODUCT = "mongodb+srv://xxxx:xxxx@[cluster].mlquu.mongodb.net/product-service"
const MONGO_CONNECTION_STRING_AUTH = "mongodb+srv://xxxx:xxxx@[cluster].mlquu.mongodb.net/auth-service"

module.exports = {
      MONGO_CONNECTION_STRING_ORDER,
      MONGO_CONNECTION_STRING_PRODUCT,
      MONGO_CONNECTION_STRING_AUTH
}