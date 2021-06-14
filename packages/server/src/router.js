const shuffle = require('lodash/shuffle')
const cloneDeep = require('lodash/cloneDeep')
const random = require('lodash/random')
const uniq = require('lodash/uniq')
const chalk = require('chalk')
const constants = require('../utils/constants')
const log = require('simple-node-logger').createSimpleLogger('speechAppLog.log')
const express = require('express')
const router = express.Router()
const sequelize = require('../models/index').sequelize
const Op = require('../models/index').Sequelize.Op
var DemographicInfo = require('../models/index').DemographicInfo
var AudioQuestion = require('../models/index').AudioQuestion
var User = require('../models/index').User
var AudioQuestionUser = require('../models/index').AudioQuestionUser
var AudioRatingUser = require('../models/index').AudioRatingUser
var AudioComparisonUser = require('../models/index').AudioComparisonUser
var ComparisonRatingPair = require('../models/index').ComparisonRatingPair
var Audio = require('../models/index').Audio
var AudioRating = require('../models/index').AudioRating
var JobUser = require('../models/index').JobUser
var DegradationCategoryRatingUser = require('../models/index').DegradationCategoryRatingUser
var ComparisonCategoryRatingUser = require('../models/index').ComparisonCategoryRatingUser
var ComparisonGoldStandardPair = require('../models/index').ComparisonGoldStandardPair
var ComparisonGoldStandardUser = require('../models/index').ComparisonGoldStandardUser
var ExternalUrl = require('../models/index').ExternalUrl
var ExternalUrlUser = require('../models/index').ExternalUrlUser
var ComparisonAudio = require('../models/index').ComparisonAudio
const countries = require('country-list')

var CsvParser = require('json2csv').Parser

router.use(expirationChecker)

// Add new user
router.post('/users', (req, res) => {
  const worker = {
    workerId: req.body.workerId,
    campaignId: req.body.campaignId
  }
  initUniqueSession(worker, req, res)
})

router.post('/update_user', async (req, res) => {
  try {
    await createOrUpdate(
      User,
      req.body,
      {
        id: req.body.id
      }
    )
    res.send({
      success: true,
      message: 'The user was updated successfully'
    })
  } catch (error) {
    handleError({
      res,
      error,
      message: 'Error saving users'
    })
  }
})

// Add new DemographicInfo
router.post('/demographic_infos', async (req, res) => {
  try {
    const demographicInfo = await createOrUpdate(
      DemographicInfo,
      {
        UserId: req.session.userId,
        gender: req.body.gender,
        birthYear: req.body.birthYear,
        countryOfOrigin: req.body.countryOfOrigin,
        countryOfResidence: req.body.countryOfResidence,
        motherTongue: req.body.motherTongue,
        secondLanguage: req.body.secondLanguage,
        deviceType: req.body.deviceType,
        lastTimeSubjectiveTest: req.body.lastTimeSubjectiveTest,
        lastTimeAudioTest: req.body.lastTimeAudioTest,
        involvedInSpeechCoding: req.body.involvedInSpeechCoding,
        selfListeningPerception: req.body.selfListeningPerception
      },
      {
        UserId: req.session.userId
      }
    )
    res.send({
      success: true,
      message: `DemographicInfo saved successfully with ID ${demographicInfo.id}!`
    })
  } catch (error) {
    handleError({
      res,
      error,
      message: 'Error saving demographic info'
    })
  }
})

// Audios
router.get('/audios', async (req, res) => {
  try {
    const jobAudios = await selectJobAudios(
      req.session.jobId, req.session.userId
    )
    res.send({
      success: true,
      audios: jobAudios
    })
  } catch (error) {
    handleError({
      res,
      error,
      message: 'Error retrieving audios'
    })
  }
})

// Add new DigitTestQuestionUsers
router.post('/digit_test_questions_user', async (req, res) => {
  try {
    const creations = req.body.map(answer => {
      return addAudioQuestionUser(req, res, answer)
    })
    await Promise.all(creations)
    res.send({
      success: true,
      message: req.session.jobUserId
    })
  } catch (error) {
    handleError({
      res,
      error,
      message: 'Error saving digit test question'
    })
  }
})

// Add new MathQuestionQuestionUser
router.post('/math_question_user', async (req, res) => {
  try {
    await addAudioQuestionUser(req, res, req.body)
    res.send({
      success: true,
      message: req.session.jobUserId
    })
  } catch (error) {
    handleError({
      res,
      error,
      message: 'Error saving math question'
    })
  }
})

// Add new GoldStandardUser
router.post('/gold_standard_user', async (req, res) => {
  try {
    await addAudioQuestionUser(req, res, req.body)
    res.send({
      success: true,
      message: req.session.jobUserId
    })
  } catch (error) {
    handleError({
      res,
      error,
      message: 'Error saving rating (GD)'
    })
  }
})

// Add new GoldStandardUser
router.post('/trapping_question_user', async (req, res) => {
  try {
    await addAudioQuestionUser(req, res, req.body)
    res.send({
      success: true,
      message: req.session.jobUserId
    })
  } catch (error) {
    handleError({
      res,
      error,
      message: 'Error saving rating (GD)'
    })
  }
})

router.post('/comparison_gold_standard_user', async (req, res) => {
  try {
    await createOrUpdate(
      ComparisonGoldStandardUser,
      {
        JobUserId: req.session.jobUserId,
        ComparisonGoldStandardPairId: req.body.comparisonGoldStandardPairId,
        answer: req.body.userAnswer,
        numberOfReproductions: req.body.numberOfReproductions,
        startTime: req.body.startTime,
        finishTime: req.body.finishTime
      },
      {
        JobUserId: req.session.jobUserId,
        ComparisonGoldStandardPairId: req.body.comparisonGoldStandardPairId
      })
    res.send({
      success: true,
      message: req.session.jobUserId
    })
  } catch (error) {
    handleError({
      res,
      error,
      message: 'Error saving rating (GD)'
    })
  }
})

