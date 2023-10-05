import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue';
import {router} from "@/helpers";
import {createPinia} from "pinia";
import {updateGlobalOptions} from "vue3-toastify";
import SvgIcon from "vue3-icon";
import directives from "./directives/";
import moment from "moment";
const app = createApp(App);

updateGlobalOptions({
    position: 'top-right',
    closeOnClick: true,
    pauseOnFocusLoss: false,
    autoClose: true,
    theme: 'dark',
    icon: true
});
app.use(createPinia());
app.use(router);
app.component("svg-icon", SvgIcon);

// register global directive
directives(app);

// config moment
moment.locale('fr');

app.mount('#app')
