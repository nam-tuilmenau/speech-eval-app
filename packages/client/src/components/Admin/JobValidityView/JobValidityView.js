export default {
  name: 'JobValidityView',
  props: {
    jobUser: {
      type: Object,
      required: true
    }
  },
  methods: {
    colorOfValidityTest (test) {
      return this.validityColor(this.isValidityTestValid(test))
    },
    verboseOfValidityTest (test) {
      const validityPercent = test.validity * 100
      return `${this.validityVerbose(this.isValidityTestValid(test))} (${validityPercent.toFixed(2)}%)`
    },
    isValidityTestValid (test) {
      return test.validity >= test.validityThreshold
    },
    nameOfValidityTest (test) {
      const testInfo = Object.values(this.$store.getters.config.audioTasks).find(task => task.id === test.id)
      return testInfo.name
    },
    colorOfJobUserValidity (jobUser) {
      return this.validityColor(this.isJobUserValid(jobUser))
    },
    verboseOfJobUserValidity (jobUser) {
      return this.validityVerbose(this.isJobUserValid(jobUser))
    },
    isJobUserValid (jobUser) {
      return jobUser.validity.valid === 1
    },
    validityColor (isValid) {
      return isValid ? 'green' : 'red'
    },
    validityVerbose (isValid) {
      return isValid ? 'Valid' : 'Invalid'
    }
  }
}