router.post('/audio_comparison', async (req, res) => {
  try {
    logInFile({
      JobUserId: req.session.jobUserId,
      SampleAId: req.body.sampleAId,
      SampleBId: req.body.sampleBId,
      task: req.body.task,
      answer: req.body.answer,
      numberOfReproductions: req.body.numberOfReproductions,
      startTime: req.body.startTime,
      finishTime: req.body.finishTime
    })
    await createOrUpdate(
      AudioComparisonUser,
      {
        JobUserId: req.session.jobUserId,
        SampleAId: req.body.sampleAId,
        SampleBId: req.body.sampleBId,
        task: req.body.task,
        answer: req.body.answer,
        numberOfReproductions: req.body.numberOfReproductions,
        startTime: req.body.startTime,
        finishTime: req.body.finishTime
      },
      {
        JobUserId: req.session.jobUserId,
        SampleAId: req.body.sampleAId,
        SampleBId: req.body.sampleBId,
        task: req.body.task
      }
    )
    res.send({ success: true })
  } catch (error) {
    handleError({
      res,
      error,
      message: 'Error saving audio comparison'
    })
  }
})

router.post('/audio_rating_user', async (req, res) => {
  try {
    await createOrUpdate(
      AudioRatingUser,
      {
        JobUserId: req.session.jobUserId,
        AudioId: req.body.audioId,
        rating: req.body.rating,
        numberOfReproductions: req.body.numberOfReproductions,
        startTime: req.body.startTime,
        finishTime: req.body.finishTime
      },
      {
        JobUserId: req.session.jobUserId,
        AudioId: req.body.audioId
      }
    )
    res.send({
      success: true,
      message: req.session.jobUserId
    })
  } catch (error) {
    handleError({
      res,
      error,
      message: 'Error saving rating'
    })
  }
})

router.post('/degradation_category_rating_user', async (req, res) => {
  try {
    await createOrUpdate(
      DegradationCategoryRatingUser,
      {
        JobUserId: req.session.jobUserId,
        ComparisonRatingPairId: req.body.comparisonRatingPairId,
        rating: req.body.rating,
        numberOfReproductions: req.body.numberOfReproductions,
        startTime: req.body.startTime,
        finishTime: req.body.finishTime
      },
      {
        JobUserId: req.session.jobUserId,
        ComparisonRatingPairId: req.body.comparisonRatingPairId
      }
    )
    res.send({
      success: true,
      message: req.session.jobUserId
    })
  } catch (error) {
    handleError({
      res,
      error,
      message: 'Error saving rating'
    })
  }
})

router.post('/comparison_category_rating_user', async (req, res) => {
  try {
    await createOrUpdate(
      ComparisonCategoryRatingUser,
      {
        JobUserId: req.session.jobUserId,
        ComparisonRatingPairId: req.body.comparisonRatingPairId,
        rating: req.body.rating,
        numberOfReproductions: req.body.numberOfReproductions,
        startTime: req.body.startTime,
        finishTime: req.body.finishTime,
        firstAudioId: req.body.firstAudioId
      },
      {
        JobUserId: req.session.jobUserId,
        ComparisonRatingPairId: req.body.comparisonRatingPairId
      }
    )
    res.send({
      success: true,
      message: req.session.jobUserId
    })
  } catch (error) {
    handleError({
      res,
      error,
      message: 'Error saving rating'
    })
  }
})

// Finish session
router.post('/finish', async (req, res) => {
  try {
    const jobUser = await finishJobUserSession(req, res)
    await updateNumberOfValidRatings(jobUser, res)
    res.send({
      success: true
    })
    req.session.destroy()
  } catch (error) {
    handleError({
      res,
      error,
      message: 'Error finishing job',
      destroySession: true
    })
  }
})

router.use('/close_session', (req, res) => {
  req.session.destroy()
})

router.get('/admin_config', (req, res) => {
  const config = {
    audioTasks: constants.audioTasks,
    accessStatusInfo: constants.accessStatusInfo
  }
  res.send({
    success: true,
    config
  })
})

router.get('/config', (req, res) => {
  const config = {
    audioTasks: constants.audioTasks,
    trainingJob: constants.trainingJob,
    ratingJob: constants.ratingJob,
    qualificationJob: constants.qualificationJob,
    countries: constants.countries,
    languages: constants.languages,
    jobsAreSeparated: constants.shouldBeManuallyReviewed
  }
  res.send({
    success: true,
    config
  })
})

router.post('/check_client', async (req, res) => {
  try {
    const jobUser = await JobUser.findByPk(req.body.jobUserId)
    res.send({
      success: true,
      validClient: jobUser.clientUUID === req.body.clientUUID
    })
  } catch (error) {
    handleError({
      res,
      error,
      message: 'Error checking session'
    })
  }
})

router.get('/last_job_users', async (req, res) => {
  try {
    const normalizedPage = parseInt(req.query.page) - 1
    const { count, rows } = await getLastJobUsers({
      page: normalizedPage,
      itemsPerPage: parseInt(req.query.itemsPerPage),
      orderBy: req.query.orderBy,
      desc: !!JSON.parse(req.query.desc),
      substring: req.query.substring
    })
    const internalCompletion = await completionRatio(AudioRating)
    const externalCompletion = await completionRatio(ExternalUrl)
    res.send({
      success: true,
      lastJobUsers: rows,
      total: count,
      completion: {
        internal: internalCompletion,
        external: externalCompletion
      }
    })
  } catch (error) {
    handleError({
      res,
      error,
      message: 'Error fetching last user sessions'
    })
  }
})

router.post('/start_url', async (req, res) => {
  try {
    let worker = {
      workerId: req.body.workerId,
      campaignId: req.body.campaignId
    }
    if (!worker.workerId) {
      worker = await determineParametersForEmptyWorker()
    }
    if (!worker.campaignId) {
      worker.campaignId = constants.emptyCampaignId
    }
    const urlInfo = await determineStartUrl(worker)
    res.send({
      success: true,
      urlInfo,
      worker
    })
  } catch (error) {
    handleError({
      res,
      error,
      message: 'Error determining start url'
    })
  }
})

router.get('/external_urls', async (req, res) => {
  try {
    const urls = await ExternalUrl.findAll({
      attributes: ['url', 'completionRatio', 'valid', 'invalid']
    })
    res.send(urls)
  } catch (error) {
    handleError({
      res,
      error,
      message: 'Error retrieving external urls'
    })
  }
})

router.get('/external_workers', async (req, res) => {
  try {
    const workers = await ExternalUrlUser.findAll({
      attributes: [
        'valid',
        'assignedTime',
        'validationTime'
      ],
      include: [
        { model: User, attributes: ['workerId', 'campaignId'] },
        { model: ExternalUrl, attributes: ['url'] }
      ]
    })
    res.send(workers)
  } catch (error) {
    handleError({
      res,
      error,
      message: 'Error retrieving external workers'
    })
  }
})

