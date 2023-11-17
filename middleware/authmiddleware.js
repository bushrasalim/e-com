let { sequelizeCon, QueryTypes } = require("../init/dbconfig")
let Security = require('../Helper/security')
function auth(permission) {
    return async (req, res, next) => {
        let token = req.session.token
        console.log("hello")
        if (typeof (token) != "string") {
            return res.redirect('/login?msg=unauthorized1')
        }
        let decrypt = await Security.decrypt(token, "#1234").catch((err) => { return { error: err } })
        if (!decrypt || (decrypt && decrypt.error)) {
            return res.redirect('/login?msg=unauthorized2')
        }
        let query = `select user.id,user.name,user.email_id, p.name as permission
        from user
        left join userpermission  as up
        on user.id=up.user_id
        left join permission as p
        on up.permission_id=p.id
        where user.id=${decrypt.id}
        and token='${token}';`
        let user = await sequelizeCon.query(query, { type: QueryTypes.SELECT }).catch((err) => { return { error: err } })
        if (!user || (user && user.error)) {
            console.log(user.error)
            return res.redirect('/login?msg=not authorized3')
        }
        let permissions = {}
        for (let i of user) {
            if (i.permission) {
                permissions[i.permission] = true
            }
        }
        if (permissions.length <= 0 || !permissions[permission]) {
            console.log(permissions)
            return res.redirect('/login?msg=not authorized4')
        }
        req["userData"] = {
            name: user[0].name,
            id: user[0].id,
            email: user[0].email_id,
            permissions
        }
        next();

    }
}


module.exports = { auth } 