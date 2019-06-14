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

// if (module.hot) {
//   module.hot.accept('./i.js', (e, v) => {
//     console.log(e, v)
//   })
//   module.hot.dispose((data) => {
//     // data 用于传递数据，如果有需要传递的数据可以挂在 data 对象上，然后在模块代码更新后可以通过 module.hot.data 来获取
//     console.log(data)
//   })
// }

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