router.get('/valid_external_workers', async (req, res) => {
  try {
    const workers = await ExternalUrlUser.findAll({
      attributes: [
        'valid',
        'assignedTime',
        'validationTime'
      ],
      include: [
        { model: User, attributes: ['workerId', 'campaignId'] },
        { model: ExternalUrl, attributes: ['url'] }
      ],
      where: {
        valid: true
      }
    })
    res.send(workers)
  } catch (error) {
    handleError({
      res,
      error,
      message: 'Error retrieving external workers'
    })
  }
})

router.post('/validate_external_worker', async (req, res) => {
  try {
    const externalUrlUser = await ExternalUrlUser.findOne({
      where: {
        '$User.workerId$': req.body.workerId,
        '$User.campaignId$': req.body.campaignId,
        '$ExternalUrl.url$': req.body.url
      },
      include: [
        { model: User },
        { model: ExternalUrl }
      ]
    })
    if (!externalUrlUser) {
      throw Error('workerWithUrlNotFound')
    }
    externalUrlUser.valid = req.body.valid
    externalUrlUser.validationTime = new Date()
    await externalUrlUser.save()
    await updateCompletionRatesExternalUrls()
    res.send({
      success: true
    })
  } catch (error) {
    handleError({
      res,
      error,
      message: 'Error validating external worker.'
    })
  }
})

router.get('/results_long', async (req, res) => {
  try {
    const longResults = await getLongResultsCSV()
    res.header('Content-Type', 'text/csv')
    res.attachment('long_results_tu_ilmenau.csv')
    res.send(longResults)
  } catch (error) {
    handleError({
      res,
      error,
      message: 'Error generating long_results_tu_ilmenau.'
    })
  }
})

router.get('/valid_payment_codes', async (req, res) => {
  try {
    const paymentCodes = await getValidPaymentCodesCSV()
    res.header('Content-Type', 'text/csv')
    res.attachment('valid_payment_codes.csv')
    res.send(paymentCodes)
  } catch (error) {
    handleError({
      res,
      error,
      message: 'Error generating valid_payment_codes.'
    })
  }
})

router.get('/valid_payment_codes_as_user', async (req, res) => {
  try {
    const paymentCodes = await getValidPaymentCodesCSV(true)
    res.header('Content-Type', 'text/csv')
    res.attachment('valid_payment_codes_as_user.csv')
    res.send(paymentCodes)
  } catch (error) {
    handleError({
      res,
      error,
      message: 'Error generating valid_payment_codes_as_user.'
    })
  }
})

router.get('/valid_demographics', async (req, res) => {
  try {
    const demographics = await getValidDemographicsCSV()
    res.header('Content-Type', 'text/csv')
    res.attachment('valid_demographics.csv')
    res.send(demographics)
  } catch (error) {
    handleError({
      res,
      error,
      message: 'Error generating valid_demographics.'
    })
  }
})

router.get('/valid_user_sessions', async (req, res) => {
  try {
    const demographics = await getSessionsOfValidUsersCSV()
    res.header('Content-Type', 'text/csv')
    res.attachment('valid_user_sessions.csv')
    res.send(demographics)
  } catch (error) {
    handleError({
      res,
      error,
      message: 'Error generating valid_user_sessions.'
    })
  }
})

router.get('/valid_external_workers_csv', async (req, res) => {
  try {
    const workers = await ExternalUrlUser.findAll({
      attributes: [
        'valid',
        'assignedTime',
        'validationTime',
        'UserId'
      ],
      include: [
        { model: ExternalUrl, attributes: ['url'] }
      ],
      where: {
        valid: true
      },
      raw: true
    })
    res.header('Content-Type', 'text/csv')
    res.attachment('valid_external_workers.csv')
    res.send(parseJsonToCSV(
      [
        'assignedTime',
        'validationTime',
        'UserId',
        'ExternalUrl.url'
      ],
      workers
    ))
  } catch (error) {
    handleError({
      res,
      error,
      message: 'Error retrieving external workers'
    })
  }
})

async function getSessionsOfValidUsersCSV () {
  const validUserIds = await getValidUserIds()
  const jobUsers = await JobUser.findAll({
    where: {
      UserId: {
        [Op.in]: validUserIds
      }
    },
    raw: true
  })
  const validJobUsers = []
  for (const jobUser of jobUsers) {
    let jobName = constants.trainingJob.name
    if (jobUser.jobId === constants.qualificationJob.id) {
      jobName = constants.qualificationJob.name
    } else if (jobUser.jobId === constants.ratingJob.id) {
      jobName = constants.ratingJob.name
    }
    jobUser.sessionId = jobUser.id
    jobUser.job = jobName
    validJobUsers.push(jobUser)
  }

  return parseJsonToCSV(
    [
      'sessionId',
      'job',
      'startTime',
      'finishTime',
      'UserId'
    ],
    validJobUsers
  )
}

async function getValidUserIds () {
  const validJobUsers = await getValidRatingJobUsers()
  let validUserIds = validJobUsers.map(jobUser => {
    return jobUser.UserId
  })
  validUserIds = uniq(validUserIds)
  return validUserIds
}

async function getValidDemographicsCSV () {
  const validUserIds = await getValidUserIds()
  let demographics = await DemographicInfo.findAll({
    where: {
      UserId: {
        [Op.in]: validUserIds
      }
    },
    raw: true
  })
  demographics = demographics.map(demographic => {
    for (const variable in constants.demographicQuestions) {
      const storedValue = demographic[variable]
      if (variable === 'deviceType') {
        demographic.deviceType = JSON.parse(demographic.deviceType)
        demographic.deviceType = demographic.deviceType.map(device => {
          return constants.demographicQuestions.deviceType[device]
        })
      } else {
        demographic[variable] = constants.demographicQuestions[variable][storedValue]
      }
    }
    demographic.countryOfOrigin = countries.getName(demographic.countryOfOrigin)
    demographic.countryOfResidence = countries.getName(demographic.countryOfResidence)
    return demographic
  })
  console.log(constants.countries)
  return parseJsonToCSV(
    [
      'UserId',
      'gender',
      'birthYear',
      'deviceType',
      'lastTimeSubjectiveTest',
      'lastTimeAudioTest',
      'involvedInSpeechCoding',
      'selfListeningPerception',
      'countryOfOrigin',
      'countryOfResidence',
      'motherTongue',
      'secondLanguage'
    ],
    demographics
  )
}

