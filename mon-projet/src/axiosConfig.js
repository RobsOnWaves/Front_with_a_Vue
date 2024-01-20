// axiosConfig.js
import axios from 'axios';
import { store } from './store';

const axiosInstance = axios.create({
  // Votre configuration Axios
});

// axiosConfig.js
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.log('Intercepteur déclenché');
    if (error.response && error.response.status === 401) {
      // Gestion du code 401
      store.isLoggedIn = false;
      store.errorMessage.message = 'Votre session a expiré, veuillez vous reconnecter.';
      store.errorMessage.visible = true;
  
      setTimeout(() => {
        store.errorMessage.visible = false;
      }, 5000);
    } else {
      // Gestion des autres types d'erreurs
      console.error("Erreur non gérée :", error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
