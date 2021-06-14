'use strict'

module.exports = (sequelize, DataTypes) => {
  const ComparisonGoldStandardPair = sequelize.define('ComparisonGoldStandardPair', {
    type: DataTypes.INTEGER,
    answer: DataTypes.INTEGER
  }, {
    timestamps: false
  })
  ComparisonGoldStandardPair.associate = function (models) {
    // associations can be defined here
    ComparisonGoldStandardPair.belongsTo(models.Audio, {
      as: 'AudioA',
      foreignKey: 'AudioAId'
    })
    ComparisonGoldStandardPair.belongsTo(models.Audio, {
      as: 'AudioB',
      foreignKey: 'AudioBId'
    })
  }
  return ComparisonGoldStandardPair
}
