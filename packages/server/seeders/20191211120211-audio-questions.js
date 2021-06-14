'use strict'
const goldAudiosInfo = require('../utils/audios_info').golds
const digitsAudiosInfo = require('../utils/audios_info').digits

const answers = [
  /* { AudioId: 'math_39', answer: '9' }, // MathQuestion
  { AudioId: 'math_40', answer: '40' },
  { AudioId: 'math_41', answer: '1' } */
]

// DigitQuestion
for (const audioInfo of digitsAudiosInfo) {
  answers.push({ AudioId: audioInfo.id, answers: JSON.stringify(audioInfo.answers) })
}

// Gold standard
for (const audioInfo of goldAudiosInfo) {
  answers.push({ AudioId: audioInfo.id, answers: JSON.stringify(['5', '4']) })
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
    return queryInterface.bulkInsert('AudioQuestions', answers, {})
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
    */
    return queryInterface.bulkDelete('AudioQuestions', null, {})
  }
}