async function getValidPaymentCodesCSV (asUser) {
  let validJobUsers = await getValidRatingJobUsers()
  validJobUsers = validJobUsers.map(jobUser => {
    return {
      payment_code: asUser ? `##${jobUser.id}##` : jobUser.id
    }
  })
  return parseJsonToCSV(
    [
      'payment_code'
    ],
    validJobUsers
  )
}

async function getValidRatingJobUsers () {
  const jobUsers = await JobUser.findAll({
    where: {
      jobId: constants.ratingJob.id
    }
  })
  const validJobUsers = []
  for (const jobUser of jobUsers) {
    if (jobUser.validity && jobUser.validity.valid) {
      validJobUsers.push(jobUser)
    }
  }
  return validJobUsers
}

async function getLongResultsCSV () {
  const audioRatingUsers = await AudioRatingUser.findAll({
    where: {
      '$JobUser.jobId$': constants.ratingJob.id
    },
    include: [
      {
        model: JobUser,
        include: [{
          model: User
        }]
      },
      {
        model: Audio
      }
    ]
  })
  // logInFile(audioRatings)
  const extractedData = []
  for (const audioRatingUser of audioRatingUsers) {
    if (audioRatingUser.JobUser.validity &&
      audioRatingUser.JobUser.validity.valid) {
      const audioRating = await AudioRating.findOne({
        where: {
          AudioId: audioRatingUser.AudioId
        }
      })
      extractedData.push({
        worker_id: audioRatingUser.JobUser.User.workerId,
        session_id: audioRatingUser.JobUserId,
        file_name: audioRatingUser.Audio.src,
        condition: audioRating.condition,
        vote: audioRatingUser.rating
      })
    }
  }
  return parseJsonToCSV(
    [
      'worker_id',
      'session_id',
      'file_name',
      'condition',
      'vote'
    ],
    extractedData
  )
}

function parseJsonToCSV (fields, data) {
  const json2csv = new CsvParser({
    fields,
    delimiter: ';'
  })
  return json2csv.parse(data)
}

async function determineParametersForEmptyWorker () {
  const userCount = await User.count()
  const workerId = 'mTurk' + userCount
  const campaignId = constants.emptyCampaignId
  return { workerId, campaignId }
}

async function determineStartUrl (worker) {
  await updateCompletionRatesExternalUrls()
  const noMoreInternalJobs = await internalFinished()
  const noMoreExternalJobs = await externalFinished()
  if (noMoreInternalJobs && noMoreExternalJobs) {
    return { noMoreJobs: true }
  }
  const [user, created] = await User.findOrCreate({
    where: worker,
    defaults: worker
  })
  let startUrl
  if (!created) {
    startUrl = await determineStartUrlForExistingUser(
      user, noMoreExternalJobs, noMoreInternalJobs
    )
  } else {
    startUrl = await determineStartUrlForNewUser(
      user, noMoreExternalJobs, noMoreInternalJobs
    )
  }
  if (startUrl.external) {
    await ExternalUrlUser.create({
      UserId: user.id,
      ExternalUrlId: startUrl.id,
      assignedTime: new Date()
    })
  }
  return startUrl
}

async function internalFinished () {
  const internalValidRatio = await completionRatio(AudioRating)
  return internalValidRatio >= 1
}

async function externalFinished () {
  const externalValidRatio = await completionRatio(ExternalUrl)
  return externalValidRatio >= 1
}

async function determineStartUrlForExistingUser (user, externalFinished, internalFinished) {
  if (user.external) {
    if (externalFinished) {
      return { noMoreJobs: true }
    }
    const urlObject = await validExternalUrl(user)
    if (urlObject) {
      return { external: true, url: urlObject.url, id: urlObject.id, noMoreJobs: false }
    }
    return { noMoreJobs: true }
  } else {
    if (internalFinished) {
      return { noMoreJobs: true }
    }
    return { external: false, noMoreJobs: false }
  }
}

async function determineStartUrlForNewUser (user, externalFinished, internalFinished) {
  const isExternal = internalFinished || await shouldBeExternal(externalFinished)
  if (isExternal) {
    user.external = true
    await user.save()
    const urlObject = await validExternalUrl()
    return { external: true, url: urlObject.url, id: urlObject.id, noMoreJobs: false }
  } else {
    if (internalFinished) {
      return { noMoreJobs: true }
    }
    return { external: false, noMoreJobs: false }
  }
}

async function shouldBeExternal (externalFinished) {
  if (externalFinished) {
    return false
  }
  const externalValidRatio = await completionRatio(ExternalUrl)
  const internalValidRatio = await completionRatio(AudioRating)
  const ratioDif = externalValidRatio - internalValidRatio
  const probability = Math.abs(ratioDif) <= constants.externalUrls.allowRatioDif
    ? constants.externalUrls.baseProbability
    : constants.externalUrls.maxProbability
  const externalShouldBeSelected = ratioDif < 0
  // Randomize selection, but with a weight on the one that should be selected
  if (random(1) <= probability) {
    return externalShouldBeSelected
  }
  return !externalShouldBeSelected
}

async function updateCompletionRatesExternalUrls () {
  await checkExternalExpirations()
  const externalUrls = await ExternalUrl.findAll()
  for (const externalUrl of externalUrls) {
    const totalInvalid = await ExternalUrlUser.count({
      where: {
        ExternalUrlId: externalUrl.id,
        valid: false
      }
    })
    externalUrl.invalid = totalInvalid
    const totalValid = await ExternalUrlUser.count({
      where: {
        ExternalUrlId: externalUrl.id,
        valid: true
      }
    })
    externalUrl.valid = totalValid
    externalUrl.completionRatio = Math.min(
      1,
      totalValid / constants.externalUrls.requiredValidRatings
    )
    await externalUrl.save()
  }
}

function checkExternalExpirations () {
  return ExternalUrlUser.update(
    {
      expired: true
    },
    {
      where: {
        validationTime: null,
        assignedTime: {
          [Op.lt]: new Date(
            Date.now() - minutesToMs(constants.externalUrls.expirationMinutes)
          )
        }
      }
    }
  )
}

async function completionRatio (model) {
  const sumValidRatios = await model.sum('completionRatio')
  const totalExternalUrl = await model.count()
  return sumValidRatios / totalExternalUrl
}

