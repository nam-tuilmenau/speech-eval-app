import DigitTestQuestion from '@/components/DigitTestQuestion/DigitTestQuestion.vue'
import { exceptions } from '@/data/constants'

export default {
  name: 'DigitTest',
  components: {
    DigitTestQuestion
  },
  data () {
    return {
      audiosInfos: []
    }
  },
  updated: function () {
    if (this.audiosInfos.length > 0) {
      this.prepareTest()
    }
  },
  methods: {
    checkTest () {
      let valid = true
      this.audiosInfos.forEach((audiosInfo, index) => {
        const question = this.getDigitTestQuestionComponent(index)
        if (!question.isValid()) {
          valid = false
        }
      })
      return valid
    },
    getDigitTestQuestionComponent (id) {
      return this.$refs[`question${id}`][0]
    },
    async saveTest () {
      try {
        this.audiosInfos.forEach((audioInfo, index) => {
          const question = this.getDigitTestQuestionComponent(index)
          question.saveQuestion()
        })
      } catch (error) {
        this.handleError(exceptions.SaveDataException)
      }
    }
  }
}
