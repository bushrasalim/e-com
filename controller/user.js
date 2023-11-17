let userModel = require('../model/usermodel')
async function createUser(req, res) {
    let ModelData = await userModel.create(req.body).catch((err) => {
        { return { error: err } }
    })
    if (!ModelData || (ModelData && ModelData.error)) {
        
        let error = ModelData.error ? ModelData.error : "internal serve error";
        return res.send({ error })
    }
    return res.send({ data: ModelData.data })
}
module.exports = { createUser } 


