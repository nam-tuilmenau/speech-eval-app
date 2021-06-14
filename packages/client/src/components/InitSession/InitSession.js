import Service from '@/services/Service'
import { exceptions, userMessages } from '@/data/constants'
import MessagePage from '@/components/MessagePage/MessagePage.vue'
import { v4 as uuidv4 } from 'uuid'

export default {
  name: 'InitSession',
  components: {
    MessagePage
  },
  props: {
    workerId: {
      type: String
    },
    campaignId: {
      type: String
    },
    urlJobId: {
      type: String
    },
    sessionExpired: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    jobId: function () {
      return this.$store.getters.jobId
    },
    formattedUnblockTime: function () {
      return `${this.unblockTime.toLocaleDateString()} at ${this.unblockTime.toLocaleTimeString()}`
    }
  },
  data () {
    return {
      unblockTime: '',
      accessDenied: false,
      startedSession: false,
      forceInit: false,
      shouldWait: false,
      clientUUID: ''
    }
  },
  mounted () {
    this.start()
  },
  methods: {
    async start () {
      this.$store.commit('resetState')
      if (this.workerId && this.campaignId) {
        this.postWorker()
      } else {
        this.handleError(exceptions.InvalidUrlException)
      }
    },
    forceInitSession () {
      this.forceInit = true
      this.postWorker()
    },
    async postWorker () {
      try {
        const result = await Service.postWorker(this.getWorkerInfo())
        if (result.data.startedSession) {
          this.startedSession = true
        } else {
          if (result.data.accessDenied) {
            this.accessDenied = true
          } else if (result.data.shouldWait) {
            this.shouldWait = true
          } else if (result.data.unblockTime) {
            this.handleBlockedUser(result.data.unblockTime)
          } else {
            await this.setInitialState(result.data)
          }
          this.$router.push(this.determineNext())
        }
      } catch (error) {
        this.handleError(exceptions.InitSessionException, error)
      }
    },
    getWorkerInfo () {
      this.clientUUID = uuidv4()
      const workerInfo = {
        workerId: this.workerId,
        campaignId: this.campaignId,
        forceInit: this.forceInit,
        clientUUID: this.clientUUID,
        urlJobId: this.urlJobId
      }
      return workerInfo
    },
    async setInitialState (data) {
      const result = await Service.fetchConfig()
      this.$store.commit('setConfig', result.data.config)
      this.$store.commit('setUserId', data.userId)
      this.$store.commit('setJobId', data.jobId)
      this.$store.commit('setJobUserId', data.jobUserId)
      this.$store.commit('setShouldPerformListeningTests', data.shouldPerformListeningTests)
      this.$store.commit('setRepeatingJob', data.repeatingJob)
      this.$store.commit('setRepeatingJob', data.repeatingJob)
      this.$store.commit('setClientUUID', this.clientUUID)
      this.$store.commit('setWorkerId', this.workerId)
      this.$store.commit('setCampaignId', this.campaignId)
    },
    handleBlockedUser (unblockTime) {
      this.unblockTime = new Date(unblockTime)
      this.$store.commit('setBlockedUser', true)
    },
    determineNext () {
      if (this.accessDenied) {
        return {
          name: 'MessagePage',
          params: userMessages.InitSession.AccessDenied
        }
      }
      if (this.shouldWait) {
        return {
          name: 'MessagePage',
          params: userMessages.InitSession.ShouldWait
        }
      }
      if (this.unblockTime !== '') {
        return {
          name: 'MessagePage',
          params: {
            title: userMessages.InitSession.BlockedUser.title,
            message: `${userMessages.InitSession.BlockedUser.message} You will be able to conduct a new job on ${this.formattedUnblockTime}.`
          }
        }
      }
      switch (parseInt(this.jobId)) {
        case this.$store.getters.config.qualificationJob.id: {
          return { name: 'QualificationIntroduction' }
        }
        case this.$store.getters.config.trainingJob.id: {
          return { name: 'TrainingIntroduction' }
        }
        case this.$store.getters.config.ratingJob.id: {
          const name = this.$store.getters.repeatingJob ? 'Setup' : 'RatingIntroduction'
          return { name }
        }
        default: {
          this.handleError(exceptions.InvalidUrlException)
        }
      }
    }
  }
}
