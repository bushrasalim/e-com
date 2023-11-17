let { sequelizeCon, Model, DataTypes } = require('../init/dbconfig')

class Category extends Model { }
Category.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },

    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    is_deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    created_by: { type: DataTypes.STRING, allowNull: false, defaultValue: 1 },
    updated_by: { type: DataTypes.STRING, allowNull: false, defaultValue: 1 }
},
    { tableName: 'category', modelName: 'Category', sequelize: sequelizeCon })

module.exports = { Category }