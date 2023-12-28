<template>
  <div id="app" class="app-background">
    <Navbar />
    <div class="container main-content">
      <Login_mod v-if="!isLoggedIn" @login-success="handleLogin" @login-error="handleLoginError" />
      <FileUpload v-else :token="token" />
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar_mod.vue';
import Login_mod from './components/Login_mod.vue';
import FileUpload from './components/FileUpload.vue';

export default {
  components: {
    Navbar,
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
<style>

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  min-height: 100vh; /* Utilisez vh pour la hauteur de la vue */
  display: flex;
  flex-direction: column;
}

.app-background {
  background: url('../images/background.png') no-repeat center center fixed;
  background-size: cover;
  min-height: 100vh; /* Hauteur minimale de la vue entière */
}

.main-content {
  flex: 1;
  padding: 2rem;
}

/* Additional global styles */
</style>