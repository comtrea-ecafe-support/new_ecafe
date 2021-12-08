
import Vue from 'vue'
import App from './App'
import VueRouter from "vue-router"

import Goods from './components/goods/Goods';
import patient_goods from './components/patient_goods/Goods';
import order from './components/OrderConfirm';
import Ratings from "./components/ratings/Ratings"
import Seller from "./components/seller/Seller"
import login from "./components/login"
import register from "./components/register"
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.config.productionTip = false

Vue.use(VueRouter)

Vue.use(Vant);
const routes = [
  {path: "/", redirect: "/login"},
  {path: "/login", component: login},
  {path: "/register", component: register},
  {path: "/order", component: order},
  {path: "/goods", component: Goods},
  {path: "/patient_goods", component: patient_goods},
  {path: "/ratings", component: Ratings},
  {path: "/seller", component: Seller}
]

const router = new VueRouter({
  routes,
  mode:"history",
  linkActiveClass:"active"
})

new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