async function validExternalUrl (user) {
  if (user) {
    const userExternalUrls = await externalUrlsOfUser(user)
    const userExternalUrlIds = userExternalUrls.map(
      userExternalUrl => userExternalUrl.ExternalUrlId
    )
    return findRandomValidExternalUrl(userExternalUrlIds)
  }
  return findRandomValidExternalUrl([])
}

async function findRandomValidExternalUrl (userExternalUrlIds) {
  try {
    const reservedExternalUrls = await getNotExpiredExternalUrls()
    const reservedExternalUrlsIds = reservedExternalUrls.map(
      externalUserUrl => externalUserUrl.ExternalUrlId
    )
    const urlsToExclude = userExternalUrlIds.concat(
      uniq(reservedExternalUrlsIds)
    )
    const externalUrls = await ExternalUrl.findAll({
      order: [
        [sequelize.literal('completionRatio'), 'ASC']
      ],
      where: {
        id: {
          [Op.notIn]: urlsToExclude
        },
        completionRatio: {
          [Op.lt]: 1
        }
      }
    })
    if (externalUrls.length > 0) {
      return externalUrls[random(externalUrls.length - 1)]
    } else {
      return undefined
    }
  } catch (error) {
    logError(error)
    throw Error('findRandomValidExternalUrl')
  }
}

async function getNotExpiredExternalUrls () {
  return ExternalUrlUser.findAll({
    where: {
      expired: {
        [Op.not]: true
      },
      validationTime: {
        [Op.is]: null
      }
    }
  })
}

async function externalUrlsOfUser (user) {
  try {
    const externalUrls = await ExternalUrlUser.findAll({
      where: {
        UserId: user.id
      }
    })
    return externalUrls
  } catch (error) {
    logError(error)
    throw Error('isExternalUser')
  }
}

function getLastJobUsers ({ page, itemsPerPage, orderBy, desc, substring }) {
  const query = {
    order: [
      [orderBy || 'startTime', desc ? 'DESC' : 'ASC']
    ],
    include: {
      model: User
    },
    ...paginate({ page, itemsPerPage })
  }
  if (substring !== undefined && substring !== '') {
    query.where = {
      [Op.or]: [
        {
          id: {
            [Op.substring]: substring
          }
        },
        {
          UserId: {
            [Op.substring]: substring
          }
        }
      ]
    }
  }
  return JobUser.findAndCountAll(query)
}

function paginate ({ page, itemsPerPage }) {
  const offset = page * itemsPerPage
  const limit = itemsPerPage

  return {
    limit,
    offset
  }
}

function expirationChecker (req, res, next) {
  if (req.path === '/users') {
    req.session.regenerate(next)
  } else if (hasSessionExpired(req.session) &&
    !constants.noSessionPaths.includes(req.path)) {
    log.info('Session expiration checked')
    res.statusCode = 401
    res.statusMessage = 'Your session has expired.'
    res.send({
      shouldRestart: true
    })
  } else {
    next()
  }
}

function hasSessionExpired (session) {
  return session.jobUserId === undefined
}

function handleError ({ res, req, error, message, destroySession }) {
  res.statusCode = 500
  res.statusMessage = message || ''
  res.send({ success: false })
  if (destroySession) {
    req.session.destroy()
  }
  logError(error)
}

async function createOrUpdate (model, values, condition) {
  const obj = await model.findOne({ where: condition })
  // update
  if (obj) {
    return obj.update(values)
  }
  // insert
  return model.create(values)
}

async function initUniqueSession (worker, req, res) {
  try {
    const [user] = await User.findOrCreate({ // eslint-disable-line
      where: worker,
      defaults: worker
    })
    const [jobUser, created] = await findOrCreateLastJobUser(user)
    const urlJobId = req.body.urlJobId ? parseInt(req.body.urlJobId) : undefined
    if (created) { // The user did not have previous sessions
      await createNewJobUserForNewUser({ jobUser, urlJobId, req, res })
    } else if (shouldAllowDirectAccessToJob(req)) {
      await allowDirectAccessToJob({ user, urlJobId, req, res })
    } else if (isUserBlocked(user)) {
      denyAccess(res)
    } else if (isUserWaiting(user)) {
      notifyToWait(res)
    } else if (isUserUnderTemporalBlocked(user)) {
      notifyTemporalBlocked(res, user)
    } else if (isJobUSerFinished(jobUser)) { // Last session is finished
      await accessNextJobUser({ jobUser, user, res, req })
    } else { // Last session was started but not finished
      await continueStartedJobUser({ jobUser, req, res })
    }
  } catch (error) {
    handleError({
      res,
      error,
      message: 'Error starting session'
    })
  }
}

function shouldAllowDirectAccessToJob (req) {
  return !!req.body.urlJobId
}

async function createNewJobUserForNewUser ({ jobUser, urlJobId, req, res }) {
  jobUser.jobId = urlJobId || determineNextJobId({ req })
  jobUser.clientUUID = req.body.clientUUID
  await jobUser.save()
  return finishInitSession(req, res, jobUser)
}

function isUserBlocked (user) {
  return user.accessStatus === constants.accessStatus.blocked
}

function isJobUSerFinished (jobUser) {
  return !!jobUser.finishTime
}

function isUserWaiting (user) {
  return user.accessStatus === constants.accessStatus.waiting
}

function determineNextJobId ({ jobUser }) {
  if (jobUser) {
    return isQualificationJob(jobUser) ? constants.trainingJob.id : constants.ratingJob.id
  } else {
    return constants.qualificationJob.id
  }
}

async function allowDirectAccessToJob ({ user, urlJobId, req, res }) {
  const newJobUser = await createNewJobsUser(user, urlJobId, req.body.clientUUID)
  return finishInitSession(req, res, newJobUser)
}

async function accessNextJobUser ({ jobUser, user, res, req }) {
  const newJobId = determineNextJobId({ jobUser, req })
  let newJobUser
  if (jobUser.jobId === newJobId) { // Is repeating same job consecutively, now only valid for RatingJob
    newJobUser = await createNewJobUserOfRating(jobUser, req.body.clientUUID)
  } else {
    newJobUser = await createNewJobsUser(user, newJobId, req.body.clientUUID, jobUser)
  }
  await finishInitSession(req, res, newJobUser, jobUser.finishTime)
}

