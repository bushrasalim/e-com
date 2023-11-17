let { Sequelize, Model, DataTypes, Op, QueryTypes } = require("sequelize")
let sequelizeCon = new Sequelize("mysql://root@localhost/demo")
// sequelizeCon.sync({ alter: true })
sequelizeCon.authenticate().then(() => {
    console.log("connected to database")
}).catch(() => {
    console.log("not connected")
})
module.exports = { sequelizeCon, Model, DataTypes, QueryTypes }