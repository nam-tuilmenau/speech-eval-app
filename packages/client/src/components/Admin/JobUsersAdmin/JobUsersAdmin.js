import { exceptions, paymentCodeProps } from '@/data/constants'
import Service from '@/services/Service'
import JobValidityView from '@/components/Admin/JobValidityView/JobValidityView.vue'
import UserView from '@/components/Admin/UserView/UserView.vue'

export default {
  name: 'JobUsersAdmin',
  components: {
    JobValidityView,
    UserView
  },
  data () {
    return {
      search: '',
      totalJobUsers: 0,
      lastJobUsers: [],
      loading: true,
      options: {
        sortBy: [ 'startTime' ],
        sortDesc: [ true ]
      },
      headers: [
        {
          text: 'Id (Payment Code)',
          align: 'start',
          sortable: false,
          value: 'id',
          width: '25em'
        },
        { text: 'User Id', value: 'User', width: '30em' },
        { text: 'Job', value: 'jobId' },
        { text: 'Start Timestamp', value: 'startTime', width: '13em' },
        { text: 'Finish Timestamp', value: 'finishTime', width: '13em' },
        { text: 'Job Expiration Time', value: 'expirationTime', width: '13em' },
        { text: 'Validity', value: 'validity' },
        { text: 'Client Id', value: 'clientUUID', width: '25em' },
        { text: 'Associated Listening Id', value: 'ListeningTestId', width: '25em' }
      ],
      footerProps: {
        itemsPerPageOptions: [ 10, 20, 30, 40, 50, 100 ]
      },
      internalCompletion: 0,
      externalCompletion: 0
    }
  },
  watch: {
    options: {
      handler () {
        this.loadData()
      },
      deep: true
    },
  },
  computed: {
    serverOptions: function () {
      return {
        page: this.options.page,
        itemsPerPage: this.options.itemsPerPage,
        orderBy: this.options.sortBy[0],
        desc: !!this.options.sortDesc[0],
        substring: this.trimmedSearch
      }
    },
    trimmedSearch: function () {
      return this.search ? this.search.replace(paymentCodeProps.prefix, '').replace(paymentCodeProps.suffix, '') : ''
    }
  },
  mounted () {
    this.loadConfig()
    this.loadData()
  },
  methods: {
    async loadConfig () {
      const result = await Service.fetchAdminConfig()
      this.$store.commit('setConfig', result.data.config)
    },
    async loadData () {
      try {
        this.loading = true
        const lastJobUsersResult = await Service.fetchLastUserSessions(this.serverOptions)
        this.totalJobUsers = lastJobUsersResult.data.total
        this.lastJobUsers = lastJobUsersResult.data.lastJobUsers
        this.internalCompletion = lastJobUsersResult.data.completion.internal.toFixed(2) * 100
        this.externalCompletion = lastJobUsersResult.data.completion.external.toFixed(2) * 100
        this.loading = false
      } catch (error) {
        this.handleError(exceptions.Setup.FetchAudiosException, error)
      }
    },
    formattedTime (timeString) {
      return new Date(timeString).toLocaleString()
    }
  }
}
