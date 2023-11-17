const { func } = require('joi');
let productModel = require('../model/productmodel')
async function addUI(req, res) {
    return res.render("product/add")
}
async function createProduct(req, res) {
    let ModelData = await productModel.create(req.body).catch((err) => {
        { return { error: err } }
    })
    console.log("this is the wrold")

    if (!ModelData || (ModelData && ModelData.error)) {
        let error = ModelData.error ? ModelData.error : "internal server error";
        return res.send({ error })
    }

    let url = (ModelData && ModelData.data && ModelData.data.id) ? '/product/' + ModelData.data.id : '/product/list'
    return res.redirect(url)


}
// let product = require('../model/productmodel')
async function viewAll(req, res) {
    console.log(req.query, "this is query")
    let product = await productModel.viewAll(req.query).catch((err) => {
        return { error: err }
    })
    if (!product || (product && product.error)) {
        return res.render("product/add", { error: product.error })
    }
    console.log(" 30", req.userData.permissions)
    return res.render("product/view", { product: product.data, total: product.total, page: product.page, limit: product.limit, permissions: req.userData.permissions })
}
async function viewDetail(req, res) {
    let products = await productModel.viewDetail(req.params.id).catch((err) => { return { error: err } })
    if (!products || (products && products.error)) {
        return res.render("product/details", { error: products.error })
    }
    console.log("hiii 36", products)
    return res.render("product/details", { product: products.data })

}
async function updateUI(req, res) {
    let products = await productModel.viewDetail(req.params.id).catch((err) => {
        return { error: err }
    })
    if (!products || (products && products.error)) {
        let url = (products && products.data && products.data.id) ? '/product/' + products.data.id : '/product';
        return res.redirect(url)
    }
    return res.render('product/update', { product: products.data })
}
async function update(req, res) {
    let products = await productModel.update(req.params.id, req.body).catch((err) => {
        return { error: err }
    })
    if (!products || (products && products.error)) {
        console.log(products.error)
        let url = (products && products.data && products.data.id) ? '/product/' + products.data.id : '/product';
        return res.redirect(url)
    }
    let url = (products && products.data && products.data.id) ? '/product/' + products.data.id : '/product/'
    return res.redirect(url)

}
async function pdelete(req, res) {
    console.log(66)
    let product = await productModel.pdelete(req.params).catch((err) => { return { error: err } })
    if (!product || (product && product.error)) {
        let url = (product && product.data && product.data.id) ? '/product/' + product.data.id : '/product';
        return res.redirect(url)
    }
    return res.redirect('/product')
}
async function restore(req, res) {
    console.log("74")
    let product = await productModel.restore(req.params).catch((err) => { return { error: err } })
    if (!product || (product && product.error)) {
        let url = (product && product.data && product.data.id) ? '/product/' + product.data.id : '/product';
        return res.redirect(url)
    }
    console.log("81")
    return res.redirect('/product')
}

// async function viewOne(req, res) {
//     let product = await productModel.viewOne(req.params.id).catch((err) => { return { error: err } })
//     if (!product || (product && product.error)) {
//         console.log(product.error)
//         return res.render("viewOne", { error: product.error })
//     }
//     return res.render("viewOne", { product: product.data })
// }
async function reglog(req, res) {
    return res.render('reglog', {})

}
module.exports = { createProduct, reglog, viewAll, addUI, updateUI, update, viewDetail, pdelete, restore }