async function continueStartedJobUser ({ jobUser, req, res }) {
  if (shouldContinueSameJobUser(req)) {
    await handleContinueJobUser(jobUser, req.body.clientUUID)
    const lastFinishTime = jobUser.ListeningTestId ? jobUser.ListeningTest.finishTime : undefined
    await finishInitSession(req, res, jobUser, lastFinishTime)
  } else {
    res.send({
      success: true,
      startedSession: true
    })
  }
}

function createNewJobUserOfRating (lastJobUser, clientUUID) {
  const newJobUserInfo = {
    UserId: lastJobUser.UserId,
    jobId: lastJobUser.jobId,
    startTime: new Date(),
    expirationTime: lastJobUser.expirationTime,
    ListeningTestId: lastJobUser.ListeningTestId || lastJobUser.id,
    clientUUID: clientUUID
  }
  if (isJobUserExpired(lastJobUser)) {
    newJobUserInfo.jobId = constants.trainingJob.id
  }
  return JobUser.create(newJobUserInfo)
}

function isJobUserValid (jobUser) {
  return jobUser.validity.valid === 1
}

function isJobUserExpired (jobUser) {
  return jobUser.expirationTime ? jobUser.expirationTime < new Date() : false
}

function denyAccess (res) {
  res.send({
    success: true,
    accessDenied: true
  })
}

function notifyToWait (res) {
  res.send({
    success: true,
    shouldWait: true
  })
}

function notifyTemporalBlocked (res, user) {
  res.send({
    success: true,
    unblockTime: calculateUnblockTime(user.blockTime)
  })
}

function createNewJobsUser (user, jobId, clientUUID, lastJobUser) {
  return JobUser.create({
    UserId: user.id,
    jobId: jobId,
    expirationTime: calculateExpirationTime(jobId),
    startTime: new Date(),
    ListeningTestId: lastJobUser.ListeningTestId || lastJobUser.id,
    clientUUID: clientUUID
  })
}

function calculateExpirationTime (jobId) {
  const expirationMinutes = getJobInfo(jobId).expirationMinutes
  if (expirationMinutes) {
    const expirationTime = new Date(Date.now() + minutesToMs(expirationMinutes))
    return expirationTime
  }
  return null
}

function minutesToMs (minutes) {
  return (minutes / 60) * 3600 * 1000
}

function findOrCreateLastJobUser (user) {
  return JobUser.findOrCreate({
    where: {
      UserId: user.id
    },
    include: [{
      model: JobUser,
      as: 'ListeningTest'
    }],
    defaults: {
      UserId: user.id,
      startTime: new Date()
    },
    order: [
      ['startTime', 'DESC']
    ]
  })
}

async function finishInitSession (req, res, jobUser, lastFinishTime) {
  const response = {
    success: true,
    userId: jobUser.UserId,
    jobId: jobUser.jobId,
    jobUserId: jobUser.id,
    shouldPerformListeningTests: true
  }
  if (!shouldAllowDirectAccessToJob(req)) {
    if (lastFinishTime) {
      const nextListeningTest = calculateNextListeningTestTime(lastFinishTime, jobUser.jobId)
      response.shouldPerformListeningTests = new Date() > nextListeningTest
    }
    response.repeatingJob = await isRepeatingJob(jobUser)
  }
  initSession(req, jobUser, response.shouldPerformListeningTests)
  res.send(response)
}

function shouldContinueSameJobUser (req) {
  return req.body.forceInit
}

function handleContinueJobUser (jobUser, clientUUID) {
  jobUser.startTime = new Date()
  jobUser.clientUUID = clientUUID
  return jobUser.save()
}

function isUserUnderTemporalBlocked (user) {
  if (user.accessStatus === constants.accessStatus.temporalBlocked) {
    const unblockTime = calculateUnblockTime(user.blockTime)
    return unblockTime > new Date()
  }
  return false
}

function isRatingJob (jobUser) {
  return jobUser.jobId === constants.ratingJob.id
}

function isQualificationJob (jobUser) {
  return jobUser.jobId === constants.qualificationJob.id
}

function initSession (req, jobUser, shouldPerformListeningTests) {
  req.session.userId = jobUser.UserId
  req.session.jobId = jobUser.jobId
  req.session.jobUserId = jobUser.id
  req.session.shouldPerformListeningTests = shouldPerformListeningTests
}

function calculateNextListeningTestTime (lastFinishTime, jobId) {
  const inactivityMs = (getJobInfo(jobId).inactivityMinutes / 60) * 3600 * 1000
  const nextListeningTime = new Date(lastFinishTime)
  nextListeningTime.setMilliseconds(nextListeningTime.getMilliseconds() + inactivityMs)
  return nextListeningTime
}

function calculateUnblockTime (blockTime) {
  const blockDurationInMs = (constants.blockDurationInMinutes / 60) * 3600 * 1000
  const unblockTime = new Date(blockTime)
  unblockTime.setMilliseconds(unblockTime.getMilliseconds() + blockDurationInMs)
  return unblockTime
}

async function addAudioQuestionUser (req, res, answer) {
  const audioQuestion = await AudioQuestion.findOne({
    where: { AudioId: answer.audioId }
  })
  return createOrUpdate(
    AudioQuestionUser,
    {
      JobUserId: req.session.jobUserId,
      AudioQuestionId: audioQuestion.id,
      answer: answer.userAnswer,
      numberOfReproductions: answer.numberOfReproductions,
      startTime: answer.startTime,
      finishTime: answer.finishTime
    },
    {
      JobUserId: req.session.jobUserId,
      AudioQuestionId: audioQuestion.id
    })
}

function findRandomAudiosByTask (audioTask) {
  return Audio.findAll({
    where: {
      task: audioTask.taskId
    },
    order: sequelize.random(),
    limit: audioTask.amount
  })
}

function isRatingTask (id) {
  return id === constants.audioTasks.rating.id ||
  id === constants.audioTasks.degradationCategoryRating.id ||
  id === constants.audioTasks.comparisonCategoryRating.id
}

function isComparisonGoldStandardTask (id) {
  return id === constants.audioTasks.goldStandardDCR.id ||
  id === constants.audioTasks.goldStandardCCR.id
}

