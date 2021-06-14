import Service from '@/services/Service'
import { exceptions, userMessages } from '@/data/constants'
import MessagePage from '@/components/MessagePage/MessagePage.vue'

export default {
  name: 'MetaBalancer',
  components: {
    MessagePage
  },
  props: {
    workerId: {
      type: String
    },
    campaignId: {
      type: String
    }
  },
  data () {
    return {
      valid: true,
      noMoreJobs: false,
      askWorkerId: false,
      selfWorkerId: '',
      rules: [
        v => !!v || 'Please enter your worker id.'
      ],
    }
  },
  mounted () {
    if (!this.workerId && !this.$store.getters.workerId) {
      this.askWorkerId = true
    } else {
      this.start()
    }
  },
  methods: {
    async start () {
      this.determineUrl()
    },
    async determineUrl () {
      try {
        const worker = {
          workerId: this.workerId || this.$store.getters.workerId,
          campaignId: this.campaignId || this.$store.getters.campaignId
        }
        const result = await Service.determineStartUrl(worker)
        if (!worker.campaignId && result.data.worker) {
          worker.campaignId = result.data.worker.campaignId
        }
        this.$store.commit('setWorkerId', worker.workerId)
        this.$store.commit('setCampaignId', worker.campaignId)
        if (result.data.urlInfo.noMoreJobs) {
          this.noMoreJobs = true
        } else if (result.data.urlInfo.external) {
          window.location = `${result.data.urlInfo.url}&user_id=${worker.workerId}&campaign_id=${worker.campaignId}`
        } else {
          this.$router.push({
            name: 'InitSession',
            params: worker
          })
        }
      } catch (error) {
        this.handleError(exceptions.MetaBalancerException, error)
      }
    },
    validate () {
      if (this.$refs.form.validate()) {
        this.workerId = this.selfWorkerId
        this.start()
      }
    }
  }
}
