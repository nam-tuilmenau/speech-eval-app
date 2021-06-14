'use strict'

const audioTasks = require('../utils/constants').audioTasks

module.exports = (sequelize, DataTypes) => {
  const AudioRating = sequelize.define('AudioRating', {
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
    },
    condition: DataTypes.STRING,
    type: {
      type: DataTypes.INTEGER,
      defaultValue: audioTasks.rating.id.toString()
    }
  }, {
    timestamps: false
  })
  AudioRating.associate = function (models) {
    // associations can be defined here
    AudioRating.belongsTo(models.Audio)
  }
  return AudioRating
}
