let express = require('express')
let app = express()
let cors = require('cors')
let { Router } = require('./routes.js')
let config = require('config')
let port = config.get('port')
app.use(cors({ origin: corsfun }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
let session = require('express-session');
app.use(session({
    secret: "#*12345"
}))

app.use(express.static(__dirname + "/public"))
app.set('view engine', 'ejs')
app.use(Router)
function corsfun(origin, callback) {
    console.log('origin', origin);
    let whitelist = {
        'abc.com': true,
        'localhost': true,
        'http://localhost:3001': true

    }
    if (!origin || whitelist[origin]) {
        callback(null, true);
    } else {
        callback(new Error('domain not valid'))
    }
}




app.listen(port, () => {
    console.log("connected to server")
})