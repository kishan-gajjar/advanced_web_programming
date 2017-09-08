const express = require("express");
const url = require("url");
const bodyParser = require('body-parser');
let app = express();
let configRoutes = require("./routes");

// logger middleware
var logger = (req, res, next) => {
    console.log("Log: Request body: " + JSON.stringify(req.body) + " -------------- Route: " + req.originalUrl + " -------------- HTTP Verb: " + req.method);
    next();
}

// counter middleware
var map = new Map();
var counter = (req, res, next) => {
    
    let fullUrl = url.format({protocol: req.protocol, host: req.get('host'), pathname: req.originalUrl});

    if(!map.get(fullUrl)) {
        value = 1;
        map.set(fullUrl, value);
    } else {
        value = map.get(fullUrl) + 1;
        map.set(fullUrl, value);
    }

    console.log("Log: Route: " + fullUrl + " -------------- Count: " + map.get(fullUrl));
    next();
}

app.use(bodyParser.json());
app.use(logger);
app.use(counter);

configRoutes(app);

app.listen(3000, () => {
    console.log("Routes will be running on http://localhost:3000");
});