async function selectJobAudios (jobId, userId) {
  const audioTasks = cloneDeep(getJobInfo(jobId).audioTasks)
  const jobAudios = {}
  let taskAudios
  for (const audioTask of audioTasks) {
    if (isComparisonTestTask(audioTask.taskId)) {
      taskAudios = await selectComparisonTestAudios(audioTask.amount)
      taskAudios = taskAudios.map((taskAudio) => {
        return taskAudio.Audio
      })
    } else if (isRatingTask(audioTask.taskId)) {
      taskAudios = await selectRatingAudios(audioTask, userId)
      if (taskAudios.length === 0) {
        return []
      }
    } else if (isComparisonGoldStandardTask(audioTask.taskId)) {
      taskAudios = await selectComparisonGoldStandardAudios(audioTask)
    } else {
      taskAudios = await findRandomAudiosByTask(audioTask)
    }
    jobAudios[audioTask.taskId] = taskAudios
  }
  return jobAudios
}

function isComparisonTestTask (taskId) {
  return taskId === constants.audioTasks.comparisonTest.id
}

async function selectComparisonTestAudios (amount) {
  const goodQuality = await ComparisonAudio.findAll({
    include: {
      model: Audio
    },
    where: {
      type: 1
    },
    order: [
      ['AudioId', 'ASC']
    ],
    limit: amount
  })
  const badQuality = await ComparisonAudio.findAll({
    include: {
      model: Audio
    },
    where: {
      type: 2
    },
    order: [
      ['AudioId', 'ASC']
    ],
    limit: amount
  })
  return goodQuality.concat(badQuality)
}

async function selectRatingAudios (audioTask, userId) {
  try {
    let workerAudios = await getRatingsOfUser(userId)
    workerAudios = workerAudios.map((userRating) => {
      return userRating.AudioId
    })
    const amount = audioTask.amount
    const baseSetSize = parseInt(audioTask.baseSetSize) || amount * 2
    const ratingAudios = await AudioRating.findAll({
      include: {
        model: Audio
      },
      where: {
        type: audioTask.taskId,
        AudioId: {
          [Op.notIn]: workerAudios
        },
        completionRatio: {
          [Op.lt]: 1
        }
      },
      order: [
        [sequelize.literal('completionRatio'), 'ASC']
      ],
      limit: baseSetSize
    })
    const randomizedRatingAudios = shuffle(ratingAudios)
    const requiredRatingAudios = randomizedRatingAudios.slice(0, amount)
    if (isComparisonRatingTask(audioTask.taskId)) {
      const ratingComparisonPairs = await getRatingComparisonPairs(requiredRatingAudios)
      return ratingComparisonPairs
    }
    return requiredRatingAudios.map((audioRating) => audioRating.Audio)
  } catch (error) {
    logError(error)
    throw Error('selectRatingAudios')
  }
}

async function getRatingsOfUser (userId) {
  return AudioRatingUser.findAll({
    where: {
      '$JobUser.userId$': userId
    },
    include: [
      { model: JobUser }
    ]
  })
}

async function selectComparisonGoldStandardAudios (audioTask) {
  const comparisonPairs = await ComparisonGoldStandardPair.findAll({
    where: {
      type: audioTask.taskId
    },
    include: [
      {
        model: Audio,
        as: 'AudioA'
      },
      {
        model: Audio,
        as: 'AudioB'
      }
    ],
    order: sequelize.random(),
    limit: audioTask.amount
  })
  return comparisonPairs.map(comparisonPair => {
    comparisonPair.AudioA.dataValues.processed = true
    comparisonPair.AudioA.dataValues.comparisonGoldStandardPairId = comparisonPair.id
    return [comparisonPair.AudioA, comparisonPair.AudioB]
  })
}

function isComparisonRatingTask (id) {
  return id === constants.audioTasks.degradationCategoryRating.id ||
  id === constants.audioTasks.comparisonCategoryRating.id
}

async function getRatingComparisonPairs (ratingAudios) {
  const audioPairs = []
  for (const ratingAudio of ratingAudios) {
    const audioPair = await ComparisonRatingPair.findOne({
      include: [
        {
          model: Audio,
          as: 'Reference'
        },
        {
          model: Audio,
          as: 'Processed'
        }
      ],
      where: {
        ProcessedId: ratingAudio.AudioId
      }
    })
    audioPair.Processed.dataValues.processed = true
    audioPair.Processed.dataValues.comparisonRatingPairId = audioPair.id
    audioPairs.push([audioPair.Reference, audioPair.Processed])
  }
  return audioPairs
}

function determineValidityOfTest (testId, questions, validityThresholds) {
  if (questions.length > 0) {
    const validQuestions = questions.filter((question) => question.valid === true)
    return {
      id: testId,
      validity: validQuestions.length / questions.length,
      validityThreshold: validityThresholds[testId]
    }
  }
  return undefined
}

async function finishJobUserSession (req, res) {
  try {
    const jobUser = await JobUser.findByPk(req.session.jobUserId)
    jobUser.finishTime = new Date()
    jobUser.actionsTracking = req.body.userActions
    if (req.session.shouldPerformListeningTests) {
      jobUser.ListeningTestId = null
      await processValidity(jobUser)
    } else {
      const listeningTest = await sequelize.models.JobUser.findByPk(jobUser.ListeningTestId)
      if (isRatingJob(jobUser)) {
        let previousListeningTests = excludeValidationTestById(
          constants.audioTasks.goldStandardQuestion.id,
          listeningTest.validity.tests
        )
        previousListeningTests = excludeValidationTestById(
          constants.audioTasks.trappingQuestion.id,
          previousListeningTests
        )
        await processValidity(jobUser)
        jobUser.validity.tests = jobUser.validity.tests.concat(previousListeningTests)
        jobUser.validity.valid = determineValidityOfJobUser(jobUser.validity.tests)
      } else {
        jobUser.validity = listeningTest.validity
      }
    }
    await processUserAccessStatus(jobUser)
    return jobUser.save()
  } catch (error) {
    logError(error)
    throw Error('finishJobUserSession')
  }
}

async function processUserAccessStatus (jobUser) {
  if (accessShouldBeRevoked(jobUser)) {
    return revokeAccessToUser(jobUser.UserId)
  } else if (isJobUserValid(jobUser) && !isRatingJob(jobUser)) {
    const isRepeatingJobResult = await isRepeatingJob(jobUser)
    if (!isRepeatingJobResult && constants.shouldBeManuallyReviewed) {
      return setUserToWaitingStatus(jobUser.UserId)
    }
  } else if (userShouldBeTemporallyBlocked(jobUser)) {
    return blockUserTemporally(jobUser.UserId)
  } else {
    return grantAccessToUser(jobUser.UserId)
  }
}

