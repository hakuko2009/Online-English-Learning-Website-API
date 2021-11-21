const express = require('express')
const app = express()
const http = require('http')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ 
    extended: true 
}))
app.use(bodyParser.json())

let routes = require('./api/routes') //importing route
routes(app)

app.use(function(req, res) {
    res.status(404).send({
        url: req.originalUrl + ' not found'
    })
})
var httpServer = http.createServer(app);

httpServer.listen(port)

console.log('RESTful API server started on: ' + port)