'use strict'

const accessStatus = require('../utils/constants').accessStatus
const constants = require('../utils/constants')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    accessStatus: {
      type: DataTypes.INTEGER,
      defaultValue: accessStatus.granted
    },
    blockTime: DataTypes.DATE,
    workerId: DataTypes.STRING,
    campaignId: DataTypes.STRING,
    unblockTime: {
      type: DataTypes.VIRTUAL,
      get: function () {
        const blockDurationInMs = (constants.blockDurationInMinutes / 60) * 3600 * 1000
        const unblockTime = new Date(this.blockTime)
        unblockTime.setMilliseconds(unblockTime.getMilliseconds() + blockDurationInMs)
        return unblockTime
      }
    },
    external: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {})
  User.associate = function (models) {
    // associations can be defined here
  }
  return User
}
