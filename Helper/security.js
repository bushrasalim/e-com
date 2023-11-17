let jwt = require('jsonwebtoken')
let bcrypt = require('bcrypt')

function encrypt(text, key) {
    return new Promise((res, rej) => {
        jwt.sign(text, key, (error, token) => {
            if (error) { return rej(error) }
            return res(token)
        })
    })
}

function decrypt(text, key) {
    return new Promise((res, rej) => {
        jwt.verify(text, key, (error, token) => {
            if (error) {
                return rej(error)
            }
            return res({ id: token })
        })
    })
}
async function hash(text, salt = 10) {
    let encrypt = await bcrypt.hash(text, salt).catch((err) => {
        return { error: err }
    })
    if (!encrypt || (encrypt && encrypt.error)) {
        console.log(encrypt)
        return { error: encrypt.error }
    }
    return { data: encrypt }
}
async function compare(text, encrypttext) {
    let check = await bcrypt.compare(text, encrypttext).catch((err) => {
        return { error: err }
    })
    console.log(check)
    if (!check || (check && check.error)) {
        return { error: "wrong password" }
    }
    return { data: true }


}

module.exports = { encrypt, decrypt, hash, compare }