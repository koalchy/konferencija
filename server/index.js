var express = require("express");
var talks = require("./talks.js");
var app = express();
const port = process.env.PORT || 5000;

app.use(express.static("public"));

app.get('/', (req, res) => {
    res.send('Hello world'); 
});

app.get('/talks.json', (req, res) => {
    res.json(talks.get());
});

app.listen(port, function(){
    console.log(`Listening on port ${port}`);
});

