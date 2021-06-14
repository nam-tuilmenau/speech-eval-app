'use strict'
module.exports = (sequelize, DataTypes) => {
  function addAudioRating (audio) {
    const ratingTask = 3
    if (audio.task === ratingTask) {
      sequelize.models.AudioRating.create({
        AudioId: audio.id
      })
    }
  }
  const Audio = sequelize.define('Audio', {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    src: DataTypes.STRING,
    task: {
      type: DataTypes.INTEGER, // 1: Callibration, 2:Training, 3: Rating, 4: DigitQuestion, 5: MathQuestion, 6: Comparison Test, 7: Comparison Rating,  8: GoldStandardQuestion
      defaultValue: 1
    }
  }, {
    timestamps: false,
    hooks: {
      afterCreate: (audio, options) => {
        addAudioRating(audio)
      },
      afterBulkCreate: (audios, options) => {
        for (const audio of audios) {
          addAudioRating(audio)
        }
      }
    }
  })
  Audio.associate = function (models) {
    // associations can be defined here
  }
  return Audio
}
