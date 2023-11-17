

let {sequelizeCon,Model,DataTypes}=require('../init/dbconfig')
class Permission extends Model {}
Permission.init({
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    is_active:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultvalue:true
    },
    is_delete:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultvalue:true
    }
},{tableName:"Permission",modelName:"Permission",sequelize:sequelizeCon})
module.exports={Permission}