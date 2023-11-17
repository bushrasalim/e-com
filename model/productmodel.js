let { Product } = require('../schema/productschema')
let joi = require('joi')
async function create(params) {
    let valid = await check(params).catch((err) => {
        return { error: err }
    })
    console.log("hii")
    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }
    let productData = {
        name: params.name,
        price: params.price,
        description: params.description
    }
    // console.log(productData, "this your data")
    let data = await Product.create(productData).catch((err) => { return { error: err } })
    console.log(data, "the product in added to database")
    if (!data || (data && data.error)) {
        console.log(data.error)
        return { error: "internal server error" }
    }
    return { data: data }

}
async function check(data) {
    let schema = joi.object({
        name: joi.string().min(3).max(15).required(),
        price: joi.string().required(),
        description: joi.string().required()
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
//viewAll
async function viewAll(params) {
    let limit = (params.limit) ? parseInt(params.limit) : 5;
    let page = (params.page) ? parseInt(params.page) : 1;
    let offset = (page - 1) * limit
    let counter = await Product.count().catch((err) => { return { error: err } })
    if (!counter || (counter && counter.error)) {
        return { error: counter.error }
    }
    if (counter <= 0) {
        return { error: 'record not found' }
    }
    let data = await Product.findAll({ limit, offset }).catch((err) => { return { error: err } })
    if (!data || (data && data.error)) {
        return { error: "internal server error", status: 500 }
    }

    return { data: data, total: counter, page, limit }

}
async function viewDetail(id) {
    let data = await Product.findOne({ where: { id } }).catch((err) => { return { error: err } })
    if (!data || (data && data.error)) {
        return { error: "internal server error", status: 500 }
    }
    return { data: data }
}
async function checkUpdate(data) {
    let schema = joi.object({
        id: joi.number().required(),
        name: joi.string().min(3).max(10),
        price: joi.number(),
        description: joi.string().min(4).max(50)
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
async function update(id, params) {
    params.id = id
    let valid = await checkUpdate(params).catch((err) => { return { error: err } })

    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }
    let data = await Product.findOne({ where: { id }, raw: true }).catch((err) => { return { error: err } })
    if (!data || (data && data.error)) {
        return { error: "internal server error", status: 500 }
    }
    data.name = params.name;
    data.price = params.price;
    data.description = params.description;

    let upadateproduct = await Product.update(data, { where: { id } }).catch((error) => { return { error } })
    if (!upadateproduct(upadateproduct && upadateproduct.error)) {
        return { error: "internal server error", status: 500 }
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
async function pdelete(params) {

    let valid = await checkdelete(params).catch((err) => { return { err } })

    if (!valid || (valid && valid.error)) {

        return { error: valid.error }
    }

    let data = await Product.findOne({ where: { id: params.id }, raw: true }).catch((err) => { return { error: err } })
    if (!data || (data && data.error)) {
        return { error: "internal server error", status: 500 }
    }

    if (data.is_deleted == true) {
        return { error: 'Product already deleted' }
    }
    let updateproduct = await Product.update({ is_deleted: true }, { where: { id: params.id } }).catch((error) => { return { error } })
    if (!updateproduct || (updateproduct && updateproduct.error)) {
        return { error: "internal server error", status: 500 }
    }

    if (updateproduct <= 0) {
        return { error: "record not deleted" }
    }


    return { data: "record successfully deleted" }
}
//restore
async function restore(params) {
    let valid = await checkdelete(params).catch((err) => {
        return { err }
    })

    if (!valid || (valid && valid.error)) {
        console.log(valid.error)
        return { error: valid.error }
    }

    let product = await Product.findOne({ where: { id: params.id }, raw: true }).catch((err) => { return { error: err } })
    if (!product || (product && product.error)) {
        return { error: "internal server error", status: 500 }
    }

    if (product.is_deleted == false) {
        return { error: "Product is not deleted" }
    }
    let updateproduct = await Product.update({ is_deleted: false }, { where: { id: params.id } }).catch((err) => {
        return { error: err }
    })

    if (!updateproduct || (updateproduct && updateproduct.error)) {
        return { error: "internal server error", status: 500 }
    }
    if (updateproduct <= 0) {
        return { error: "Record not restored" }
    }
    return { data: "Record Successfully Restored" }
}

//viewOne
// async function viewOne(id) {

//     //if (!verify || (verify && verify.error)) {
//     //return { error: verify.error }

//     let data = await Product.findOne({ where: { id: id } }).catch((err) => { return { err } })
//     if (!data || (data && data.error)) {
//         return { err: "not found", status: 500 }
//     }
//     return { data: data }
// }


module.exports = { create, viewAll, update, viewDetail, pdelete, restore }