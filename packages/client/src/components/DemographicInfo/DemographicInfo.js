import Service from '@/services/Service'
import { exceptions } from '@/data/constants'

const minAge = 15
const maxAge = 90
const lastTimePossibleAnswers = [
  'Less than one week ago',
  'One week ago',
  'More than one week ago',
  'Never'
]

export default {
  name: 'DemographicInfo',
  data () {
    return {
      valid: true,
      models: {
        gender: null,
        birthYear: '',
        countryOfOrigin: '',
        countryOfResidence: '',
        motherTongue: '',
        secondLanguage: '',
        deviceType: [],
        lastTimeSubjectiveTest: '',
        lastTimeAudioTest: '',
        involvedInSpeechCoding: '',
        selfListeningPerception: ''
      },
      formInfos: [
        {
          label: 'What is your gender?',
          name: 'gender',
          values: [ 'Female', 'Male', 'Other' ],
          rules: [
            v => !!v || 'Please select your gender.'
          ],
          type: 'radio'
        },
        {
          label: 'In what year were you born?',
          name: 'birthYear',
          min: new Date().getFullYear() - maxAge,
          max: new Date().getFullYear() - minAge,
          rules: [
            v => !!v || 'Please type your birth year.'
          ],
          type: 'number'
        },
        {
          label: 'In what country were you born?',
          name: 'countryOfOrigin',
          items: this.$store.getters.config.countries,
          itemTextKey: 'name',
          itemValueKey: 'code',
          rules: [
            v => !!v || 'Please select the country you were born in.'
          ],
          type: 'select'
        },
        {
          label: 'What is your country of residence?',
          name: 'countryOfResidence',
          items: this.$store.getters.config.countries,
          itemTextKey: 'name',
          itemValueKey: 'code',
          rules: [
            v => !!v || 'Please select the country you live in.'
          ],
          type: 'select'
        },
        {
          label: 'What is your mother tongue?',
          name: 'motherTongue',
          items: this.$store.getters.config.languages,
          itemTextKey: 'language',
          itemValueKey: 'language',
          rules: [
            v => !!v || 'Please select your mother tongue (native language).'
          ],
          type: 'select'
        },
        {
          label: 'What is your second language? (leave it blank if none)',
          name: 'secondLanguage',
          items: this.$store.getters.config.languages,
          itemTextKey: 'language',
          itemValueKey: 'language',
          type: 'select'
        },
        {
          label:
            'What type of listening devices do you have and are able to use now (select all that apply)?',
          name: 'deviceType',
          values: [
            'Laptop/desktop loudspeaker',
            'In-ear headphones',
            'Over-the-ear headphones'
          ],
          images: [
            '/static/img/pc_speaker.png',
            '/static/img/in_ear_headphones.png',
            '/static/img/over_ear_headphones.png'
          ],
          rules: [
            v => v.length > 0 || 'Please select the devices you have.'
          ],
          type: 'checkbox'
        },
        {
          label: 'When was the last time you participated in a subjective test?',
          name: 'lastTimeSubjectiveTest',
          values: lastTimePossibleAnswers,
          rules: [
            v => !!v || 'Please select one of the possible answers.'
          ],
          type: 'radio'
        },
        {
          label:
            'When was the last time you participated in an audio listening test?',
          name: 'lastTimeAudioTest',
          values: lastTimePossibleAnswers,
          rules: [
            v => !!v || 'Please select one of the possible answers.'
          ],
          type: 'radio'
        },
        {
          label:
            'Have you ever been directly involved in work connected with assessment of the performance of telephone circuits, or related work such as speech coding?',
          name: 'involvedInSpeechCoding',
          values: [ 'Yes', 'No' ],
          rules: [
            v => !!v || 'Please whether you have been involved in the mentioned situations.'
          ],
          type: 'radio'
        },
        {
          label: 'I believe, …',
          name: 'selfListeningPerception',
          values: [
            'I have a normal hearing ability.',
            'I have difficulties keeping up with conversations, especially in noisy surroundings (mild hearing loss).',
            'I have difficulty keeping up with conversations when I am not using a hearing aid (moderate hearing loss).',
            'I rely on lip-reading even when I am using hearing aids (severe or profound hearing loss).'
          ],
          rules: [
            v => !!v || 'Please select one of the possible answers.'
          ],
          type: 'radio'
        }
      ]
    }
  },
  mounted () {
    const demographicData = this.$store.getters.demographicData
    if (demographicData) {
      this.models = demographicData
    }
  },
  methods: {
    validate () {
      if (this.$refs.form.validate()) {
        this.addDemographicInfo()
      }
    },
    async addDemographicInfo () {
      try {
        const yesValue = 1
        const involvedInSpeechCoding = this.models.involvedInSpeechCoding === yesValue
        const demographicInfo = {
          gender: this.models.gender,
          birthYear: this.models.birthYear,
          countryOfOrigin: this.models.countryOfOrigin,
          countryOfResidence: this.models.countryOfResidence,
          motherTongue: this.models.motherTongue,
          secondLanguage: this.models.secondLanguage,
          deviceType: JSON.stringify(this.models.deviceType),
          lastTimeSubjectiveTest: this.models.lastTimeSubjectiveTest,
          lastTimeAudioTest: this.models.lastTimeAudioTest,
          involvedInSpeechCoding: involvedInSpeechCoding,
          selfListeningPerception: this.models.selfListeningPerception
        }
        await Service.addDemographicInfo(demographicInfo)
        this.$store.commit('setDemographicData', this.models)
        this.$router.push({
          name: 'Setup'
        })
      } catch (error) {
        this.handleError(exceptions.DemographicInfo.AddDemographicInfoException)
      }
    }
  }
}
