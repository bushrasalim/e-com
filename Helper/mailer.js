let mailer = require('nodemailer')
function mail(mailoption) {
    return new Promise((res, rej) => {
        let transpoter = mailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
              secure: true,
            auth: {
                user: "shaikhbushra979@gmail.com",
                pass: "muct fjby iatw pqln"
            }
        })
        transpoter.sendMail(mailoption, (err, info) => {
            if (err) {
                console.log(err)
                return rej(err)
            }
            return res(`mail is send to ${mailoption.to}`)
        })
    })
}               
module.exports = { mail } 