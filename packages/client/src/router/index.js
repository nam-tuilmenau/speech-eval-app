import Vue from 'vue'
import Router from 'vue-router'
import QualificationIntroduction from '@/components/QualificationIntroduction/QualificationIntroduction.vue'
import TrainingIntroduction from '@/components/TrainingIntroduction/TrainingIntroduction.vue'
import RatingIntroduction from '@/components/RatingIntroduction/RatingIntroduction.vue'
import Setup from '@/components/Setup/Setup.vue'
import RatingTask from '@/components/RatingTask/RatingTask.vue'
import DemographicInfo from '@/components/DemographicInfo/DemographicInfo.vue'
import InitSession from '@/components/InitSession/InitSession.vue'
import MessagePage from '@/components/MessagePage/MessagePage.vue'
import FinishJobPage from '@/components/FinishJobPage/FinishJobPage.vue'
import AudioPreloader from '@/components/AudioPreloader/AudioPreloader.vue'
import JobUsersAdmin from '@/components/Admin/JobUsersAdmin/JobUsersAdmin.vue'
import MetaBalancer from '@/components/MetaBalancer/MetaBalancer.vue'
import { exceptions } from '@/data/constants'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/:workerId/:campaignId',
      name: 'InitSession',
      component: InitSession,
      props: true
    },
    {
      path: '/:workerId/:campaignId/:urlJobId',
      name: 'InitJobSession',
      component: InitSession,
      props: true
    },
    {
      path: '/qualificationIntroduction',
      name: 'QualificationIntroduction',
      component: QualificationIntroduction
    },
    {
      path: '/qualificationQuestions',
      name: 'DemographicInfo',
      component: DemographicInfo
    },
    {
      path: '/trainingIntroduction',
      name: 'TrainingIntroduction',
      component: TrainingIntroduction
    },
    {
      path: '/Setup',
      name: 'Setup',
      component: Setup
    },
    {
      path: '/ratingTask',
      name: 'RatingTask',
      component: RatingTask,
      props: true
    },
    {
      path: '/ratingIntroduction',
      name: 'RatingIntroduction',
      component: RatingIntroduction
    },
    {
      path: '/message',
      name: 'MessagePage',
      component: MessagePage,
      props: true
    },
    {
      path: '/end',
      name: 'FinishJobPage',
      component: FinishJobPage,
      props: true
    },
    {
      path: '/preload',
      name: 'AudioPreloader',
      component: AudioPreloader,
      props: true
    },
    {
      path: '/jobUsersAdmin',
      name: 'JobUsersAdmin',
      component: JobUsersAdmin,
      props: true
    },
    {
      path: '/meta/assign/:workerId/:campaignId',
      name: 'MetaBalancer',
      component: MetaBalancer,
      props: true
    },
    {
      path: '/meta',
      name: 'MetaBalancer2',
      component: MetaBalancer,
      props: true
    },
    {
      path: '*',
      component: MessagePage,
      props: exceptions.InvalidUrlException
    }
  ]
})