function userShouldBeTemporallyBlocked (jobUser) {
  return isRatingJob(jobUser) && !isJobUserValid(jobUser)
}

async function isRepeatingJob (jobUser) {
  const numberOfTrainings = await JobUser.count({
    where: {
      UserId: jobUser.UserId,
      jobId: jobUser.jobId
    }
  })
  return numberOfTrainings > 1
}

function accessShouldBeRevoked (jobUser) {
  return !isJobUserValid(jobUser) && !isRatingJob(jobUser)
}

async function revokeAccessToUser (userId) {
  return changeUserAccessStatus(userId, constants.accessStatus.blocked)
}

async function grantAccessToUser (userId) {
  const user = await changeUserAccessStatus(userId, constants.accessStatus.granted)
  user.blockTime = null
  return user.save()
}

async function setUserToWaitingStatus (userId) {
  return changeUserAccessStatus(userId, constants.accessStatus.waiting)
}

async function blockUserTemporally (userId) {
  const user = await changeUserAccessStatus(userId, constants.accessStatus.temporalBlocked)
  user.blockTime = new Date()
  return user.save()
}

async function changeUserAccessStatus (userId, status) {
  const user = await sequelize.models.User.findByPk(userId)
  user.accessStatus = status
  return user.save()
}

async function processValidity (jobUser) {
  try {
    const testIds = [
      constants.audioTasks.digitQuestion.id,
      constants.audioTasks.mathQuestion.id,
      constants.audioTasks.comparisonTest.id,
      constants.audioTasks.goldStandardQuestion.id,
      constants.audioTasks.trappingQuestion.id,
      constants.audioTasks.goldStandardDCR.id,
      constants.audioTasks.goldStandardCCR.id
    ]
    const validities = []
    for (const testId of testIds) {
      let testUserAnswers
      if (isAudioComparisonTest(testId)) {
        testUserAnswers = await getAudioComparisonsOfJobUser(jobUser.id)
      } else if (isComparisonGoldStandardTask(testId)) {
        testUserAnswers = await getComparisonGoldStandardUserOfJobUser(jobUser.id, testId)
      } else {
        const userAnswers = await getAudioQuestionsOfJobUser(jobUser.id)
        testUserAnswers = userAnswers.filter(audioQuestion => audioQuestion.AudioQuestion.Audio.task === testId)
      }
      if (testUserAnswers.length > 0) {
        const testValidity = determineValidityOfTest(testId, testUserAnswers, constants.validityThresholds)
        validities.push(testValidity)
      }
    }
    jobUser.validity = {
      valid: determineValidityOfJobUser(validities),
      tests: validities
    }
  } catch (error) {
    logError(error)
    throw Error('processValidity')
  }
}

function isAudioComparisonTest (testId) {
  return testId === constants.audioTasks.comparisonTest.id
}

function getAudioQuestionsOfJobUser (jobUserId) {
  return AudioQuestionUser.findAll({
    where: {
      JobUserId: jobUserId
    },
    include: [{
      model: AudioQuestion,
      include: [{
        model: Audio
      }]
    }]
  })
}

function getAudioComparisonsOfJobUser (jobUserId) {
  return AudioComparisonUser.findAll({
    where: {
      JobUserId: jobUserId
    }
  })
}

function getComparisonGoldStandardUserOfJobUser (jobUserId, testId) {
  return ComparisonGoldStandardUser.findAll({
    where: {
      JobUserId: jobUserId
    },
    include: {
      model: ComparisonGoldStandardPair,
      where: {
        type: testId
      }
    }
  })
}

function determineValidityOfJobUser (validityInfos) {
  return validityInfos.some((validityInfo) => validityInfo.validity < validityInfo.validityThreshold) ? 0 : 1
}

function excludeValidationTestById (testId, listeningTests) {
  return listeningTests.filter((test) => test.id !== testId)
}

async function updateNumberOfValidRatings (jobUser) {
  try {
    if (isRatingJob(jobUser)) {
      const jobUserRatings = await getAllUserRatings(jobUser.id)
      const promises = jobUserRatings.map(async userRating => {
        const [audioRating] = await AudioRating.findOrCreate({
          where: {
            AudioId: userRating.AudioId
          }
        })
        if (isJobUserValid(jobUser)) {
          audioRating.valid++
        } else {
          audioRating.invalid++
        }
        audioRating.completionRatio = Math.min(
          1,
          audioRating.valid / constants.ratingJob.requiredValidRatings
        )
        return audioRating.save()
      })
      return Promise.all(promises)
    }
  } catch (error) {
    logError(error)
    throw Error('updateNumberOfValidRatings')
  }
}

async function getAllUserRatings (jobUserId) {
  const jobUserRatings = await AudioRatingUser.findAll({
    attributes: ['AudioId'],
    where: {
      JobUserId: jobUserId
    }
  })
  let jobUserCCRRatings = await ComparisonCategoryRatingUser.findAll({
    attributes: ['ComparisonRatingPairId'],
    include: [{
      model: ComparisonRatingPair,
      as: 'ComparisonRatingPair'
    }],
    where: {
      JobUserId: jobUserId
    }
  })
  jobUserCCRRatings = jobUserCCRRatings.map(comparisonRatingPairToRating)

  let jobUserDCRRatings = await DegradationCategoryRatingUser.findAll({
    attributes: ['ComparisonRatingPairId'],
    include: [{
      model: ComparisonRatingPair,
      as: 'ComparisonRatingPair'
    }],
    where: {
      JobUserId: jobUserId
    }
  })
  jobUserDCRRatings = jobUserDCRRatings.map(comparisonRatingPairToRating)

  const comparisonRatings = jobUserCCRRatings.concat(jobUserDCRRatings)

  return jobUserRatings.concat(comparisonRatings)
}

function comparisonRatingPairToRating (comparisonRating) {
  return {
    AudioId: comparisonRating.ComparisonRatingPair.ProcessedId
  }
}

function logError (error) {
  console.log(chalk.red(error))
}

function logInFile (variable) { // eslint-disable-line
  log.info(JSON.stringify(variable, null, ' '))
}

function getJobInfo (jobId) {
  switch (jobId) {
    case constants.qualificationJob.id:
      return constants.qualificationJob
    case constants.trainingJob.id:
      return constants.trainingJob
    case constants.ratingJob.id:
      return constants.ratingJob
  }
}

module.exports = router
