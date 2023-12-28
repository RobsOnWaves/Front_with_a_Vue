<template>
  <div id="app" class="app-background">
    <Navbar @logout="handleLogout" :is-logged-in="isLoggedIn" :userName="userName"/>
    <div v-if="!isLoggedIn" class="container main-content">
      <Login_mod @login-success="handleLogin" @login-error="handleLoginError" />
    </div>
    <div v-else class="container main-content">
      <FileUpload :token="token" />
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
      token: '',
      userName: ''
    };
  },
  methods: {
    handleLogin(token, userName) {
      this.isLoggedIn = true;
      this.token = token;
      this.userName = userName;
    },
    handleLoginError() {
      this.isLoggedIn = false;
      this.token = '';
    },
    handleLogout() {
      this.isLoggedIn = false;
      this.token = '';
      // Ici, vous pouvez également effectuer d'autres actions nécessaires après la déconnexion
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
