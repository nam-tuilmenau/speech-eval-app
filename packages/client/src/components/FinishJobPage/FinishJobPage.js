import MessagePage from '@/components/MessagePage/MessagePage.vue'
import Service from '@/services/Service'
import { exceptions, paymentCodeProps } from '@/data/constants'

export default {
  name: 'FinishJobPage',
  components: {
    MessagePage
  },
  props: {
    title: {
      type: String,
      default: 'Thank you for your participation'
    },
    message: {
      type: String,
      default: ''
    }
  },
  computed: {
    paymentCode: function () {
      return `${paymentCodeProps.prefix}${this.finishCode}${paymentCodeProps.suffix}`
    }
  },
  data () {
    return {
      finishCode: '',
      showFinishCode: true
    }
  },
  created () {
    document.addEventListener('beforeunload', this.finish)
  },
  mounted () {
    if (!this.$store.getters.userId && !this.$store.getters.jobId) {
      this.$router.push({
        name: 'MessagePage',
        params: exceptions.TestConductionError
      })
    } else {
      this.finish()
    }
  },
  methods: {
    async finish () {
      try {
        if (this.$store.getters.blockedUser) {
          this.showFinishCode = false
          this.$store.commit('resetState')
          Service.closeSession()
        } else {
          this.finishCode = this.$store.getters.jobUserId
          await Service.finish({
            userActions: this.$store.getters.userActions
          })
          this.$store.commit('resetState')
          this.$store.commit('setFinishCode', this.finishCode)
        }
      } catch (error) {
        this.$router.push({
          name: 'MessagePage',
          params: exceptions.FinishSessionException
        })
        this.handleError(exceptions.FinishSessionException, error)
      }
    },
    copyToClipboard () {
      const copyText = this.$refs.finishCodeText.$el.querySelector('input')
      copyText.select()
      copyText.setSelectionRange(0, 99999)
      document.execCommand('copy')
      this.showMessage('The code was copied to clipboard')
    }
  }
}
