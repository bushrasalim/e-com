let express = require('express')
let Router = express.Router()
let user = require('./controller/user')
let product = require('./controller/product')
let category = require('./controller/category')
let auth = require('./controller/authcontroller')

let authm = require('./middleware/authmiddleware')
let { mail } = require('./Helper/mailer')
let otp_g = require("otp-generator")
let dashboard = require("./controller/dashboard")
const { update } = require('./model/categorymodel')

//User AUTH Routes
Router.get('/', auth.index)
Router.get('/login', auth.index)
Router.post('/registration', auth.register)
Router.post('/login', auth.login)


Router.get('/dashboard', authm.auth('user'), dashboard.index)

// Product routes
Router.get('/product', authm.auth('read_product'), product.viewAll);
//Router.get('/productOne/:id', product.viewOne)
Router.get('/product/add', authm.auth('add_product'), product.addUI)
Router.post('/product/add', authm.auth('add_product'), product.createProduct)
Router.get('/product/:id', authm.auth('read_product'), product.viewDetail)
Router.get("/product/update/:id", authm.auth('update_product'), product.updateUI)
Router.post('/product/:id', authm.auth('update_product'), product.update)
Router.post('/product/delete/:id', authm.auth('delete_product'), product.pdelete)
Router.post('/product/restore/:id', authm.auth('restore_product'), product.restore)

//category routes
Router.get('/category/addUI', authm.auth('read_product'), category.addUI)
Router.post('/category/add', authm.auth('read_product'), category.createcategory)
Router.get('/category', category.view)
Router.get('/category/:id', authm.auth('read_product'), category.viewOne)
Router.get('/category/update/:id', authm.auth('read_product'), category.updateUI)
Router.post('/category/:id', authm.auth('read_product'), category.update)
Router.post('/category/delete/:id', authm.auth('read_product'), category.cdelete)
Router.post('/category/restore/:id', authm.auth('read_product'), category.restore)
//mailer
Router.get('/forgetpassword', auth.forgetpUI)
Router.post('/forgetpassword', auth.forgetpassword)
Router.post("/resetpassword/:email", auth.resetPassword)
Router.post('/user', user.createUser)
module.exports = { Router }  