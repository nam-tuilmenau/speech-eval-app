'use strict'
module.exports = (sequelize, DataTypes) => {
  const ComparisonAudio = sequelize.define('ComparisonAudio', {
    type: DataTypes.INTEGER // 1: Good Quality Audio, 2: Bad Quality Audio
  }, {
    timestamps: false
  })
  ComparisonAudio.associate = function (models) {
    // associations can be defined here
    ComparisonAudio.belongsTo(models.Audio)
  }
  return ComparisonAudio
}
