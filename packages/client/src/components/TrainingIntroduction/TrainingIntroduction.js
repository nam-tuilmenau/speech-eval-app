export default {
  name: 'TrainingIntroduction',
  data () {
    return {
      trainingJob: this.$store.getters.config.trainingJob
    }
  },
  computed: {
    retraining: function () {
      return this.$store.getters.repeatingJob
    }
  },
  methods: {
    next () {
      this.$router.push({
        name: 'Setup'
      })
    }
  }
}
