import Vue from 'vue'
import Vuex from 'vuex'
import common from './modules'
import getters from './modules/getters.js'
import develop from './modules/develop.js'
import consultation from './modules/consultation.js'
import activity from './modules/activity.js'
import handover from './modules/handover.js'
import baiduCode from './modules/baiduCode.js'


Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    common,
    develop,
    consultation,
    activity,
    handover,
    baiduCode
  },
  getters
})
