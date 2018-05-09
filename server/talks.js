var db = require("./db.js");
var _ = require("lodash");

var get = function () {
    var talks = db.get("talks").value();
    return talks;
};

module.exports = {
    get: get
};