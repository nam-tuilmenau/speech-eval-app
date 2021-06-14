'use strict'
module.exports = (sequelize, DataTypes) => {
  const DemographicInfo = sequelize.define('DemographicInfo', {
    gender: DataTypes.INTEGER,
    birthYear: DataTypes.INTEGER,
    deviceType: DataTypes.STRING,
    lastTimeSubjectiveTest: DataTypes.INTEGER,
    lastTimeAudioTest: DataTypes.INTEGER,
    involvedInSpeechCoding: DataTypes.BOOLEAN,
    selfListeningPerception: DataTypes.INTEGER,
    countryOfOrigin: DataTypes.STRING,
    countryOfResidence: DataTypes.STRING,
    motherTongue: DataTypes.STRING,
    secondLanguage: DataTypes.STRING
  }, {})
  DemographicInfo.associate = function (models) {
    // associations can be defined here
    DemographicInfo.belongsTo(models.User)
  }
  return DemographicInfo
}
