let Model = require('../model/authentication')
async function register(req, res) {
    console.log(req.body)
    let verify = await Model.registration(req.body).catch((err) => { return { error: err } })
    if (!verify || (verify && verify.error)) {
        console.log(verify.error)
        let error = verify.error ? verify.error : "internal server error"
        return res.send({ error: error })
    }

    return res.redirect("/?msg=success")

}
async function resetPassword(req, res) {
    let data = await Model.resetPassword(req.body, req.params.email).catch((err) => { return { error: err } })
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data : "internal server error"
        return res.send({ error })
    }
    return res.render("resetpassword", { email: req.body.email })
}
async function login(req, res) {
    let loginvalidation = await Model.login(req.body).catch((err) => { return { error: err } })
    if (!loginvalidation || (loginvalidation && loginvalidation.error)) {
        let error = (loginvalidation && loginvalidation.error) ?
            loginvalidation.error : "internal server error"
        console.log(error);
        return res.send({ error: error })
    }
    req.session.token = loginvalidation.token
    return res.redirect("/dashboard")
}
async function forgetpUI(req, res) {
    return res.render("forgetpassword", {})
}
async function forgetpassword(req, res) {
    let forgetdata = await Model.forgetpwd(req.body).catch((err) => { return { error: err } })
    if (!forgetdata || (forgetdata && forgetdata.error)) {
        let error = (forgetdata && forgetdata.error) ? forgetdata : "internal server error"
        return res.send({ error })
    }
    return res.render("resetpassword", { email: req.body.email })

}
async function index(req, res) {
    res.render('reglog', {})
}

async function register_UI(req, res) {
    res.render('register', {})

}
module.exports = { register, login, register_UI, index, forgetpassword, forgetpUI, resetPassword } 