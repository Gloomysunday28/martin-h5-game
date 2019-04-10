import Vue from 'vue'
import Toast from './ToastHint'

const toastContain = new (Vue.extend(Toast))({
  el: document.createElement('div')
})

const showToast = (message) => {
  toastContain.show(message)
  document.body.appendChild(toastContain.$el)
}

export default {
  install(Vue) {
    Vue.prototype.$toast = showToast
  }
}
