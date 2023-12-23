<template>
  <div id="app">
    <Login_mod v-if="!isLoggedIn" 
               @login-success="handleLogin" 
               @login-error="handleLoginError" />
    <FileUpload v-else :token="token" />
  </div>
</template>

<script>
import Login_mod from './Login_mod.vue';
import FileUpload from './components/FileUpload.vue';

export default {
  components: {
    Login_mod,
    FileUpload
  },
  data() {
    return {
      isLoggedIn: false,
      token: ''
    };
  },
  methods: {
    handleLogin(token) {
      this.isLoggedIn = true;
      this.token = token;
    },
    handleLoginError() {
      this.isLoggedIn = false;
      // Vous pouvez également réinitialiser le token ou afficher un message d'erreur ici si vous le souhaitez
      this.token = '';
      // Optionnel: afficher un message d'erreur ou ouvrir un dialogue/modal d'erreur
    }
  }
};
</script>
