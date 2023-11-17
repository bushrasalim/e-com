const c = require('config')
let { Category } = require('../schema/categoryscehma')
let joi = require('joi')
async function create(params) {
    let valid = await check(params).catch((err) => {
        return { error: err }
    })
    if (!valid || (valid && valid.error)) {
        console.log(valid.error)
        return { error: valid.error }

    }
    let findcategory = await Category.findOne({ where: { name: params.name } }).catch((err) => { return { error: err } })
    if (findcategory || (findcategory && findcategory.error)) {
        return { error: "category already exist" }
    }
    let categorydata = {
        name: params.name
    }
    let data = await Category.create(categorydata).catch((err) => { return { error: err } })
    if (!data || (data && data.error)) {
        return { error: data.error }
    }
    return { data: data }
}
async function check(data) {
    console.log("line 30")
    let schema = joi.object({
        name: joi.string().required()
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
async function viewAll(data) {
    let schema = joi.object({
        name: joi.string().required(),
        image: joi.string()
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
async function view(params) {
    let limit = (params.limit) ? parseInt(params.limit) : 5;
    let page = (params.page) ? parseInt(params.page) : 1;
    let offset = (page - 1) * limit
    let counter = await Category.count().catch((err) => { return { error: err } })
    if (!counter || (counter && counter.error)) {
        return { error: "error in counting" }
    }
    console.log(counter, "this is counter")
    let data = await Category.findAll({ limit, offset }).catch((err) => { return { error: err } })
    if (!data || (data && data.error)) {
        console.log(data.error, "this data.error")
        return { error: "internal server error", status: 500 }
    }
    return { data: data, total: counter, page, limit }
}

async function viewOne(id) {
    let data = await Category.findOne({ where: { id } }).catch((err) => { return { error: err } })
    if (!data || (data && data.error)) {
        return { error: "not found" }
    }
    return { data: data }
}

async function checkupdate(data) {
    let schema = joi.object({
        id: joi.number(),
        name: joi.string().required(),

    })
    let valid = await schema.validateAsync(data).catch((err) => { return { error: err } })
    console.log("line 90")
    if (!valid || (valid && valid.error)) {
        let msg = []
        for (let i of valid.error.details) {

            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid }
}
async function update(id, params) {
    params.id = id
    let valid = await checkupdate(params).catch((err) => { return { error: err } })
    if (!valid || (valid && valid.error)) {

        return { error: valid.error }
    }
    console.log('line 104')
    let data = await Category.findOne({ where: { id }, raw: true }).catch((err) => { return { error: err } })
    console.log("line 105")
    if (!data || (data && data.error)) {
        return { error: "internal server error", status: 500 }
    }
    data.name = params.name
    let update = await Category.update(data, { where: { id } }).catch((err) => {
        return { error: err }
    })
    if (!update || (update && update.error)) {
        return { error: "internal server error2", status: 500 }
    }


    return { data: data }
}

async function checkdelete(data) {
    let schema = joi.object({
        id: joi.number().required()
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
async function cdelete(id, decision) {
    let valid = await checkdelete({ id }).catch((err) => { return { error: err } })
    if (!valid || (valid && valid.error)) {

        return { error: valid.error }
    }

    let data = await Category.findOne({ where: { id }, raw: true }).catch((err) => { return { error: err } })

    if (!data || (data && data.error)) {
        return { error: 'internal server error', status: 500 }
    }
    if (data.is_deleted == decision) {
        return { error: "category is already deleted" }
    }
    console.log(decision, "this is decision")
    let updatecategory = await Category.update({ is_deleted: decision }, { where: { id } }).catch((err) => { return { error: err } })
    if (!updatecategory || (updatecategory && updatecategory.error)) {
        return { error: "internal server error", status: 500 }
    }
    if (updatecategory <= 0) {
        return { error: "record is not deleted" }
    }
    return { data: "record successfully deleted" }
}


module.exports = { create, viewAll, viewOne, update, cdelete, view }