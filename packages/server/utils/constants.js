const countries = require('country-list')
const languages = require('language-list')()
const orderBy = require('lodash/orderBy')

const sessionExpirationInMs = 1 * 30 * 60 * 1000 // The maximum age (in milliseconds) of a valid session. 30 Minutes

const jobIds = {
  qualification: 1,
  training: 2,
  rating: 3
}

const audioTasks = { // 1: Callibration, 2: Training, 3: Rating, 4: DigitQuestion, 5: MathQuestion, 6: Comparison Test, 7: Comparison rating
  callibration: {
    id: 1,
    name: 'Calibration'
  },
  training: {
    id: 2,
    name: 'Training'
  },
  rating: {
    id: 3,
    name: 'Absolute Category Rating',
    possibleAnswers: [
      { qualityOfSpeech: 'Excellent', score: 5 },
      { qualityOfSpeech: 'Good', score: 4 },
      { qualityOfSpeech: 'Fair', score: 3 },
      { qualityOfSpeech: 'Poor', score: 2 },
      { qualityOfSpeech: 'Bad', score: 1 }
    ]
  },
  digitQuestion: {
    id: 4,
    name: 'Digits question',
    noDigitChar: '/',
    digitSeparator: ' ',
    validityThreshold: 0.7
  },
  mathQuestion: {
    id: 5,
    name: 'Math question',
    validityThreshold: 1
  },
  comparisonTest: {
    id: 6,
    name: 'Audio comparison',
    validityThreshold: 0.7,
    possibleAnswers: [
      { text: 'Quality of <b>Sample A</b> is better.' },
      { text: 'Difference is <b>not detectable</b>.' },
      { text: 'Quality of <b>Sample B</b> is better.' }
    ]
  },
  goldStandardQuestion: {
    id: 7,
    name: 'Gold standard',
    validityThreshold: 1
  },
  degradationCategoryRating: {
    id: 8,
    name: 'Degradation Category Rating',
    possibleAnswers: [
      { text: '5 Degradation is inaudible.', value: 5 },
      { text: '4 Degradation is audible but not annoying.', value: 4 },
      { text: '3 Degradation is slightly annoying.', value: 3 },
      { text: '2 Degradation is annoying.', value: 2 },
      { text: '1 Degradation is very annoying.', value: 1 }
    ],
    instruction: 'How do you rate the degradation of the Sample B with respect to the Sample A?'
  },
  comparisonCategoryRating: {
    id: 9,
    name: 'Comparison Category Rating',
    possibleAnswers: [
      { text: '3 Much better', value: 3 },
      { text: '2 Better', value: 2 },
      { text: '1 Slightly better', value: 1 },
      { text: '0 About the same', value: 0 },
      { text: '-1 Slightly worse', value: -1 },
      { text: '-2 Worse', value: -2 },
      { text: '-3 Much worse', value: -3 }
    ],
    instruction: 'The Quality of the Sample B to the Quality of the Sample A is:'
  },
  goldStandardDCR: {
    id: 10,
    name: 'Gold Standard - Degradation Category Rating',
    validityThreshold: 1
  },
  goldStandardCCR: {
    id: 11,
    name: 'Gold Standard - Comparison Category Rating',
    validityThreshold: 1
  },
  trappingQuestion: {
    id: 12,
    name: 'Trapping question',
    validityThreshold: 1
  }
}

function getQualificationJobInfo () {
  const info = {
    id: jobIds.qualification,
    name: 'Qualification',
    numberOfStimuli: '10', // C6.2.2: 5 to 15 stimuli
    taskDuration: '10', // C6.2.2: a couple of minutes
    numberOfTasksPerCrowdworker: '##',
    compensationWithBonuses: '##',
    selectionDays: '##',
    audioTasks: [
      { taskId: audioTasks.callibration.id, amount: 1 },
      { taskId: audioTasks.digitQuestion.id, amount: 4 },
      { taskId: audioTasks.comparisonTest.id, amount: 4 }
    ],
    inactivityMinutes: 60
  }
  info.finishMessage = {
    title: 'Thank you for your participation',
    message: `The qualifications will be assigned to a selected group of participants in up to next ${info.selectionDays} days.`
  }
  return info
}

function getTrainingJobInfo () {
  const info = {
    id: jobIds.training,
    name: 'Training',
    duration: '8', // C6.2.2: 5 to 15 stimuli
    numberOfStimuli: '10', // C6.2.2: a couple of minutes
    qualificationName: '##certificate/qualification [platform specific term]##',
    qualificationExpiration: '1 hour',
    device: 'headphones',
    qualificationTime: 'at the latest within 24 hours',
    allowedFurtherJobs: 'more',
    audioTasks: [
      { taskId: audioTasks.callibration.id, amount: 1 },
      // { taskId: audioTasks.mathQuestion.id, amount: 1 },
      { taskId: audioTasks.digitQuestion.id, amount: 4 },
      { taskId: audioTasks.training.id, amount: 9 },
      { taskId: audioTasks.goldStandardQuestion.id, amount: 1 }
    ],
    inactivityMinutes: 60
  }
  info.finishMessage = {
    title: 'Thank you for your participation',
    message: `Your qualification will be reviewed ${info.qualificationTime}. Then you are allowed to perform ${info.allowedFurtherJobs} jobs.`
  }
  return info
}

