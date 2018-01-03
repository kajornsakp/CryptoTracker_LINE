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
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer KFPq5HxMg3+OxUlw1ArdTNS76/x8Hq025lV0EcJmosKab8m9oup1svrubKY7qurzhCqdY+fOKvc/rBCZk1pfG22mf/PaNY7Yy5n6GaWpGo23VjB/p0otBT8NuCQiBrrX6NktUHoZXiyWfFHhJB3DGgdB04t89/1O/w1cDnyilFU='
    }
})

function replyText(replyToken,text) {
    let replyData = {
        replyToken: replyToken,
        messages: [{
            type: 'text',
            text: coinName + ' : ' + coinPrice + ' ' + coinUnit
        }]
    }
    api.post('/message/reply', replyData)
        .then((res) => {
            console.log("reply success")
        })
        .catch((error) => {
            console.log("reply error")
        })
}

function replyCoin(replyToken,coinList) {
    var replyText = ""
    if(coinList.lenth == 0){
        replyText = "Coin not found!"
    }
    else{
        coinList.map((coin)=>{
            replyText += coin.coinName + ' : ' + coin.oinPrice + ' ' + coin.coinUnit + '\n'
        })
    }
    let replyData = {
        replyToken: replyToken,
        messages: [{
            type: 'text',
            text: replyText
        }]
    }
    api.post('/message/reply', replyData)
        .then((res) => {
            console.log("reply success")
        })
        .catch((error) => {
            console.log("reply error")
        })
}

function analyzeText(message) {
    var text = message.message.text
    var sender = message.source.userId
    var replyToken = message.replyToken
    text = text.toUpperCase()
    getBXCurrency(replyToken,text)
}

function getBXCurrency(replyToken,currency) {
    axios.get('https://bx.in.th/api/')
        .then((res) => {
            var resultList = []
            Object.entries(res.data).forEach(([coin_id,coin])=>{
                let coinName = coin.secondary_currency
                let coinUnit = coin.primary_currency
                if(coinName == currency){
                    let coinPrice = coin.last_price
                    resultList.append({coinName : coinName,coinPrice:coinPrice,coinUnit:coinUnit})
                }
            })
            replyCoin(replyToken,resultList);
        })
        .catch((error) => {
            console.log(error)
        })

}

app.post('/webhook', (req, res) => {
    analyzeText(req.body.events[0])
    res.sendStatus(200)
})

app.get('/getBX',(req,res)=>{
    getBXCurrency()
    res.sendStatus(200)
})

app.listen(app.get('port'), function () {
    console.log('LINE WEBHOOK RUN AT PORT', app.get('port'))
})

//TODO: multiple answer for same currency (diff primary currency)
//TODO: multiple market, bx, coinmarketcaps
