'use strict'

var Audio = require('../models/index').Audio
var AudioRating = require('../models/index').AudioRating
const loadAudios = require('./load_audios').loadAudios

// Rating
async function deleteRatingAudios () {
  const ratingsInfo = loadAudios('../data/rating_audios.csv')
  for (const audioInfo of ratingsInfo) {
    await AudioRating.destroy({
      where: {
        AudioId: audioInfo.id
      }
    })
    await Audio.destroy({
      where: {
        id: audioInfo.id
      }
    })
  }
}

deleteRatingAudios()
