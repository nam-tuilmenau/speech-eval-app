import Audio from '@/components/Audio/Audio.vue'

export default {
  components: {
    Audio
  },
  name: 'ListeningCallibration',
  data () {
    return {
      id: ''
    }
  },
  computed: {
    readyToPlay: function () {
      return this.id !== ''
    }
  },
  methods: {
    prepareTest: function (audioId) {
      this.id = audioId
    }
  }
}
