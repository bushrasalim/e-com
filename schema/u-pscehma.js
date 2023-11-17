let { sequelizeCon, Model, DataTypes } = require('../init/dbconfig.js')
class Userpermission extends Model { }
Userpermission.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    permission_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    is_delete: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true

    }

}, { tableName: "userpermission", modelName: "Userpermission", sequelize: sequelizeCon })
module.exports = { Userpermission }