import ListeningComparison from '@/components/ListeningComparison/ListeningComparison.vue'
import { exceptions } from '@/data/constants'
import { shuffle } from 'lodash'

export default {
  name: 'ListeningComparisonTest',
  components: {
    ListeningComparison
  },
  data () {
    return {
      audiosInfo: []
    }
  },
  computed: {
    availableAudios: function () {
      return this.audiosInfo.length > 0
    },
    audiosInfoPairs: function () {
      const pairs = []
      const halfSize = this.audiosInfo.length / 2
      for (let i = 0; i < halfSize; i ++) {
        pairs.push(shuffle([ this.audiosInfo[i], this.audiosInfo[i + halfSize] ]))
      }
      return pairs
    }
  },
  methods: {
    checkTest () {
      let valid = true
      this.audiosInfoPairs.forEach((audiosInfo, index) => {
        const question = this.getListeningComparisonComponent(index)
        if (!question.checkQuestion()) {
          valid = false
        }
      })
      return valid
    },
    getListeningComparisonComponent (id) {
      return this.$refs[`question${id}`][0]
    },
    async saveTest () {
      try {
        const result = []
        for (let index = 0; index < this.audiosInfoPairs.length; index++) {
          const question = this.getListeningComparisonComponent(index)
          result.push(await question.saveQuestion())
        }
        return result
      } catch (error) {
        this.handleError(exceptions.SaveDataException)
      }
    }
  }
}
