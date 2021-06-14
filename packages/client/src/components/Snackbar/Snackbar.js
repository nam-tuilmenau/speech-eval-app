import { mapState } from 'vuex'

export default {
  name: 'Snackbar',
  data () {
    return {
      multiline: true
    }
  },
  computed: {
    ...mapState([ 'notification' ])
  }
}
