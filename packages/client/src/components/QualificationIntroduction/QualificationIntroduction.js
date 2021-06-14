export default {
  name: 'QualificationIntroduction',
  data () {
    return {
      trainingJob: this.$store.getters.config.trainingJob,
      ratingJob: this.$store.getters.config.ratingJob,
      qualificationJob: this.$store.getters.config.qualificationJob
    }
  },
  methods: {
    next () {
      this.$router.push({ name: 'DemographicInfo' })
    }
  }
}