function getRatingJobInfo () {
  const info = {
    id: jobIds.rating,
    name: 'Rating',
    duration: '8', // C6.2.2: 5 to 15 stimuli
    numberOfStimuli: '10', // C6.2.2: a couple of minutes
    minTasksBonus: '30',
    expirationTime: '##',
    numberValidationQuestions: 6,
    hitName: 'task',
    numberOfHits: '64',
    baseReward: 0.50,
    currencySymbol: '$',
    bonusRewardAll: 0.10,
    bonusRewardBest: 0.25,
    finishMessage: {
      title: 'Thanks for your participation',
      message: 'Feel free to take more tasks from this job.'
    },
    audioTasks: [
      { taskId: audioTasks.callibration.id, amount: 1 },
      { taskId: audioTasks.digitQuestion.id, amount: 4 }, // Number of digits to be heard
      // { taskId: audioTasks.mathQuestion.id, amount: 1 },
      // { taskId: audioTasks.comparisonTest.id, amount: 4 },
      { taskId: audioTasks.rating.id, amount: 9 }, // "baseSetSize" can be used to setup number of audios to be selected as based to randomly select the final "amount"
      { taskId: audioTasks.goldStandardQuestion.id, amount: 1 },
      { taskId: audioTasks.trappingQuestion.id, amount: 1 }
      // { taskId: audioTasks.degradationCategoryRating.id, amount: 1 },
      // { taskId: audioTasks.goldStandardDCR.id, amount: 1 }
      // { taskId: audioTasks.comparisonCategoryRating.id, amount: 1 },
      // { taskId: audioTasks.goldStandardCCR.id, amount: 1 }
    ],
    inactivityMinutes: 30,
    expirationMinutes: 60,
    requiredValidRatings: 9
  }
  info.expirationTimeVerbose = `${info.expirationMinutes} minutes`
  return info
}

const blockDurationInMinutes = 60

const audioQuestionTypes = {
  digitTest: 1,
  mathQuestion: 2,
  goldStandardQuestion: 3
}

const accessStatus = {
  blocked: 0,
  granted: 1,
  waiting: 2,
  temporalBlocked: 3
}

const accessStatusInfo = {
  granted: {
    id: accessStatus.granted,
    verbose: 'Granted',
    description: 'The can access the system without any inconvenience'
  },
  waiting: {
    id: accessStatus.waiting,
    verbose: 'Waiting to continue',
    description: 'The worker completed a listening or a training job successfully and is waiting to be able to conduct rating jobs'
  },
  temporalBlocked: {
    id: accessStatus.temporalBlocked,
    verbose: 'Blocked temporally',
    description: 'The worker did not complete a rating job successfully. The system will automatically grant access after some time'
  },
  blocked: {
    id: accessStatus.blocked,
    verbose: 'Blocked permanently',
    description: 'The worker did not complete a listening or a training job successfully'
  }
}

const noSessionPaths = [
  '/last_job_users',
  '/admin_config',
  '/update_user',
  '/start_url',
  '/external_urls',
  '/external_workers',
  '/valid_external_workers',
  '/validate_external_worker',
  '/results_long',
  '/valid_payment_codes',
  '/valid_payment_codes_as_user',
  '/valid_demographics',
  '/valid_user_sessions',
  '/valid_external_workers_csv'
]

const externalUrls = {
  requiredValidRatings: 1,
  maxProbability: 0.7,
  baseProbability: 0.5,
  allowRatioDif: 0.1,
  expirationMinutes: 60
}

function getValidityThresholds () {
  const validityThresholds = {}
  for (const audioTask of Object.values(audioTasks)) {
    if (audioTask.validityThreshold) {
      validityThresholds[audioTask.id] = audioTask.validityThreshold
    }
  }
  return validityThresholds
}

const audiosBaseUrl = ''

const emptyCampaignId = 'emptyCampaignId'

const shouldBeManuallyReviewed = false

const lastTimePossibleAnswers = {
  1: 'Less than one week ago',
  2: 'One week ago',
  3: 'More than one week ago',
  4: 'Never'
}

const demographicQuestions = {
  deviceType: {
    1: 'Laptop/desktop loudspeaker',
    2: 'In-ear headphones',
    3: 'Over-the-ear headphones'
  },
  lastTimeSubjectiveTest: lastTimePossibleAnswers,
  lastTimeAudioTest: lastTimePossibleAnswers,
  involvedInSpeechCoding: ['Yes', 'No'],
  selfListeningPerception: {
    1: 'Normal hearing',
    2: 'Mild hearing loss',
    3: 'Moderate hearing loss',
    4: 'Severe hearing loss.'
  },
  gender: {
    1: 'Female',
    2: 'Male',
    3: 'Other'
  }
}

module.exports = {
  jobIds,
  audioTasks,
  qualificationJob: getQualificationJobInfo(),
  trainingJob: getTrainingJobInfo(),
  ratingJob: getRatingJobInfo(),
  blockDurationInMinutes,
  audioQuestionTypes,
  sessionExpirationInMs,
  accessStatus,
  noSessionPaths,
  accessStatusInfo,
  externalUrls,
  audiosBaseUrl,
  emptyCampaignId,
  shouldBeManuallyReviewed,
  demographicQuestions,
  countries: orderBy(countries.getData(), ['name']),
  languages: orderBy(languages.getData(), ['language']),
  validityThresholds: getValidityThresholds()
}
