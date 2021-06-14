export default {
  name: 'MessagePage',
  props: {
    title: {
      type: String
    },
    message: {
      type: String
    },
    type: {
      type: String // error, info, warn
    }
  }
}
