'use strict'

module.exports = (sequelize, DataTypes) => {
  const ComparisonRatingPair = sequelize.define('ComparisonRatingPair', {
  }, {
    timestamps: false
  })
  ComparisonRatingPair.associate = function (models) {
    // associations can be defined here
    ComparisonRatingPair.belongsTo(models.Audio, {
      as: 'Processed',
      foreignKey: 'ProcessedId'
    })
    ComparisonRatingPair.belongsTo(models.Audio, {
      as: 'Reference',
      foreignKey: 'ReferenceId'
    })
  }
  return ComparisonRatingPair
}
