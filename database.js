const mongoose = require("mongoose");

async function connection() {
  const URIString = "mongodb://localhost:27017/chat"
  await mongoose.connect(URIString);
  console.log('conectado a mongo')
}

module.exports = connection;