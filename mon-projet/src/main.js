import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ajout de cette ligne
import axios from './axiosConfig';

const app = createApp(App);
app.config.globalProperties.$apiUrl = process.env.VUE_APP_API_BASE_URL;
app.config.globalProperties.$axios = axios; // Ajoutez cette ligne

app.mount('#app');
