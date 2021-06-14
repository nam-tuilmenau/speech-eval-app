import Audio from '@/components/Audio/Audio.vue'

export default {
  name: 'AudioComparison',
  props: {
    audiosInfo: {
      type: Array,
      default: () => []
    },
    instruction: {
      type: String,
      default: 'Which sample has a better quality compared to the other one'
    },
    sampleAName: {
      type: String,
      default: 'Sample A'
    },
    sampleBName: {
      type: String,
      default: 'Sample B'
    },
    answerOptions: {
      type: Array,
      required: true
    },
    listeningIsRequired: {
      type: Boolean,
      default: false
    },
    autoFocus: {
      type: Boolean,
      default:false
    }
  },
  computed: {
    sampleAId: function () {
      return this.audiosInfo[0].id
    },
    sampleBId: function () {
      return this.audiosInfo[1].id
    },
    rightNumberOfAudios: function () {
      return this.audiosInfo.length === 2
    },
    answer: function () {
      return this.answerOptions[this.selectedAnswer].value !== undefined ? this.answerOptions[this.selectedAnswer].value : this.selectedAnswer
    }
  },
  data () {
    return {
      valid: true,
      selectedAnswer: '',
      taskId: this.$store.getters.config.audioTasks.comparisonTest.id,
      rules: [
        v => v !== '' || 'Please select one of the options.'
      ],
      startTime: '',
      finishTime: '',
      playbackAEnded: false,
      playbackBEnded: false
    }
  },
  components: {
    Audio
  },
  watch: {
    audiosInfo: function (newValue) {
      if (this.rightNumberOfAudios) {
        this.start()
      }
    },
    selectedAnswer: function () {
      this.finishTime = new Date()
    }
  },
  mounted () {
    if (this.rightNumberOfAudios) {
      this.setStartTime()
      this.start()
    }
  },
  methods: {
    start () {
      this.getSampleAAudio().$on('first-playback', this.setStartTime)
      this.getSampleBAudio().$on('first-playback', this.setStartTime)
      if (this.listeningIsRequired) {
        this.getSampleAAudio().$on('playback-finished', this.handlePlaybackAEnded)
        this.getSampleBAudio().$on('playback-finished', this.handlePlaybackBEnded)
      }
      if (this.autoFocus) {
        this.getSampleAAudio().focusPlayBtn()
      }
    },
    setStartTime () {
      if (this.startTime === '') {
        this.startTime = new Date()
      }
    },
    checkQuestion () {
      return this.$refs.form.validate()
    },
    getNumberOfReproductions () {
      const numberOfReproductions = {}
      numberOfReproductions[this.sampleAId] = this.getSampleAAudio().numberOfReproductions
      numberOfReproductions[this.sampleBId] = this.getSampleBAudio().numberOfReproductions
      return numberOfReproductions
    },
    getSampleAAudio () {
      return this.$refs[this.sampleAId][0]
    },
    getSampleBAudio () {
      return this.$refs[this.sampleBId][0]
    },
    prepareAudios () {
      this.getSampleAAudio().focusPlayBtn()
      this.getSampleAAudio().prepareAudioInstance()
      this.getSampleBAudio().prepareAudioInstance()
    },
    handlePlaybackAEnded () {
      this.playbackAEnded = true
    },
    handlePlaybackBEnded () {
      this.playbackBEnded = true
    }
  }
}
