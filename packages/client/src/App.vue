<template>
  <v-app id="app">
    <v-content>
      <v-container fluid>
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="8"
          >
            <router-view />
          </v-col>
        </v-row>
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="8"
          >
            <p>
              Contact and Help: <a
                :href="'mailto:' + contactEmail"
                target="_blank"
              >
                {{ contactEmail }}</a>
            </p>
          </v-col>
        </v-row>
      </v-container>
      <Snackbar />
    </v-content>
  </v-app>
</template>

<script>
import Snackbar from '@/components/Snackbar/Snackbar.vue'
import { contactEmail, exceptions, userActions } from '@/data/constants'
import Service from '@/services/Service'

export default {
  name: 'App',
  components: { Snackbar },
  data () {
    return {
      contactEmail
    }
  },
  mounted () {
    window.onblur = this.handleWindowBlur
    window.onfocus = this.handleWindowFocus
  },
  methods: {
    handleWindowBlur () {
      if (this.isActiveSession()) {
        this.$store.commit('setUserAction', userActions.blurTab)
      }
    },
    handleWindowFocus () {
      if (this.isActiveSession()) {
        this.$store.commit('setUserAction', userActions.focusTab)
        this.requestClientCheck()
      }
    },
    isActiveSession () {
      return this.$store.getters.jobUserId !== ''
    },
    async requestClientCheck () {
      try {
        const clientCheckResult = await Service.checkClient({
          jobUserId: this.$store.getters.jobUserId,
          clientUUID: this.$store.getters.clientUUID
        })
        this.handleClientValidity(clientCheckResult.data.validClient)
      } catch (error) {
        this.handleError(exceptions.FetchDataException, error)
      }
    },
    handleClientValidity (validClient) {
      if (!validClient) {
        this.$router.push({
          name: 'InitSession',
          params: {
            workerId: this.$store.getters.workerId,
            campaignId: this.$store.getters.campaignId
          }
        })
      }
    }
  }
}
</script>

<style>
.error-message {
  color: rgb(202, 60, 60) !important; /* this is a maroon */
}

.hidden {
  position: absolute !important;
  top: -9999px !important;
  left: -9999px !important;
}
</style>
