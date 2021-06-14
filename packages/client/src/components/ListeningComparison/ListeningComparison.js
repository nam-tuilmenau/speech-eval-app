import Audio from '@/components/Audio/Audio.vue'
import AudioComparison from '@/components/AudioComparison/AudioComparison.vue'
import { exceptions } from '@/data/constants'
import Service from '@/services/Service'

export default {
  name: 'ListeningComparison',
  components: {
    AudioComparison
  },
  props: {
    audiosInfo: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    mappedAnswer: function () {
      const mapping = {
        0: this.sampleAId,
        1: -1,
        2: this.sampleBId
      }
      return mapping[this.answer]
    },
    answer: function () {
      return this.$refs.audioComparison.answer
    },
    finishTime: function () {
      return this.$refs.audioComparison.finishTime
    },
    startTime: function () {
      return this.$refs.audioComparison.startTime
    },
    sampleAId: function () {
      return this.audiosInfo[0].id
    },
    sampleBId: function () {
      return this.audiosInfo[1].id
    },
    rightNumberOfAudios: function () {
      return this.audiosInfo.length === 2
    }
  },
  data () {
    return {
      valid: true,
      taskId: this.$store.getters.config.audioTasks.comparisonTest.id,
      answerOptions: this.$store.getters.config.audioTasks.comparisonTest.possibleAnswers
    }
  },
  methods: {
    checkQuestion () {
      return this.$refs.audioComparison.checkQuestion()
    },
    async saveQuestion () {
      try {
        const audioComparison = {
          sampleAId: this.sampleAId,
          sampleBId: this.sampleBId,
          task: this.taskId,
          answer: this.mappedAnswer,
          numberOfReproductions: this.getNumberOfReproductions(),
          startTime: this.startTime,
          finishTime: this.finishTime
        }
        return await Service.postListeningComparison(audioComparison)
      } catch (error) {
        this.handleError(exceptions.SaveDataException, error)
      }
    },
    getNumberOfReproductions () {
      return this.$refs.audioComparison.getNumberOfReproductions()
    }
  }
}
