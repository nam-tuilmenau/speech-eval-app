/* globals createjs */
import { exceptions } from '@/data/constants'

export default {
  name: 'AudioSequence',
  props: {
    audiosInfo: {
      type: Array,
      required: true
    },
    playControl: {
      type: Boolean,
      default: true
    },
    canReplay: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    currentInstance: function () {
      return this.instances[this.currentAudioIndex]
    },
    enoughAudios: function () {
      return this.audiosInfo.length > 0
    }
  },
  mounted () {
    this.playButton = this.$el.querySelector('.play-button')
    this.preparedAudios()
  },
  data () {
    return {
      playing: false,
      instances: [],
      currentAudioIndex: -1,
      accumulatedTime: 0,
      numberOfReproductions: 0
    }
  },
  watch: {
    playControl: function (newValue) {
      if (newValue) {
        this.enable()
      } else {
        this.disable()
      }
    },
    audiosInfo: function (newValue) {
      this.preparedAudios()
    }
  },
  methods: {
    preparedAudios () {
      if (this.enoughAudios) {
        try {
          this.instances = []
          for (const audioInfo of this.audiosInfo) {
            const instance = createjs.Sound.createInstance(audioInfo.id)
            instance.on('complete', this.handleAudioEnd)
            this.instances.push(instance)
          }
          this.currentAudioIndex = 0
          this.updateTime()
        } catch (error) {
          this.handleError(exceptions.Audio.PreparingException, error)
        }
      }
    },
    playPause () {
      if (this.currentInstance.playState === createjs.Sound.PLAY_SUCCEEDED &&
            this.currentInstance.paused === false) {
        this.pause()
      } else {
        this.play()
      }
    },
    play () {
      if (this.playControl) {
        this.playing = true
      }
      this.interval = setInterval(this.updateTime, 100)
      this.currentInstance.play()
      if (this.isFirstReproduction()) {
        this.$emit('first-playback')
      }
      this.numberOfReproductions++
    },
    isFirstReproduction () {
      return this.numberOfReproductions === 0
    },
    playNextInstance () {
      this.currentInstance.play()
    },
    pause () {
      this.currentInstance.paused = true
      clearInterval(this.interval)
      this.playing = false
    },
    end () {
      clearInterval(this.interval)
      this.currentAudioIndex = 0
      this.accumulatedTime = 0
      if (this.playControl) {
        this.playing = false
      }
      if (!this.canReplay) {
        this.disable()
      }
    },
    handleAudioEnd () {
      this.currentAudioIndex++
      if (this.currentAudioIndex < this.instances.length) {
        this.accumulatedTime += this.instances[this.currentAudioIndex - 1].duration
        this.playNextInstance()
      } else {
        this.end()
      }
    },
    disable () {
      this.playButton.disabled = true
    },
    enable () {
      this.playButton.disabled = false
    },
    getDuration () {
      const reducer = (accumulator, instance) => accumulator + instance.duration
      return this.instances.reduce(reducer, 0)
    },
    getCurrentTime () {
      return this.accumulatedTime + this.currentInstance.position
    },
    updateTime () {
      const tracktimeText = this.$el.querySelector('#tracktime')
      tracktimeText.innerHTML = `${this.millisecondsToMMSS(this.getCurrentTime())} / ${this.millisecondsToMMSS(this.getDuration())}`
    },
    addLeadingZeros (string) {
      const length = 2
      const pad = '0'
      return (new Array(length + 1).join(pad) + string).slice(-length)
    },
    millisecondsToMMSS (totalMilliseconds) {
      const totalSeconds = totalMilliseconds / 1000
      const minutes = parseInt(totalSeconds / 60)
      const seconds = parseInt(totalSeconds % 60)
      return `${this.addLeadingZeros(minutes)}:${this.addLeadingZeros(seconds)}`
    }
  }
}
