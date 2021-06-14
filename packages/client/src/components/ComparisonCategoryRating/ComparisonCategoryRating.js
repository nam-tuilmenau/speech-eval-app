import Audio from '@/components/Audio/Audio.vue'
import AudioComparison from '@/components/AudioComparison/AudioComparison.vue'
import Service from '@/services/Service'
import { exceptions } from '@/data/constants'
import { shuffle } from 'lodash'

export default {
  name: 'ComparisonCategoryRating',
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
    firstAudioId: function () {
      return this.shuffledAudiosInfo[0].id
    },
    ratedAudio: function () {
      return this.audiosInfo[0].processed ? this.audiosInfo[0] : this.audiosInfo[1]
    },
    rightNumberOfAudios: function () {
      return this.shuffledAudiosInfo.length === 2
    },
    answerOptions: function () {
      return this.$store.getters.config.audioTasks.comparisonCategoryRating.possibleAnswers
    },
    instruction: function () {
      return `${this.questionNumber}. ${this.$store.getters.config.audioTasks.comparisonCategoryRating.instruction}`
    },
    taskId: function () {
      return this.audiosInfo[0].task
    }
  },
  watch: {
    audiosInfo: function () {
      this.setShuffledAudiosInfo()
    }
  },
  data () {
    return {
      valid: true,
      shuffledAudiosInfo: [] 
    }
  },
  mounted (){
    this.setShuffledAudiosInfo()
  },
  methods: {
    isValid () {
      return this.$refs.audioComparison.checkQuestion()
    },
    prepareAudio () {
      this.$refs.audioComparison.prepareAudios()
    },
    setShuffledAudiosInfo () {
      this.shuffledAudiosInfo = shuffle(this.audiosInfo)
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
      return this.taskId === this.$store.getters.config.audioTasks.goldStandardCCR.id
    },
    saveGoldStandardQuestion () {
      const userAnswer = {
        comparisonGoldStandardPairId: this.ratedAudio.comparisonGoldStandardPairId,
        userAnswer: this.answer,
        numberOfReproductions: this.getNumberOfReproductions(),
        startTime: this.startTime,
        finishTime: this.finishTime
      }
      return Service.postComparisonGoldStandardUser(userAnswer)
    },
    saveUserRating () {
      const rating = {
        rating: this.answer,
        numberOfReproductions: this.getNumberOfReproductions(),
        startTime: this.startTime,
        finishTime: this.finishTime,
        firstAudioId: this.firstAudioId,
        ratedAudioId: this.ratedAudio.id,
        comparisonRatingPairId: this.ratedAudio.comparisonRatingPairId
      }
      this.$store.commit('setAudioRating', rating)
      return Service.postComparisonCategoryRatingUser(rating)
    },
    getNumberOfReproductions () {
      return this.$refs.audioComparison.getNumberOfReproductions()
    }
  }
}
