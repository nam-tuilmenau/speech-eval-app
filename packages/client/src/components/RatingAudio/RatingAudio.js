import Audio from '@/components/Audio/Audio.vue'
import Service from '@/services/Service.js'
import { exceptions } from '@/data/constants'

export default {
  name: 'RatingAudio',
  props: {
    audioInfo: {
      type: Object, // { id: , src: , job: , task: }
      required: true
    },
    questionNumber: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      valid: true,
      rating: '',
      showErrorMessage: false,
      possibleAnswers: this.$store.getters.config.audioTasks.rating.possibleAnswers,
      rules: [
        v => !!v || 'Please rate the quality of the audio.'
      ],
      canBeRated: false,
      startTime: '',
      finishTime: ''
    }
  },
  watch: {
    rating: function () {
      this.finishTime = new Date()
    }
  },
  mounted () {
    if (this.$store.getters.audioRatings.hasOwnProperty(this.audioInfo.id)) {
      this.answer = this.$store.getters.audioRatings[this.audioInfo.id]
    }
    this.prepareAudio()
    this.$refs.audio.$on('playback-finished', this.playbackEnded)
    this.$refs.audio.$on('first-playback', this.firstPlaybackHandler)
  },
  components: {
    Audio
  },
  methods: {
    firstPlaybackHandler () {
      this.startTime = new Date()
    },
    getElementId (index) {
      return `rating-${this.questionNumber}-${index}`
    },
    isValid () {
      return this.$refs.form.validate()
    },
    getRating () {
      return parseInt(this.rating)
    },
    playbackEnded () {
      this.canBeRated = true
    },
    prepareAudio () {
      this.$refs.audio.focusPlayBtn()
      this.$refs.audio.prepareAudioInstance()
    },
    saveAudio () {
      try {
        if (this.isGoldStandardQuestion()) {
          return this.saveGoldStandardQuestion()
        } else if (this.isTrappingQuestion()) {
          return this.saveTrappingQuestion()
        } else {
          return this.saveUserRating()
        }
      } catch (error) {
        this.handleError(exceptions.RatingAudio.SaveAudioException, error)
      }
    },
    isTrappingQuestion () {
      return this.audioInfo.task === this.$store.getters.config.audioTasks.trappingQuestion.id
    },
    isGoldStandardQuestion () {
      return this.audioInfo.task === this.$store.getters.config.audioTasks.goldStandardQuestion.id
    },
    saveGoldStandardQuestion () {
      const userAnswer = {
        audioId: this.audioInfo.id,
        userAnswer: this.getRating(),
        numberOfReproductions: this.getNumberOfReproductions(),
        startTime: this.startTime,
        finishTime: this.finishTime
      }
      return Service.postGoldStandardAnswer(userAnswer)
    },
    saveTrappingQuestion () {
      const userAnswer = {
        audioId: this.audioInfo.id,
        userAnswer: this.getRating(),
        numberOfReproductions: this.getNumberOfReproductions(),
        startTime: this.startTime,
        finishTime: this.finishTime
      }
      return Service.postTrappingQuestion(userAnswer)
    },
    saveUserRating () {
      const rating = {
        audioId: this.audioInfo.id,
        rating: this.getRating(),
        numberOfReproductions: this.getNumberOfReproductions(),
        startTime: this.startTime,
        finishTime: this.finishTime
      }
      this.$store.commit('setAudioRating', rating)
      return Service.postAudioUserRating(rating)
    },
    getNumberOfReproductions () {
      return this.$refs.audio.numberOfReproductions
    }
  }
}
