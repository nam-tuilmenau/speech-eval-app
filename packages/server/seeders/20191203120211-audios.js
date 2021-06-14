'use strict'
const audioTasks = require('../utils/constants').audioTasks
const audiosBaseUrl = require('../utils/constants').audiosBaseUrl
const loadAudiosInfo = require('../utils/audios_info')

const ratingsInfo = loadAudiosInfo.ratings
const goldsInfo = loadAudiosInfo.golds
const digitsInfo = loadAudiosInfo.digits
const trainingsInfo = loadAudiosInfo.trainings
const calibration = loadAudiosInfo.calibration

const audios = []
// Calibration
audios.push({
  id: calibration.id,
  src: audiosBaseUrl + calibration.name,
  task: audioTasks.callibration.id
})

// Training
for (const audioInfo of trainingsInfo) {
  audios.push({
    id: audioInfo.id,
    src: audiosBaseUrl + audioInfo.name,
    task: audioTasks.training.id
  })
}

// Rating
for (const audioInfo of ratingsInfo) {
  audios.push({
    id: audioInfo.id,
    src: audiosBaseUrl + audioInfo.name,
    task: audioTasks.rating.id
  })
}

// Gold standard
for (const audioInfo of goldsInfo) {
  audios.push({
    id: audioInfo.id,
    src: audiosBaseUrl + audioInfo.name,
    task: audioTasks.goldStandardQuestion.id
  })
}

// Digit
for (const audioInfo of digitsInfo) {
  audios.push({
    id: audioInfo.id,
    src: audiosBaseUrl + audioInfo.name,
    task: audioTasks.digitQuestion.id
  })
}

/*
// Math
for (let i = 39; i <= 41; i++) {
  audios.push({ id: `math_${i}`, src: `${i}.mp3`, task: audioTasks.mathQuestion.id })
}

// Comparison Test
for (let i = 47; i <= 50; i++) {
  audios.push({ id: `comparison_${i}`, src: `${i}.mp3`, task: audioTasks.comparisonTest.id })
}

// Degradation category rating
for (let i = 51; i <= 54; i++) {
  audios.push({ id: `degradation_cr_${i}`, src: `${i}.mp3`, task: audioTasks.degradationCategoryRating.id })
}

// Comparison category rating
for (let i = 55; i <= 58; i++) {
  audios.push({ id: `comparison_cr_${i}`, src: `${i}.mp3`, task: audioTasks.comparisonCategoryRating.id })
}

// Gold standard DCR
for (let i = 59; i <= 62; i++) {
  audios.push({ id: `gold_dcr_${i}`, src: `${i}.mp3`, task: audioTasks.goldStandardDCR.id })
}
*/

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
    return queryInterface.bulkInsert('Audios', audios, {})
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
    */
    return queryInterface.bulkDelete('Audios', null, {})
  }
}
