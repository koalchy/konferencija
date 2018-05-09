const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync") 
const adapter = new FileSync("server/db.json")
const db = low(adapter)

db
  .defaults({
    registrations: require("./fixtures/registrations.js"),
    talks: require("./fixtures/talks.js"),
    favorites: []
  })
  .write();

module.exports = db;