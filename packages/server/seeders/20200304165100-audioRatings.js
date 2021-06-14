'use strict'

const audioTasks = require('../utils/constants').audioTasks
const ratingsInfo = require('../utils/audios_info').ratings

const audioRatings = [
  /* { AudioId: 'degradation_cr_51', type: audioTasks.degradationCategoryRating.id },
  { AudioId: 'degradation_cr_53', type: audioTasks.degradationCategoryRating.id },
  { AudioId: 'comparison_cr_55', type: audioTasks.comparisonCategoryRating.id },
  { AudioId: 'comparison_cr_57', type: audioTasks.comparisonCategoryRating.id } */
]

// Rating
for (const audioInfo of ratingsInfo) {
  audioRatings.push({
    AudioId: audioInfo.id,
    condition: audioInfo.condition,
    type: audioTasks.rating.id
  })
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
    return queryInterface.bulkInsert('AudioRatings', audioRatings, {
      validate: true,
      individualHooks: true,
      hooks: true
    })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
    */
    return queryInterface.bulkDelete('AudioRatings', null, {})
  }
}
