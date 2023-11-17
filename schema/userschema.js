
let { sequelizeCon, Model, DataTypes } = require("../init/dbconfig");
class User extends Model { }
User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contact: {
        type: DataTypes.STRING,
        allowNull: false

    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token:{
        type:DataTypes.STRING(500),
        allowNull:true
    },
    is_active: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: true,
    },
    is_deleted: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: false
    }
}, { tableName: 'user', modelName: "User", sequelize: sequelizeCon })
module.exports = { User }

