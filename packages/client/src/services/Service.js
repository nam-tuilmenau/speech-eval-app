import Api from '@/services/Api'

export default {
  addDemographicInfo (params) {
    return Api().post('demographic_infos', params)
  },
  postWorker (params) {
    return Api().post('users', params)
  },
  updateUser (params) {
    return Api().post('update_user', params)
  },
  postDigitTestAnswers (params) {
    return Api().post('digit_test_questions_user', params)
  },
  fetchAudios () {
    return Api().get('audios')
  },
  postMathQuestionAnswer (params) {
    return Api().post('math_question_user', params)
  },
  postGoldStandardAnswer (params) {
    return Api().post('gold_standard_user', params)
  },
  postTrappingQuestion (params) {
    return Api().post('trapping_question_user', params)
  },
  postAudioUserRating (params) {
    return Api().post('audio_rating_user', params)
  },
  postComparisonCategoryRatingUser (params) {
    return Api().post('comparison_category_rating_user', params)
  },
  postDegradationCategoryRatingUser (params) {
    return Api().post('degradation_category_rating_user', params)
  },
  postComparisonGoldStandardUser  (params) {
    return Api().post('comparison_gold_standard_user', params)
  },
  postListeningComparison (params) {
    return Api().post('audio_comparison', params)
  },
  fetchConfig () {
    return Api().get('config')
  },
  fetchAdminConfig () {
    return Api().get('admin_config')
  },
  finish (params) {
    return Api().post('finish', params)
  },
  fetchLastUserSessions (params) {
    return Api().get('last_job_users', { params })
  },
  closeSession () {
    Api().post('close_session')
  },
  checkClient (params) {
    return Api().post('check_client', params)
  },
  determineStartUrl (params) {
    return Api().post('start_url', params)
  }
}
