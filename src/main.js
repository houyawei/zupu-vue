import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import echarts from 'echarts'
import $http from './axios/index.js'


Vue.config.productionTip = false;
Vue.prototype.$echarts = echarts;
Vue.prototype.$http = $http;


new Vue({
  render: h => h(App),
}).$mount('#app');
