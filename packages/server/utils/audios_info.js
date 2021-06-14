const loadAudios = require('./load_audios').loadAudios

function generateDigitsInfo () {
  const audios = []
  for (let i = 0; i <= 9; i++) {
    const answers = [`${i}`]
    audios.push({
      id: `digit_mono_${i}`,
      name: `number_${i}_mono.wav`,
      answers
    })
    audios.push({
      id: `digit_left_${i}`,
      name: `number_${i}_left.wav`,
      answers
    })
    audios.push({
      id: `digit_right_${i}`,
      name: `number_${i}_right.wav`,
      answers
    })
  }
  return audios
}

module.exports = {
  trainings: loadAudios('./data/training_audios.csv'),
  ratings: loadAudios('./data/rating_audios.csv'),
  golds: loadAudios('./data/gold_audios.csv'),
  trapping: loadAudios('./data/trapping_questions.csv'),
  comparisonTest: loadAudios('./data/comparison_test_audios.csv'),
  digits: generateDigitsInfo(),
  calibration: {
    id: 'calibration_D403_c01_ef04_s002',
    name: 'calibration_D403_c01_ef04_s002.wav'
  }
}
