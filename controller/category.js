let joi = require('joi')
let Categorymodel = require('../model/categorymodel')
const { Category } = require('../schema/categoryscehma')
async function createcategory(req, res) {
    let modeldata = await Categorymodel.create(req.body).catch((err) => { return { error: err } })

    if (!modeldata || (modeldata && modeldata.error)) {
        let error = modeldata.error ? modeldata.error : "internal server error"

        console.log(modeldata)
        return res.send({ error })
    }
    let url = (modeldata && modeldata.data && modeldata.data.id) ? '/category/' + modeldata.data.id : '/category/view';
    console.log("line 11")
    return res.redirect(url)
}
async function addUI(req, res) {
    return res.render("category/add")
}

async function view(req, res) {
    console.log(req.query, "this for category")
    let category = await Categorymodel.view(req.query).catch((err) => { return { error: err } })
    if (!category || (category && category.error)) {
        console.log(category.error)
        return res.render('category/view', { error: category.error, total: category.total, page: category.page, limit: category.limit })
    }
    return res.render('category/view', { category: category.data, total: category.total, page: category.page, limit: category.limit })
}
async function viewOne(req, res) {
    let data = await Categorymodel.viewOne(req.params.id).catch((err) => { return { error: err } })
    if (!data || (data && data.error)) {
        console.log(data.error)
        return res.render('category/viewOne', { error: data.error })
    }
    return res.render('category/viewOne', { category: data.data })
}
async function update(req, res) {
    let category = await Categorymodel.update(req.params.id, req.body).catch((err) => { return { error: err } })
    if (!category || (category && category.error)) {
        console.log(category.error)
        let url = (category && category.data && category.data.id) ? '/category/' + category.data.id : '/category';
        return res.redirecr(url)
    }
    let url = (category && category.data && category.data.id) ? '/category/' + category.data.id : '/category'
    return res.redirect(url)
}
async function updateUI(req, res) {
    let category = await Categorymodel.viewOne(req.params.id).catch((err) => {
        return { error: err }
    })
    if (!category || (category && category.error)) {
        let url = (category && category.data && category.data.id) ? '/category/' + category.data.id : '/category'
        return res.redirect(url)
    }
    return res.render('category/update', { category: category.data })

}
async function cdelete(req, res) {
    console.log(req.params.id, "this line 34")
    let Category = await Categorymodel.cdelete(req.params.id, 1).catch((err) => { return { error: err } })
    if (!Category || (Category && Category.error)) {
        console.log("line 64")
        console.log(Category.error)
        let url = (Category && Category.data && Category.data.id) ? '/category/' + Category.data.id : '/category';
        return res.redirect(url)
    }
    return res.redirect('/category')
}
async function restore(req, res) {
    let category = await Categorymodel.cdelete(req.params.id, 0).catch((err) => { return { error: err } })
    if (!category || (category && category.error)) {
        let url = (category && category.data && category.data.id) ? '/category/' + category.data.id : '/category';
        return res.redirect(url)
    }
    console.log("81")
    return res.redirect('/category')
}





module.exports = { createcategory, addUI, view, viewOne, update, updateUI, cdelete, restore }