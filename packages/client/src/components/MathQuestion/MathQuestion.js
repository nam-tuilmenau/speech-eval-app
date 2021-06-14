import Audio from '@/components/Audio/Audio.vue'
import Service from '@/services/Service.js'
import { exceptions } from '@/data/constants'

export default {
  name: 'MathQuestion',
  data () {
    return {
      valid: true,
      answer: '',
      rules: [
        v => this.answerRegExp.test(v) || `Please answer the math question you hear. For instance: ${this.answerSample}`
      ],
      audioId: -1,
      startTime: '',
      finishTime: ''
    }
  },
  watch: {
    audioId: function (newId) {
      if (this.isReadyToStart) {
        this.start()
      }
    },
    answer: function () {
      this.finishTime = new Date()
    }
  },
  components: {
    Audio
  },
  computed: {
    isReadyToStart: function () {
      return this.audioId > 0
    },
    answerRegExp: function () {
      return new RegExp(`^[-]?\\d*\\.?\\d*$`)
    },
    answerSample: function () {
      return '10'
    }
  },
  mounted () {
    this.setStartTime()
  },
  methods: {
    start () {
      this.prepareQuestion()
      this.$refs.audio.$on('first-playback', this.setStartTime)
    },
    setStartTime () {
      this.startTime = new Date()
    },
    chekQuestion () {
      return this.$refs.form.validate()
    },
    async prepareQuestion () {
      this.$refs.audio.prepareAudioInstance()
    },
    async saveQuestion () {
      try {
        const userAnswer = {
          audioId: this.audioId,
          userAnswer: this.getAnswer(),
          numberOfReproductions: this.getNumberOfReproductions(),
          startTime: this.startTime,
          finishTime: this.finishTime
        }
        return Service.postMathQuestionAnswer(userAnswer)
      } catch (error) {
        this.handleError(exceptions.SaveDataException)
      }
    },
    getAnswer () {
      return parseInt(this.answer)
    },
    getNumberOfReproductions () {
      return this.$refs.audio.numberOfReproductions
    }
  }
}
