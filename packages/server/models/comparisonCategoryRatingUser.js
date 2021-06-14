'use strict'
module.exports = (sequelize, DataTypes) => {
  const ComparisonCategoryRatingUser = sequelize.define('ComparisonCategoryRatingUser', {
    rating: DataTypes.INTEGER,
    numberOfReproductions: DataTypes.JSON,
    startTime: DataTypes.DATE,
    finishTime: DataTypes.DATE,
    firstAudioId: DataTypes.INTEGER
  }, {
    timestamps: false
  })
  ComparisonCategoryRatingUser.associate = function (models) {
    // associations can be defined here
    ComparisonCategoryRatingUser.belongsTo(models.ComparisonRatingPair)
    ComparisonCategoryRatingUser.belongsTo(models.JobUser)
  }
  return ComparisonCategoryRatingUser
}
