const { DataTypes } = require('sequelize')
const { connection } = require('../../database/index')

const Tag = connection.define('tag', {
  name: {
    type: DataTypes.STRING,
  }
},
  {
    timestamps: false
  }
)

module.exports = Tag
