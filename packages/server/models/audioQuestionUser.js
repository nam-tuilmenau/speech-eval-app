'use strict'
module.exports = (sequelize, DataTypes) => {
  const AudioQuestionUser = sequelize.define('AudioQuestionUser', {
    answer: DataTypes.STRING,
    valid: DataTypes.BOOLEAN,
    numberOfReproductions: DataTypes.INTEGER,
    startTime: DataTypes.DATE,
    finishTime: DataTypes.DATE
  }, {
    timestamps: false,
    hooks: {
      beforeSave: async (audioQuestionUser, options) => {
        const audioQuestion = await sequelize.models.AudioQuestion.findByPk(audioQuestionUser.AudioQuestionId)
        audioQuestionUser.valid = audioQuestion.answers.includes(audioQuestionUser.answer.toString())
      }
    }
  })
  AudioQuestionUser.associate = function (models) {
    // associations can be defined here
    AudioQuestionUser.belongsTo(models.JobUser)
    AudioQuestionUser.belongsTo(models.AudioQuestion)
  }
  return AudioQuestionUser
}
