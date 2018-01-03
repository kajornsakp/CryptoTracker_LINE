var express = require('express')
var bodyParser = require('body-parser')
var axios = require('axios')
var app = express()

app.use(bodyParser.json())

app.set('port', (process.env.PORT || 4000))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

var api = axios.create({
    baseURL: 'https://api.line.me/v2/bot',
    headers : {'Content-Type':'application/json','Authorization':'Bearer KFPq5HxMg3+OxUlw1ArdTNS76/x8Hq025lV0EcJmosKab8m9oup1svrubKY7qurzhCqdY+fOKvc/rBCZk1pfG22mf/PaNY7Yy5n6GaWpGo23VjB/p0otBT8NuCQiBrrX6NktUHoZXiyWfFHhJB3DGgdB04t89/1O/w1cDnyilFU='}
})
function analyzeText(message) {
    var text = message.message.text
    var sender = message.source.userId
    var replyToken = message.replyToken
    let replyData = {
        replyToken: replyToken,
        messages : [{
            type: 'text',
            text: 'Reply' + text
        }]
    }
    api.post('/message/reply',replyData)
        .then((res)=>{
            console.log("reply success")
        })
        .catch((error)=>{
            console.log("reply error")
        })
}

app.post('/webhook', (req, res) => {
    analyzeText(req.body.events[0])
    res.sendStatus(200)
})


app.listen(app.get('port'), function () {
    console.log('LINE WEBHOOK RUN AT PORT', app.get('port'))
})