var express = require("express");
var app = express();
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Hello world'); 
});

app.listen(port, function(){
    console.log(`Listening on port ${port}`);
});

