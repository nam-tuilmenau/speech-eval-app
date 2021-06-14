import Service from '@/services/Service'
import { exceptions } from '@/data/constants'

export default {
  name: 'UserView',
  props: {
    jobUser: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      dialog: false
    }
  },
  computed: {
    accessStatusInfo: function () {
      return this.$store.getters.config.accessStatusInfo
    }
  },
  methods: {
    getColorOfAccessStatus (statusId) {
      switch (statusId) {
        case this.accessStatusInfo.blocked.id:
          return 'red'
        case this.accessStatusInfo.granted.id:
          return 'green'
        case this.accessStatusInfo.waiting.id:
          return 'amber'
        case this.accessStatusInfo.temporalBlocked.id:
          return 'orange'
      }
    },
    isTemporallyBlockedStatus (statusId) {
      return statusId === this.accessStatusInfo.temporalBlocked.id
    },
    blockPeriodMessage (blockTime, unblockTime) {
      return ` (from ${this.formattedTime(blockTime)} to ${this.formattedTime(unblockTime)})`
    },
    labelOfStatus (statusInfo, user) {
      let label = statusInfo.verbose
      if (this.isTemporallyBlockedStatus(statusInfo.id)) {
        label += this.blockPeriodMessage(user.blockTime, user.unblockTime)
      }
      return label
    },
    formattedTime (timeString) {
      return new Date(timeString).toLocaleString()
    },
    async saveUser (user) {
      try {
        await Service.updateUser(user)
        this.showMessage('The user\'s status was updated successfully')
        this.$emit('user-updated')
        this.dialog = false
      } catch (error) {
        this.handleError(exceptions.User.SaveUser, error)
      }
    }
  }
}
