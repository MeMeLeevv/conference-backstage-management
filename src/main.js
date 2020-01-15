
/* eslint-disable */
import 'normalize.css';
import './assets/font/iconfont.css';
import ElementUI from './element/index'
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/override-element-ui.css';
import Qs from 'qs';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';
import VueAxios from 'vue-axios'
import VueQuillEditor from 'vue-quill-editor'; // 需要首先加载vue

// require styles
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

Vue.use(VueQuillEditor);

Vue.config.productionTip = false;
Vue.use(ElementUI);

Vue.prototype.$axios = axios;

// 创建一个axios实例
var axios_instance = axios.create({
  // config里面有这个transformRquest，这个选项会在发送参数前进行处理。
  // 这时候我们通过Qs.stringify转换为表单查询参数
  transformRequest: [function (data) {
    data = Qs.stringify(data)
    return data
  }],
  // 设置Content-Type
  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  
})
Vue.use(VueAxios, axios_instance)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
