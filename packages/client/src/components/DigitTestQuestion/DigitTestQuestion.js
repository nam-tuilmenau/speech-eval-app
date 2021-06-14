import AudioSequence from '@/components/AudioSequence/AudioSequence.vue'
import Service from '@/services/Service'
import { exceptions } from '@/data/constants'
import { shuffle } from 'lodash'

export default {
  name: 'DigitTestQuestion',
  data () {
    return {
      valid: true,
      answer: '',
      rules: [
        v => this.answerRegExp.test(v) || `Please enter the ${this.numberOfDigits} digits you hear, or '${this.noDigitChar}' if you don't understand a digit, separated by a space, e.g., ${this.answerSample}`
      ],
      audiosInfo: [],
      startTime: '',
      finishTime: ''
    }
  },
  computed: {
    answerSample: function () {
      let answers = shuffle([ 1, 2, 3, 4, 5, 6, 7, 8, 9 ])
      answers = answers.slice(0, this.numberOfDigits)
      answers[2] = this.noDigitChar
      return answers.join(this.digitSeparator)
    },
    numberOfDigits: function () {
      return this.audiosInfo.length
    },
    noDigitChar: function () {
      return this.$store.getters.config.audioTasks.digitQuestion.noDigitChar
    },
    digitSeparator: function () {
      return this.$store.getters.config.audioTasks.digitQuestion.digitSeparator
    },
    answerRegExp: function () {
      return new RegExp(`(\\d|\\${this.noDigitChar})(\\${this.digitSeparator}(\\d|\\${this.noDigitChar})){${this.numberOfDigits - 1}}`)
    },
    enoughAudios: function () {
      return this.audiosInfo.length > 0
    }
  },
  watch: {
    audiosInfo: function (newValue) {
      if (this.enoughAudios) {
        this.start()
      }
    },
    answer: function () {
      this.finishTime = new Date()
    }
  },
  components: {
    AudioSequence
  },
  mounted () {
    this.setStartTime()
  },
  methods: {
    start () {
      this.$nextTick(() => this.setFirstPlaybackListener())
    },
    setFirstPlaybackListener () {
      this.$refs.audioSequence.$on('first-playback', this.setStartTime)
    },
    setStartTime () {
      this.startTime = new Date()
    },
    checkQuestion () {
      return this.$refs.form.validate()
    },
    async saveQuestion () {
      const answers = []
      const digits = this.answer.split(this.digitSeparator)
      this.audiosInfo.forEach((audioInfo, index) => {
        const answer = {
          audioId: audioInfo.id,
          userAnswer: digits[index],
          numberOfReproductions: this.getNumberOfReproductions(),
          startTime: this.startTime,
          finishTime: this.finishTime
        }
        answers.push(answer)
      })
      try {
        return Service.postDigitTestAnswers(answers)
      } catch (error) {
        this.handleError(exceptions.SaveDataException)
      }
    },
    getNumberOfReproductions () {
      return this.$refs.audioSequence.numberOfReproductions
    }
  }
}
