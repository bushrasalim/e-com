let express = require('express')
let multer = require('multer')
function uploadfile(req, res, option) {
    let limit = (option && option.limit) ? option.limit : 2 * 1000 * 1000
    let type = (option && option.type) ? option.type : 'field';
    return new Promise((req, res) => {
        if (!option.filename) {
            return rej('provide file name')
        }
        let upload = multer({ limit })
        let mul = upload.field([{ name: option.filename, maxcount: 2 }])
        mul(req, res, (err , data) => {
            if (err) { return rej(err) }
            return res({ data: true })

        })

    })

} 