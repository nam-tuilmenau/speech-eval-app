'use strict'
module.exports = (sequelize, DataTypes) => {
  const AudioQuestion = sequelize.define('AudioQuestion', {
    answers: DataTypes.JSON
  }, {
    timestamps: false
  })
  AudioQuestion.associate = function (models) {
    // associations can be defined here
    AudioQuestion.belongsTo(models.Audio)
  }
  return AudioQuestion
}
