export default {
  name: 'RatingIntroduction',
  props: {
    showActionButton: {
      type: Boolean,
      default: true
    },
    showGreeting: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      ratingJob: this.$store.getters.config.ratingJob
    }
  },
  computed: {
    allCompletedReward: function () {
      return (this.$store.getters.config.ratingJob.baseReward + this.$store.getters.config.ratingJob.bonusRewardAll).toFixed(2)
    },
    bestCompletedReward: function () {
      return (this.$store.getters.config.ratingJob.baseReward + this.$store.getters.config.ratingJob.bonusRewardBest).toFixed(2)
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
