'use strict'
module.exports = (sequelize, DataTypes) => {
  const ComparisonGoldStandardUser = sequelize.define('ComparisonGoldStandardUser', {
    answer: DataTypes.INTEGER,
    valid: DataTypes.BOOLEAN,
    numberOfReproductions: DataTypes.JSON,
    startTime: DataTypes.DATE,
    finishTime: DataTypes.DATE
  }, {
    timestamps: false,
    hooks: {
      beforeSave: async (audioQuestionUser, options) => {
        const audioQuestion = await sequelize.models.ComparisonGoldStandardPair.findByPk(audioQuestionUser.ComparisonGoldStandardPairId)
        audioQuestionUser.valid = audioQuestion.answer === audioQuestionUser.answer
      }
    }
  })
  ComparisonGoldStandardUser.associate = function (models) {
    // associations can be defined here
    ComparisonGoldStandardUser.belongsTo(models.JobUser)
    ComparisonGoldStandardUser.belongsTo(models.ComparisonGoldStandardPair)
  }
  return ComparisonGoldStandardUser
}
