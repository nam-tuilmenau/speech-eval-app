// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import vuetify from '@/plugins/vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.config.productionTip = false

function handleError (error, fullError) {
  // router.push({ name: 'MessagePage', params: error })
  if (!Vue.config.productionTip) {
    console.log(error, fullError)
  }
}

Vue.config.errorHandler = function (err, vm, info) {
  handleError({
    title: err.title || err.toString(),
    message: err.message || info
  }, err)
}
window.onerror = function (message, source, line, column, error) {
  handleError({
    title: 'Unexpected Error',
    message: message
  }, error)
}
Vue.use(Vuex)

const vuexLocalStorage = new VuexPersist({
  key: 'vuex', // The key to store the state on in the storage provider.
  storage: window.localStorage // or window.sessionStorage or localForage
  // Function that passes the state and returns the state with only the objects you want to store.
  // reducer: state => state,
  // Function that passes a mutation and lets you decide if it should update the state in localStorage.
  // filter: mutation => (true)
})

const getDefaultState = () => {
  return {
    config: {},
    userId: '',
    finished: false,
    jobId: '',
    workerId: '',
    campaignId: '',
    jobUserId: '',
    demographicData: '',
    finishCode: '',
    audioInfos: [],
    audioQuestionAnswers: {},
    audioRatings: {},
    notification: { show: false, message: '', type: '' },
    shouldPerformListeningTests: true,
    performedListeningTest: true,
    blockedUser: false,
    userActions: [],
    repeatingJob: false,
    clientUUID: ''
  }
}

// initial state
const state = getDefaultState()

const store = new Vuex.Store({
  state,
  mutations: {
    setConfig (state, value) {
      state.config = value
    },
    setClientUUID (state, value) {
      state.clientUUID = value
    },
    setUserId (state, value) {
      state.userId = value
    },
    setWorkerId (state, value) {
      state.workerId = value
    },
    setCampaignId (state, value) {
      state.campaignId = value
    },
    setJobId (state, value) {
      state.jobId = value
    },
    setJobUserId (state, value) {
      state.jobUserId = value
    },
    setDemographicData (state, value) {
      state.demographicData = value
    },
    setFinishCode (state, value) {
      state.finishCode = value
    },
    setAudioQuestionAnswer (state, value) {
      state.audioQuestionAnswers[value.audioId] = value.userAnswer
    },
    setAudioRating (state, value) {
      state.audioRatings[value.audioId] = value.rating
    },
    setNotification (state, value) {
      state.notification = value
    },
    setAudioInfos (state, value) {
      state.audioInfos = value
    },
    setShouldPerformListeningTests (state, value) {
      state.shouldPerformListeningTests = value
    },
    setPerformedListeningTest (state, value) {
      state.performedListeningTest = value
    },
    setBlockedUser (state, value) {
      state.blockedUser = value
    },
    setUserAction (state, value) {
      value.time = new Date()
      state.userActions.push(value)
    },
    setRepeatingJob (state, value) {
      state.repeatingJob = value
    },
    resetState (state) {
      const workerId = state.workerId
      const campaignId = state.campaignId
      const defaultState = getDefaultState()
      defaultState.workerId = workerId
      defaultState.campaignId = campaignId
      Object.assign(state, defaultState)
    }
  },
  actions: {
    resetState ({ commit }) {
      commit('resetState')
    },
    setClientUUID ({ commit }, value) {
      commit('setClientUUID', value)
    },
    setConfig ({ commit }, value) {
      commit('setConfig', value)
    },
    setUserId ({ commit }, value) {
      commit('setUserId', value)
    },
    setJobId ({ commit }, value) {
      commit('setJobId', value)
    },
    setWorkerId ({ commit }, value) {
      commit('setWorkerId', value)
    },
    setCampaignId ({ commit }, value) {
      commit('setCampaignId', value)
    },
    setJobUserId ({ commit }, value) {
      commit('setJobUserId', value)
    },
    setDemographicData ({ commit }, value) {
      commit('setDemographicData', value)
    },
    setFinishCode ({ commit }, value) {
      commit('setFinishCode', value)
    },
    setAudioQuestionAnswer ({ commit }, value) {
      commit('setAudioQuestionAnswer', value)
    },
    setAudioRating ({ commit }, value) {
      commit('setAudioRatings', value)
    },
    setNotification ({ commit }, value) {
      commit('setNotification', value)
    },
    setAudioInfos ({ commit }, value) {
      commit('setAudioInfos', value)
    },
    setShouldPerformListeningTests ({ commit }, value) {
      commit('setShouldPerformListeningTests', value)
    },
    setPerformedListeningTest ({ commit }, value) {
      commit('setPerformedListeningTest', value)
    },
    setBlockedUser ({ commit }, value) {
      commit('setBlockedUser', value)
    },
    setUserAction ({ commit }, value) {
      commit('setUserAction', value)
    },
    setRepeatingJob ({ commit }, value) {
      commit('setRepeatingJob', value)
    }
  },
  getters: {
    config: state => state.config,
    clientUUID: state => state.clientUUID,
    userId: state => state.userId,
    workerId: state => state.workerId,
    campaignId: state => state.campaignId,
    jobId: state => parseInt(state.jobId),
    jobUserId: state => state.jobUserId,
    demographicData: state => state.demographicData,
    finishCode: state => state.finishCode,
    audioQuestionAnswers: state => state.audioQuestionAnswers,
    audioRatings: state => state.audioRatings,
    notification: state => state.notification,
    audioInfos: state => state.audioInfos,
    shouldPerformListeningTests: state => state.shouldPerformListeningTests,
    performedListeningTest: state => state.performedListeningTest,
    blockedUser: state => state.blockedUser,
    userActions: state => state.userActions,
    repeatingJob: state => state.repeatingJob
  },
  plugins: [ vuexLocalStorage.plugin ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.name !== 'FinishJobPage' && record.name !== 'InitSession' && record.name !== 'MessagePage') &&
  store.getters.finished === true) {
    next({ name: 'FinishJobPage' })
  } else {
    next()
  }
})

Vue.mixin({
  methods: {
    handleError: function (errorInfo, error) {
      let message = errorInfo.message || 'Unknown error, please try again'
      if (this.isServerError(error)) {
        message += '\n' + error.response.statusText
        if (this.shouldRestart(error.response)) {
          this.restart()
        }
      }
      this.$store.commit('setNotification', { message, type: 'error', show: true })
      handleError(errorInfo, error)
    },
    showMessage: function (message) {
      this.$store.commit('setNotification', { message, type: 'info', show: true })
    },
    isServerError: function (error) {
      return error.response !== undefined
    },
    shouldRestart: function (response) {
      return response.data.shouldRestart
    },
    restart: function () {
      this.$router.push({
        name: 'InitSession',
        params: {
          workerId: this.$store.getters.workerId,
          campaignId: this.$store.getters.campaignId,
          sessionExpired: true
        }
      })
    }
  }
})
/* eslint-disable no-new */
new Vue({
  store,
  vuetify,
  el: '#app',
  router,
  components: { App },
  template: `<App/>`
})
