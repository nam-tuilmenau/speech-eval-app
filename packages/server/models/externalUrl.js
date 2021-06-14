'use strict'

module.exports = (sequelize, DataTypes) => {
  const ExternalUrl = sequelize.define('ExternalUrl', {
    url: DataTypes.STRING,
    completionRatio: { // Based on expected valid ratings
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    valid: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    invalid: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    timestamps: false
  })
  return ExternalUrl
}
