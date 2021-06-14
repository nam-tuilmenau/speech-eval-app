'use strict'
module.exports = (sequelize, DataTypes) => {
  const DegradationCategoryRatingUser = sequelize.define('DegradationCategoryRatingUser', {
    rating: DataTypes.INTEGER,
    numberOfReproductions: DataTypes.JSON,
    startTime: DataTypes.DATE,
    finishTime: DataTypes.DATE
  }, {
    timestamps: false
  })
  DegradationCategoryRatingUser.associate = function (models) {
    // associations can be defined here
    DegradationCategoryRatingUser.belongsTo(models.ComparisonRatingPair)
    DegradationCategoryRatingUser.belongsTo(models.JobUser)
  }
  return DegradationCategoryRatingUser
}
