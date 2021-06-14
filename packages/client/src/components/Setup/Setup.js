import ListeningCallibration from '@/components/ListeningCallibration/ListeningCallibration.vue'
import MathQuestion from '@/components/MathQuestion/MathQuestion.vue'
import DigitTestQuestion from '@/components/DigitTestQuestion/DigitTestQuestion.vue'
import ListeningComparisonTest from '@/components/ListeningComparisonTest/ListeningComparisonTest.vue'
import AudioPreloader from '@/components/AudioPreloader/AudioPreloader.vue'
import Service from '@/services/Service'
import { exceptions } from '@/data/constants'
import { cloneDeep, shuffle } from 'lodash'

export default {
  name: 'Setup',
  computed: {
    isTrainingJob: function () {
      return this.$store.getters.jobId === this.$store.getters.config.trainingJob.id
    },
    isRatingJob: function () {
      return this.$store.getters.jobId === this.$store.getters.config.ratingJob.id
    },
    isQualificationJob: function () {
      return this.$store.getters.jobId === this.$store.getters.config.qualificationJob.id
    },
    shouldPerformListeningTests: function () {
      return this.$store.getters.shouldPerformListeningTests
    },
    jobInfo: function () {
      if (this.isTrainingJob) {
        return cloneDeep(this.$store.getters.config.trainingJob)
      } else if (this.isRatingJob) {
        return cloneDeep(this.$store.getters.config.ratingJob)
      } else if (this.isQualificationJob) {
        return cloneDeep(this.$store.getters.config.qualificationJob)
      }
    },
    jobAudioTasks: function () {
      return this.jobInfo.audioTasks
    },
    audioTasksInfo: function () {
      return this.$store.getters.config.audioTasks
    },
    showCallibration: function () {
      return this.taskShouldBeIncluded(this.audioTasksInfo.callibration.id)
    },
    showMathQuestion: function () {
      return this.taskShouldBeIncluded(this.audioTasksInfo.mathQuestion.id)
    },
    showDigitQuestion: function () {
      return this.taskShouldBeIncluded(this.audioTasksInfo.digitQuestion.id)
    },
    showComparison: function () {
      return this.taskShouldBeIncluded(this.audioTasksInfo.comparisonTest.id)
    },
    finishMessage: function () {
      return this.isTrainingJob
        ? this.$store.getters.config.trainingJob.finishMessage
        : this.$store.getters.config.ratingJob.finishMessage
    },
    jobsAreSeparated: function () {
      return this.$store.getters.config.jobsAreSeparated
    }
  },
  data () {
    return {
      audioInfos: [],
      ready: false,
      setupFinished: false,
      audioList: []
    }
  },
  components: {
    ListeningCallibration,
    MathQuestion,
    AudioPreloader,
    DigitTestQuestion,
    ListeningComparisonTest
  },
  mounted () {
    this.loadTest()
  },
  methods: {
    async loadTest () {
      try {
        this.audioInfos = cloneDeep(this.$store.getters.audioInfos)
        if (this.audioInfos.length <= 0) {
          // Passed by value should be assured
          const result = await Service.fetchAudios()
          if (result.data.audios.length === 0) {
            this.$router.push({
              name: 'MessagePage',
              params: exceptions.Setup.NoMoreRatingAudios
            })
          } else {
            this.$store.commit('setAudioInfos', cloneDeep(result.data.audios))
            this.audioInfos = result.data.audios
            this.audioList = this.getAudioList()
          }
        }
      } catch (error) {
        this.handleError(exceptions.Setup.FetchAudiosException, error)
      }
    },
    getAudioList () {
      const audioList = []
      for (const taskId in this.audioInfos) {
        audioList.push(this.audioInfos[taskId])
      }
      return audioList.flat(2)
    },
    getMathAudioId () {
      return this.getTaskAudios(this.audioTasksInfo.mathQuestion.id)[0].id
    },
    getCallibrationAudioId () {
      return this.getTaskAudios(this.audioTasksInfo.callibration.id)[0].id
    },
    getDigitAudios () {
      return this.getTaskAudios(this.audioTasksInfo.digitQuestion.id)
    },
    getTrainingAudios () {
      let trainingAudios = this.getTaskAudios(this.audioTasksInfo.training.id)
      if (this.taskShouldBeIncluded(this.audioTasksInfo.goldStandardQuestion.id)) {
        trainingAudios = trainingAudios.concat(this.getTaskAudios(this.audioTasksInfo.goldStandardQuestion.id))
      }    
      return shuffle(trainingAudios)
    },
    getRatingAudios () {
      if (this.taskShouldBeIncluded(this.audioTasksInfo.rating.id)) {
        let ratingAudios = this.getTaskAudios(this.audioTasksInfo.rating.id)
        ratingAudios = ratingAudios.concat(this.getTaskAudios(this.audioTasksInfo.goldStandardQuestion.id))
        return shuffle(ratingAudios.concat(this.getTaskAudios(this.audioTasksInfo.trappingQuestion.id)))
      } else if (this.taskShouldBeIncluded(this.audioTasksInfo.degradationCategoryRating.id)) {
        const ratingAudios = this.getTaskAudios(this.audioTasksInfo.degradationCategoryRating.id)
        return shuffle(ratingAudios.concat(this.getTaskAudios(this.audioTasksInfo.goldStandardDCR.id)))
      } else if (this.taskShouldBeIncluded(this.audioTasksInfo.comparisonCategoryRating.id)) {
        const ratingAudios = this.getTaskAudios(this.audioTasksInfo.comparisonCategoryRating.id)
        return shuffle(ratingAudios.concat(this.getTaskAudios(this.audioTasksInfo.goldStandardCCR.id)))
      }
    },
    getComparisonAudios () {
      return this.getTaskAudios(this.audioTasksInfo.comparisonTest.id)
    },
    getTaskAudios (taskId) {
      return this.audioInfos[taskId]
    },
    taskShouldBeIncluded (taskId) {
      return taskId in this.audioInfos
    },
    startTest () {
      this.ready = true
      if (this.shouldPerformListeningTests) {
        this.setupFinished = false
        if (this.showCallibration) {
          this.$refs.callibrationTest.prepareTest(this.getCallibrationAudioId())
        }
        if (this.showMathQuestion) {
          this.$refs.mathQuestion.audioId = this.getMathAudioId()
        }
        if (this.showDigitQuestion) {
          this.$refs.digitTest.audiosInfo = this.getDigitAudios()
        }
        if (this.showComparison) {
          this.$refs.comparison.audiosInfo = this.getComparisonAudios()
        }
      } else {
        this.$store.commit('setPerformedListeningTest', false)
        this.finishSetup()
      }
    },
    checkSetup () {
      let mathQuestionValid = true
      let digitQuestionValid = true
      let comparisonValid = true
      if (this.showMathQuestion) {
        mathQuestionValid = this.$refs.mathQuestion.chekQuestion()
      }
      if (this.showDigitQuestion) {
        digitQuestionValid = this.$refs.digitTest.checkQuestion()
      }
      if (this.showComparison) {
        comparisonValid = this.$refs.comparison.checkTest()
      }
      if (mathQuestionValid && digitQuestionValid && comparisonValid) {
        this.saveSetup()
      }
    },
    async saveSetup () {
      try {
        if (this.showMathQuestion) {
          await this.$refs.mathQuestion.saveQuestion()
        }
        if (this.showDigitQuestion) {
          await this.$refs.digitTest.saveQuestion()
        }
        if (this.showComparison) {
          await this.$refs.comparison.saveTest()
        }
        this.finishSetup()
      } catch (error) {
        this.handleError(exceptions.Setup.FinishSetupException, error)
      }
    },
    async finishSetup () {
      let route
      if (this.isQualificationJob && !this.jobsAreSeparated) {
        await Service.finish({
          userActions: this.$store.getters.userActions
        })
        this.$store.commit('resetState')
        route = {
          name: 'InitSession',
          params: {
            workerId: this.$store.getters.workerId,
            campaignId: this.$store.getters.campaignId
          }
        }
      } else if (this.isTrainingJob || this.isRatingJob) {
        route = {
          name: 'RatingTask',
          params: {
            audiosInfo: this.isRatingJob ? this.getRatingAudios() : this.getTrainingAudios(),
            finishMessage: this.finishMessage
          }
        }
      }
      this.$router.push(route)
    }
  }
}
