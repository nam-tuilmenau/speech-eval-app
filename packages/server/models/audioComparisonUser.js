'use strict'
module.exports = (sequelize, DataTypes) => {
  const AudioComparisonUser = sequelize.define('AudioComparisonUser', {
    answer: DataTypes.INTEGER,
    task: DataTypes.INTEGER,
    valid: DataTypes.BOOLEAN,
    numberOfReproductions: DataTypes.JSON,
    startTime: DataTypes.DATE,
    finishTime: DataTypes.DATE
  }, {
    timestamps: false,
    hooks: {
      beforeSave: async (audioComparisonUser, options) => {
        const neutralAnswer = -1
        const goodQualityType = 1
        const sampleA = await sequelize.models.ComparisonAudio.findOne({ where: { AudioId: audioComparisonUser.SampleAId } })
        const sampleB = await sequelize.models.ComparisonAudio.findOne({ where: { AudioId: audioComparisonUser.SampleBId } })

        fixIds()
        determineValidity()

        function fixIds () {
          if (audioComparisonUser.answer !== neutralAnswer) {
            audioComparisonUser.answer = sampleA.AudioId === audioComparisonUser.answer ? sampleA.id : sampleB.id
          }
        }
        function determineValidity () {
          console.log(audioComparisonUser.answer)
          if (sampleA.type === sampleB.type) {
            audioComparisonUser.valid = audioComparisonUser.answer === neutralAnswer
          } else {
            const selectedSample = sampleA.id === audioComparisonUser.answer ? sampleA : sampleB
            audioComparisonUser.valid = selectedSample.type === goodQualityType
          }
        }
      }
    }
  })
  AudioComparisonUser.associate = function (models) {
    // associations can be defined here
    AudioComparisonUser.belongsTo(models.JobUser)
    AudioComparisonUser.belongsTo(models.Audio, {
      as: 'SampleA',
      foreignKey: 'SampleAId'
    })
    AudioComparisonUser.belongsTo(models.Audio, {
      as: 'SampleB',
      foreignKey: 'SampleBId'
    })
  }
  return AudioComparisonUser
}
