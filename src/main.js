import Vue from 'vue'
import App from './App'
import router from './router'
import FastClick from 'fastclick'
// import util from '@/utils/util'
import Bus from '@/utils/Bus'
import Toast from '@/components/App/Toast'
import Dialog from '@/components/App/Dialog'
import {Button} from 'martin-ui'
import '@/assets/css/common.less'
// import '@/assets/css/resource.less'
import '@/assets/font/iconfont.css'

FastClick.attach(document.body)

Vue.use(Toast)
Vue.use(Button)
Vue.use(Dialog)
Vue.use(Bus)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
