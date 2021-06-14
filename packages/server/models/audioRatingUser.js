'use strict'
module.exports = (sequelize, DataTypes) => {
  const AudioRatingUser = sequelize.define('AudioRatingUser', {
    rating: DataTypes.INTEGER,
    numberOfReproductions: DataTypes.INTEGER,
    startTime: DataTypes.DATE,
    finishTime: DataTypes.DATE
  }, {
    timestamps: false
  })
  AudioRatingUser.associate = function (models) {
    // associations can be defined here
    AudioRatingUser.belongsTo(models.Audio)
    AudioRatingUser.belongsTo(models.JobUser)
  }
  return AudioRatingUser
}
