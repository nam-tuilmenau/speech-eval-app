'use strict'
module.exports = (sequelize, DataTypes) => {
  const ExternalUrlUser = sequelize.define('ExternalUrlUser', {
    valid: DataTypes.BOOLEAN,
    assignedTime: DataTypes.DATE,
    validationTime: DataTypes.DATE,
    expired: DataTypes.BOOLEAN
  }, {
    timestamps: false
  })
  ExternalUrlUser.associate = function (models) {
    // associations can be defined here
    ExternalUrlUser.belongsTo(models.ExternalUrl)
    ExternalUrlUser.belongsTo(models.User)
  }
  return ExternalUrlUser
}
