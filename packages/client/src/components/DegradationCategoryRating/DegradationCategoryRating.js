import Audio from '@/components/Audio/Audio.vue'
import AudioComparison from '@/components/AudioComparison/AudioComparison.vue'
import Service from '@/services/Service'
import { exceptions } from '@/data/constants'

export default {
  name: 'DegradationCategoryRating',
  components: {
    AudioComparison
  },
  props: {
    audiosInfo: {
      type: Array,
      default: () => []
    },
    questionNumber: {
      type: Number,
      default: 1
    }
  },
  computed: {
    answer: function () {
      return this.$refs.audioComparison.answer
    },
    finishTime: function () {
      return this.$refs.audioComparison.finishTime
    },
    startTime: function () {
      return this.$refs.audioComparison.startTime
    },
    referenceAudio: function () {
      return this.audiosInfo[0].processed ? this.audiosInfo[1] : this.audiosInfo[0]
    },
    processedAudio: function () {
      return this.audiosInfo[0].processed ? this.audiosInfo[0] : this.audiosInfo[1]
    },
    rightNumberOfAudios: function () {
      return this.audiosInfo.length === 2
    },
    answerOptions: function () {
      return this.$store.getters.config.audioTasks.degradationCategoryRating.possibleAnswers
    },
    instruction: function () {
      return `${this.questionNumber}. ${this.$store.getters.config.audioTasks.degradationCategoryRating.instruction}`
    },
    taskId: function () {
      return this.audiosInfo[0].task
    }
  },
  data () {
    return {
      valid: true
    }
  },
  methods: {
    isValid () {
      return this.$refs.audioComparison.checkQuestion()
    },
    prepareAudio () {
      this.$refs.audioComparison.prepareAudios()
    },
    saveAudio () {
      try {
        if (this.isGoldStandardQuestion()) {
          return this.saveGoldStandardQuestion()
        } else {
          return this.saveUserRating()
        }
      } catch (error) {
        this.handleError(exceptions.RatingAudio.SaveAudioException, error)
      }
    },
    isGoldStandardQuestion () {
      return this.taskId === this.$store.getters.config.audioTasks.goldStandardDCR.id
    },
    saveGoldStandardQuestion () {
      const userAnswer = {
        comparisonGoldStandardPairId: this.processedAudio.comparisonGoldStandardPairId,
        userAnswer: this.answer,
        numberOfReproductions: this.getNumberOfReproductions(),
        startTime: this.startTime,
        finishTime: this.finishTime
      }
      return Service.postComparisonGoldStandardUser(userAnswer)
    },
    saveUserRating () {
      const rating = {
        audioId: this.processedAudio.id,
        rating: this.answer,
        numberOfReproductions: this.getNumberOfReproductions(),
        startTime: this.startTime,
        finishTime: this.finishTime,
        comparisonRatingPairId: this.processedAudio.comparisonRatingPairId
      }
      this.$store.commit('setAudioRating', rating)
      return Service.postDegradationCategoryRatingUser(rating)
    },
    getNumberOfReproductions () {
      return this.$refs.audioComparison.getNumberOfReproductions()
    }
  }
}
