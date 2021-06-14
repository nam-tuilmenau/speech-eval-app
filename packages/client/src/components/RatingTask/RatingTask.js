import RatingAudio from '@/components/RatingAudio/RatingAudio.vue'
import DegradationCategoryRating from '@/components/DegradationCategoryRating/DegradationCategoryRating.vue'
import ComparisonCategoryRating from '@/components/ComparisonCategoryRating/ComparisonCategoryRating.vue'
import RatingIntroduction from '@/components/RatingIntroduction/RatingIntroduction.vue'
import Service from '@/services/Service'

export default {
  name: 'RatingTask',
  components: {
    RatingAudio,
    RatingIntroduction,
    DegradationCategoryRating,
    ComparisonCategoryRating
  },
  props: {
    audiosInfo: {
      type: Array,
      required: true
    },
    finishMessage: {
      type: Object
    }
  },
  computed: {
    currentQuestion: function () {
      return this.ratedAudios + 1
    },
    totalQuestions: function () {
      return this.audiosInfo.length
    },
    progress: function () {
      return this.currentQuestion * 100 / this.audiosInfo.length
    },
    jobId: function () {
      return this.$store.getters.jobId
    },
    readyToStart: function () {
      return this.audiosInfo.length > 0
    },
    isRatingJob: function () {
      return this.jobId === this.$store.getters.config.ratingJob.id
    },
    isRepeatingRatingJob: function () {
      return this.$store.getters.repeatingJob && this.isRatingJob
    }
  },
  data () {
    return {
      started: false,
      currentAudioIndex: -1,
      ratedAudios: 0
    }
  },
  mounted () {
    this.currentAudioIndex = 0
  },
  methods: {
    startRatingTask () {
      this.started = true
    },
    checkCurrentAudio () {
      const question = this.getRatingAudioComponent(this.currentAudioIndex)
      return question.isValid()
    },
    getRatingAudioComponent (index) {
      return this.$refs[`question${index}`][0]
    },
    prepareTask () {
      this.audiosInfo.forEach((audioInfo, index) => {
        const question = this.getRatingAudioComponent(index)
        question.prepareAudio()
      })
    },
    async nextAudio () {
      if (this.checkCurrentAudio()) {
        const result = await this.getRatingAudioComponent(this.currentAudioIndex).saveAudio()
        if (result.data.success) {
          this.ratedAudios++
          if (this.ratedAudios < this.audiosInfo.length) {
            this.currentAudioIndex++
          } else {
               this.finishJob()         
          }
        }
      }
    },
    finishJob: async function () {
      let route
      if (this.isRatingJob || this.$store.getters.config.jobsAreSeparated) {
        route = {
          name: 'FinishJobPage',
          params: this.finishMessage
        }
      } else {
        route = {
          name: 'InitSession',
          params: {
            workerId: this.$store.getters.workerId,
            campaignId: this.$store.getters.campaignId
          }
        }
        await Service.finish({
          userActions: this.$store.getters.userActions
        })
        this.$store.commit('resetState')
      }
      this.$router.push(route)
    },
    isDegradationCategoryRating: function (audioInfo) {
      return Array.isArray(audioInfo) &&
      (audioInfo[0].task === this.$store.getters.config.audioTasks.degradationCategoryRating.id ||
      audioInfo[0].task === this.$store.getters.config.audioTasks.goldStandardDCR.id)
    },
    isComparisonCategoryRating: function (audioInfo) {
      return Array.isArray(audioInfo) &&
      (audioInfo[0].task === this.$store.getters.config.audioTasks.comparisonCategoryRating.id ||
      audioInfo[0].task === this.$store.getters.config.audioTasks.goldStandardCCR.id)
    }
  }
}
