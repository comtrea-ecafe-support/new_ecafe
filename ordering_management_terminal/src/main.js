import Vue from 'vue';
import router from './router';
import App from './App.vue';
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import './assets/index.less';
import { locale, Page } from 'view-design';
import lang from 'view-design/dist/locale/en-US';


Vue.use(ViewUI);
Vue.config.productionTip = false;
// configure language
locale(lang);

// import components
Vue.component('Page', Page);
new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
