var express = require('express')
var bodyParser = require('body-parser')

var app = express()

app.use(bodyParser.json())

app.set('port', (process.env.PORT || 4000))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.post('/webhook', (req, res) => {
    res.sendStatus(200)
})


app.listen(app.get('port'), function () {
    console.log('LINE WEBHOOK RUN AT PORT', app.get('port'))
})