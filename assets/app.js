import './css/app.css';
import "vue-select/dist/vue-select.css";
//import "bootstrap/dist/css/bootstrap.min.css";
//import "material-dashboard/assets/css/material-dashboard.css";
import Vue from 'vue';
import vuefrontend from './vue/vuefrontend2';
import vSelect from 'vue-select';
import infiniteScroll from "vue-infinite-scroll";
Vue.use(infiniteScroll);
//import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
//import 'bootstrap-vue/dist/bootstrap-vue.css'

//Vue.use(BootstrapVue)
//Vue.use(BootstrapVueIcons)
Vue.config.devtools = true
import axios from 'axios';
export const bus = new Vue();
import './img/logoumms.svg'
let params;
if (document.getElementById('params') !== null) {
    params = document.querySelector("div[data-params]").attributes['data-params'].value;
    //   console.log("Params?");
    params = JSON.parse(params);
    //   console.log(params);
}

if (document.getElementById('app') !== null) {
    let app = document.getElementById('app');
    new Vue({
        el: '#app',
        template: '<vuefrontend/>',
        components: {
            vuefrontend,
            vSelect,
            bus
        },
        data() {
            return {
                params: {},
            }
        },

        created() {
            console.log("Setting params here");
            this.params = params;
        }

    }).$mount(app)
}

console.log('Hello Webpack Encore! Edit me in assets/js/app.js');