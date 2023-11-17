let joi = require('joi')
let bcrypt = require('../Helper/security')
let { User } = require('../schema/userschema')
let { Userpermission } = require('../schema/u-pscehma')
const { mail } = require('../Helper/mailer')
const { generate } = require('otp-generator')

async function uservalidate(data) {
    let schema = joi.object({
        userName: joi.string().min(3).max(10).required(),
        password: joi.string().min(5).max(10).required(),
        email: joi.string().required(),
        contact: joi.string().min(10).max(15).required()
    })
    let valid = await schema.validateAsync(data).catch((err) => { return { error: err } })
    if (!valid || (valid.error)) {
        let msg = []
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid }
}
async function registration(params) {
    let check = await uservalidate(params).catch((err) => {
        return { error: err }
    })

    if (!check || (check && check.error)) {
        return { error: check.error }
    }
    console.log("hello")
    console.log(params)
    let finduser = await User.findOne({ where: { email_id: params.email } }).catch((err) => {
        return { error: err }
    })
    console.log(finduser)


    if (finduser || (finduser && finduser.error)) {
        console.log(finduser, "hiiii")
        return { error: "user already exist", status: 404 }
    }


    let password = await bcrypt.hash(params.password).catch((err) => {
        return { error: err }
    })
    console.log(password)
    if (!password || (password && password.error)) {
        return { error: "password not encrypt", status: 401 }
    }
    console.log(password)
    let userData = {
        name: params.userName,
        email_id: params.email,
        contact: params.contact,
        password: password.data
    }
    //create->insert
    let data = await User.create(userData).catch((err) => {
        return { error: err }
    })
    if (!data || (data && data.error)) {
        return { error: "not inserted into db", status: 400 }
    }
    console.log(data)
    let userPermission = {
        user_id: data.id,
        permission_id: 1
    }
    console.log("line 71")
    let upData = await Userpermission.create(userPermission).catch((err) => { return { error: err } })
    if (!upData || (upData && upData.error)) {
        console.log(upData)
        return { error: upData.error }
    }
    console.log("line 71")
    return { data: data }
}





async function loginvalidation(data) {
    let schema = joi.object({
        email: joi.string().required(),
        password: joi.string().required()
    })
    let valid = await schema.validateAsync(data).catch((err) => { return { error: err } })
    if (!valid || (valid && valid.errror)) {
        let msg = []
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid }
}
async function login(params) {
    let check = await loginvalidation(params).catch((err) => { return { error: err } })
    if (!check || (check && check.error)) {
        return { error: check.error }
    }
    console.log(params)
    let finduser = await User.findOne({ where: { email_id: params.email } }).catch((err) => { return { error: err } })
    //if (!finduser || (finduser && finduser.error)) {
    //    return { error: "user not exist", status: 402 }
    //}
    if (!finduser) {
        return { error: "user not found" }
    }

    let password = await bcrypt.compare(params.password, finduser.password).catch(err => {
        return { error: err }
    })
    if (!password || (password && password.error)) {
        console.log(password)
        return { error: password.error, status: 401 }
    }
    let token = await bcrypt.encrypt(finduser.id + "", "#1234").catch((err) => { return { error: err } })
    console.log(token)
    if (!token || (token && token.error)) {
        return { error: token.error }
    }
    let update = { token: token }
    let where = {
        where: {
            id: finduser.id
        }
    }
    let updateuser = await User.update(update, where).catch((err) => { return { error: err } })
    if (!updateuser || (updateuser && updateuser.error)) {
        return { error: "user is not updated", status: 406 }
    }

    return { data: "user login successfully", token: token }

}
async function forgetp(data) {
    let schema = joi.object({
        email: joi.string().required()
    })
    let valid = await schema.validateAsync(data).catch((err) => { return { error: err } })
    if (!valid || (valid && valid.error)) {
        let msg = []
        for (let i of valid.error.details) {
            console.log(i)
            msg.push(i.message)
        }
        return { error: msg }


    }
    return { data: valid }
}
async function reset(data) {
    let schema = joi.object({
        otp: joi.number().required(),
        password: joi.number().required()
    })
    let valid = await schema.validateAsync(data).catch((err) => { return { error: err } })
    if (!valid || (valid && valid.error)) {
        let msg = []
        for (let i of valid.error.details) {
            console.log(i)
            msg.push(i.message)
        }
        return { error: msg }


    }
    return { data: valid }
}
async function forgetpwd(params) {

    let verify = await forgetp(params).catch((err) => {
        return { error: err }
    })
    if (!verify || (verify && verify.error)) {
        console.log(verify)
        return { error: verify.error }
    }
    console.log("line 165")
    let finduser = await User.findOne({ where: { email_id: params.email } }).catch((err) => { return { error: err } })

    if (!finduser || (finduser && finduser.error)) {
        return { error: "Email doesnot exist" }
    }
    console.log("line 171")
    let otp = generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false })
    console.log(otp)
    let hashotp = await bcrypt.hash(otp).catch((err) => { return { error: err } })
    if (!hashotp || (hashotp && hashotp.error)) {
        return { error: "error while generating otp" }
    }
    let save = await User.update({ otp: hashotp.data }, { where: { id: finduser.id } }).catch((err) => {
        return { error: err }
    })
    if (!save || (save && save.error)) {
        return { error: "error while saving otp" }
    }
    let mailoption = {
        from: 'shaikhbushra979@gmail.com',
        to: params.email,
        subject: 'password reset otp',
        html: ` 
        <h1>this is your otp ${otp} </h1>
        `
    }

    let sendmail = await mail(mailoption).catch((err) => { return { error: err } })
    if (!sendmail || (sendmail && sendmail.error)) {
        return { data: 'error sending mail' }
    }
    return { data: `successfully sent mail with otp ${params.email}` }

}



module.exports = { registration, login, forgetpwd, reset }

