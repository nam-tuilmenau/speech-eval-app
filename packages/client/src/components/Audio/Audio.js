/* globals createjs */
import 'path'
import { exceptions } from '@/data/constants'

export default {
  name: 'Audio',
  props: {
    id: {
      type: String,
      required: true
    },
    playControl: {
      type: Boolean,
      default: true
    },
    canReplay: {
      type: Boolean,
      default: true
    },
    title: {
      type: String
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
    id: function () {
      this.prepareAudioInstance()
    }
  },
  mounted () {
    this.playButton = this.$el.querySelector('.play-button')
    if (this.id) {
      this.prepareAudioInstance()
    }
  },
  data () {
    return {
      playing: false,
      numberOfReproductions: 0
    }
  },
  methods: {
    prepareAudioInstance () {
      try {
        this.instance = createjs.Sound.createInstance(this.id)
        this.instance.on('complete', this.end)
        this.updateTime()
      } catch (error) {
        this.handleError(exceptions.Audio.PreparingException, error)
      }
    },
    focusPlayBtn () {
      this.$refs.playBtn.$el.focus()
    },
    playPause () {
      if (this.instance.playState === createjs.Sound.PLAY_SUCCEEDED &&
            this.instance.paused === false) {
        this.pause()
      } else {
        this.play()
      }
    },
    beforePlay () {
      if (this.playControl) {
        this.playing = true
      }
      this.interval = setInterval(this.updateTime, 100)
    },
    play () {
      this.beforePlay()
      this.instance.play()
      if (this.isFirstReproduction()) {
        this.$emit('first-playback')
      }
      this.numberOfReproductions++
    },
    isFirstReproduction () {
      return this.numberOfReproductions === 0
    },
    pause () {
      this.instance.paused = true
      clearInterval(this.interval)
      this.playing = false
    },
    end () {
      this.$emit('playback-finished')
      clearInterval(this.interval)
      if (this.playControl) {
        this.playing = false
      }
      if (!this.canReplay) {
        this.disable()
      }
    },
    disable () {
      this.playButton.disabled = true
    },
    enable () {
      this.playButton.disabled = false
    },
    getDuration () {
      return this.instance.duration
    },
    getCurrentTime () {
      return this.instance.position
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
      const minutes = Math.round(totalSeconds / 60)
      const seconds = Math.round(totalSeconds % 60)
      return `${this.addLeadingZeros(minutes)}:${this.addLeadingZeros(seconds)}`
    }
  }
}
