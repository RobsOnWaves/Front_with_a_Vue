<template>
  <div id="app" class="app-background">
    <Navbar @logout="handleLogout" :is-logged-in="isLoggedIn" :userName="userName"/>
    <div class="container main-content">
      <Login_mod v-if="!isLoggedIn" @login-success="handleLogin" @login-error="handleLoginError" />
      <RoleBasedModule v-if="isLoggedIn && !showFileUpload" :userRole="userRole" @navigate-to-fileupload="showFileUploadComponent"  @navigate-to-admin="showAdminComponent"/>
      <FileUpload v-if="showFileUpload" />
      <Admin v-if="showAdmin" />
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar_mod.vue';
import Login_mod from './components/Login_mod.vue';
import FileUpload from './components/FileUpload.vue';
import RoleBasedModule from './components/RoleBasedModule.vue';
import Admin from './components/Admin_mod.vue';

export default {
  components: {
    Navbar,
    Login_mod,
    FileUpload,
    RoleBasedModule,
    Admin
  },
  data() {
    return {
      isLoggedIn: false,
      token: '',
      userName: '',
      userRole: '',
      showFileUpload: false,
      showAdmin: false
    };
  },
  methods: {
    
    handleLogin(token, userName, userRole) {
      this.isLoggedIn = true;
      this.token = token;
      this.userName = userName;
      this.userRole = userRole;
      console.log('role', userRole)
    },

    handleLoginError() {
      this.isLoggedIn = false;
      // Vous pouvez également réinitialiser le token ou afficher un message d'erreur ici si vous le souhaitez
      this.token = '';
      this.userName = '';
      this.userRole = '';
      // Optionnel: afficher un message d'erreur ou ouvrir un dialogue/modal d'erreur
    },
    handleLogout() {
      this.isLoggedIn = false;
      this.token = '';
      // Ici, vous pouvez également effectuer d'autres actions nécessaires après la déconnexion
    },

    showFileUploadComponent() {
      this.showFileUpload = true; // Mettre à jour showFileUpload pour afficher le composant FileUpload
    },
    showAdminComponent() {
      this.showAdmin = true; // Mettre à jour showFileUpload pour afficher le composant FileUpload
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