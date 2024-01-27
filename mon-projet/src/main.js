import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ajout de cette ligne
import axios from './axiosConfig';
import VueWordCloud from 'vuewordcloud';
import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';
import VueGoodTablePlugin from 'vue-good-table';
import 'vue-good-table/dist/vue-good-table.css'

const app = createApp(App);

app.component('EasyDataTable', Vue3EasyDataTable);
app.config.globalProperties.$apiUrl = process.env.VUE_APP_API_BASE_URL;
app.config.globalProperties.$axios = axios; // Ajoutez cette ligne
app.component(VueWordCloud.name, VueWordCloud);
app.component('vue-good-table', VueGoodTablePlugin);


app.mount('#app');
