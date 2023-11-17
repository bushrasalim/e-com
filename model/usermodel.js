let { User } = require('../schema/userschema')
let joi = require('joi')
async function create(params) {
    let valid = await check(params).catch((err) => {
        return { error: err }
    })
    if (!valid || (valid && valid.error)) {

        return { error: valid.error }
    }
    let userData = {
        name: params.userName,
        email_id: params.useremail,
        contact: params.phone,
        password: params.password
    }

    let data = await User.create(userData).catch((err) => { return { error: err } })
    if (!data || (data && data.error)) {
        console.log(data.error)
        return { error: "internal server error" }
    }
    return { data: data }
}


async function check(data) {
    let schema = joi.object({
        userName: joi.string().min(3).max(10).required(),
        useremail: joi.string().min(5).max(20).required(),
        phone: joi.string().min(10).max(15).required(),
        password: joi.string().min(5).max(15).required()
    })
    let valid = await schema.validateAsync(data).catch((err) => { return { error: err } })
    if (!valid || (valid && valid.error)) {
        let msg = []
        for (let i of valid.error.details) {

            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid }
}




module.exports = {
    create
}