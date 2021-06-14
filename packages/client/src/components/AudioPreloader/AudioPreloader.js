import createjs from 'createjs'
import 'soundjs'
import { exceptions } from '@/data/constants'

export default {
  name: 'AudioPreloader',
  props: {
    audioInfos: {
      type: Array,
      default: () => []
    },
    audioRootPath: {
      type: String,
      default: '/static/audio/'
    }
  },
  computed: {
    audiosShouldBeLoaded: function () {
      return this.audioInfos.length > 0
    }
  },
  watch: {
    audioInfos: function () {
      this.loadAudios()
    }
  },
  data () {
    return {
      progress: 0
    }
  },
  mounted () {
    this.loadAudios()
  },
  methods: {
    handleComplete () {
      this.$emit('complete')
    },
    handleAudioLoad () {
      this.loadedAudios++
      this.progress = (this.loadedAudios / this.audioInfos.length) * 100
    },
    loadAudios () {
      if (this.audiosShouldBeLoaded) {
        try {
          createjs.Sound.removeAllSounds()
          this.loadedAudios = 0
          const queue = new createjs.LoadQueue()
          createjs.Sound.alternateExtensions = [ 'mp3' ]
          queue.installPlugin(createjs.Sound)
          queue.on('complete', this.handleComplete)
          queue.on('fileload', this.handleAudioLoad)
          queue.on('error', this.handleLoadingError)
          queue.loadManifest({
            manifest: this.audioInfos,
            path: this.audioRootPath
          })
        } catch (error) {
          this.handleLoadingError(error)
        }
      }
    },
    handleLoadingError (error) {
      this.handleError(exceptions.AudioPreloader.LoadingException, error)
    }
  }
}
