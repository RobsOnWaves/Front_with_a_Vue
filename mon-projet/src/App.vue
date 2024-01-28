<template>
  <div id="app" class="app-background">
    <Navbar @logout="handleLogout" :is-logged-in="store.isLoggedIn" :userName="userName" @backtolist="showAllApps"/>
    <div class="container main-content">
      <Login_mod v-if="!store.isLoggedIn" @login-success="handleLogin" @login-error="handleLoginError" />
      <RoleBasedModule v-if="store.isLoggedIn && showApp == ''" :userRole="userRole" @navigate-to-fileupload="showFileUploadComponent"  @navigate-to-admin="showAdminComponent" @navigate-to-democracy="showDemocracyComponent" />
      <FileUpload v-if="store.isLoggedIn && showApp == 'file-upload'" />
      <Admin v-if="store.isLoggedIn && showApp == 'admin-page'" />
      <Democracy v-if="store.isLoggedIn && showApp == 'democracy-page' "/>
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar_mod.vue';
import Login_mod from './components/Login_mod.vue';
import FileUpload from './components/FileUpload.vue';
import RoleBasedModule from './components/RoleBasedModule.vue';
import Admin from './components/Admin_mod.vue';
import Democracy from './components/Democracy_mod.vue';
import { store } from './store';

export default {
  setup() {
    return { store };
  },
  components: {
    Navbar,
    Login_mod,
    FileUpload,
    RoleBasedModule,
    Admin,
    Democracy
  },
  data() {
    return {
      token: '',
      userName: '',
      userRole: '',
      showApp: ''
    };
  },
  methods: {
    
    handleLogin(token, userName, userRole) {
      store.isLoggedIn = true;
      this.token = token;
      this.userName = userName;
      this.userRole = userRole;
      console.log('role', userRole)
    },

    handleLoginError() {
      store.isLoggedIn = false;
      // Vous pouvez également réinitialiser le token ou afficher un message d'erreur ici si vous le souhaitez
      this.token = '';
      this.userName = '';
      this.userRole = '';
      // Optionnel: afficher un message d'erreur ou ouvrir un dialogue/modal d'erreur
    },
    handleLogout() {
      store.isLoggedIn = false,
      this.token = '',
      this.userName = '',
      this.userRole = '',
      this.showApp = ''
      // Ici, vous pouvez également effectuer d'autres actions nécessaires après la déconnexion
    },

    showFileUploadComponent() {
      this.showApp = 'file-upload'; 
    },
    showAdminComponent() {
      this.showApp = 'admin-page';
    },
    showDemocracyComponent() {
      this.showApp = 'democracy-page';
    },
    showAllApps() {
      console.log("backtolist dans show")
      this.showApp = '';
    }
  }
};
</script>
@import 'vue-select/dist/vue-select.css';
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
  background: url('../images/background.jpg') no-repeat center center fixed;
  background-size: cover;
  min-height: 100vh; /* Hauteur minimale de la vue entière */
}

.main-content {
  flex: 1;
  padding: 2rem;
}


.buttons-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px; /* Ajoutez un peu d'espace entre les éléments */
}

.button-group-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 20px; /* Cela ajoutera de l'espace entre les groupes de boutons */
}

.button-with-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center; 
}

.word-cloud-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7); /* Ajoute un fond blanc semi-transparent */
  border-radius: 10px; /* Bords arrondis */
  padding: 20px; /* Espacement autour du nuage de mots */
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
}

.filter-title {
  text-align: center; /* Centrer le titre */
  color: #fff; /* Couleur du texte du titre */
  margin-bottom: 15px; /* Espace sous le titre */
  padding: 10px; /* Espace intérieur pour le titre */
  background-color: #6c757d; /* Couleur de fond pour le titre */
  border-radius: 5px; /* Bords arrondis pour le titre */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Ombre pour le titre */
  text-transform: uppercase; /* Texte en majuscules */
  font-size: 1.2rem; /* Taille de la police */
}

.h1-title {
  text-align: center; /* Centrer le titre */
  color: #fff; /* Couleur du texte du titre */
  margin-bottom: 15px; /* Espace sous le titre */
  padding: 10px; /* Espace intérieur pour le titre */
  background-color: #6c707d; /* Couleur de fond pour le titre */
  border-radius: 5px; /* Bords arrondis pour le titre */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Ombre pour le titre */
  text-transform: uppercase; /* Texte en majuscules */
  font-size: 1.4rem; /* Taille de la police */
}


.request-section {
  background-color: rgba(
    114,
    114,
    114,
    0.9
  ); /* Un arrière-plan légèrement différent */
  border: 1px solid #717171; /* Une bordure subtile */
  padding: 20px; /* Un peu d'espace à l'intérieur */
  margin-top: 20px; /* Espace au-dessus de la section */
  border-radius: 10px; /* Bords arrondis */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Ombre légère pour un effet de profondeur */
}

.sub-section {
  background-color: rgba(
    99,
    99,
    99,
    0.9
  ); /* Un arrière-plan légèrement différent */
  border: 1px solid #717171; /* Une bordure subtile */
  padding: 20px; /* Un peu d'espace à l'intérieur */
  margin-top: 20px; /* Espace au-dessus de la section */
  border-radius: 10px; /* Bords arrondis */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Ombre légère pour un effet de profondeur */
}

.error-message {
  color: #dc3545; /* Rouge pour les erreurs */
  background-color: rgba(220, 53, 69, 0.7);
  text-shadow: 0 0 3px #000;
  padding: 10px;
  border-radius: 5px;
}

.success-message {
  color: #28a745; /* Vert pour les succès */
  background-color: rgba(40, 167, 69, 0.7);
  text-shadow: 0 0 3px #000;
  padding: 10px;
  border-radius: 5px;
}

.form-control,
.v-select {
  background-color: rgba(255, 255, 255, 0.7);
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.form-group,
.search-container,
.image-button-container,
.btn-success,
.form-control {
  margin-bottom: 10px; /* Espace uniforme entre les éléments */
}

.upload-container {
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  padding: 20px;
  width: fit-content;
  margin: auto;
  position: relative; /* Pour positionner correctement le spinner */
}

.form-group {
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
}

.form-control-file,
.form-control {
  text-shadow: 0 0 3px #000;
  border: 1px solid #fff;
  font-weight: bold;
  font-size: 1.1rem;
}

.btn-success {
  font-weight: bold;
  font-size: 1.1rem;
  text-shadow: 0 0 3px #000;
}

.error-message {
  color: red;
  margin-top: 5px;
}

.loader {
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.role-based-module {
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  padding: 20px;
  width: fit-content;
  margin: auto;
  display: flex; /* Définir le conteneur comme Flexbox */
  flex-direction: row;
  align-items: flex-start; /* Aligner les éléments enfants au début de l'axe transversal */
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  position: relative;
}

.image-button-container {
  display: flex;
  flex-direction: column; /* Organise les enfants en colonne */
  align-items: center; /* Centre les enfants horizontalement */
  margin-bottom: 10px;
  width: auto;
  
}

.image-button {
  background-size: contain; /* Ou 'cover' si vous voulez que l'image couvre toute la div */
  background-position: center;
  background-repeat: no-repeat;
  width: 200px; /* ou la largeur de votre choix */
  height: 200px; /* ou la hauteur de votre choix */
  position: relative;
  cursor: pointer;
  border-radius: 4px;
  overflow: hidden;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.image-button .button-text {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: transparent;
  background-color: rgba(0, 0, 0, 0);
  font-size: 16px;
  transition: color 0.3s ease, backdrop-filter 0.3s ease;
  backdrop-filter: blur(0px);
  border-radius: 4px;
}

.image-button:hover .button-text {
  color: white;
  backdrop-filter: blur(4px);
}

.message-container {
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 5px;
  text-shadow: 2px 2px 4px #000000;
  font-size: 1.5rem;
  letter-spacing: 0.1rem;
  width: fit-content;
  margin: auto;
  margin-top: 20px;
}

.image-container {
  background-image: url("../images/noapp.jpg"); /* Chemin de votre image pour 'No apps for you' */
  width: 200px; /* Largeur de l'image */
  height: 200px; /* Hauteur de l'image */
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  margin-top: 20px; /* Espace au-dessus du conteneur */
  background-size: cover; /* Assurez-vous que l'image couvre le conteneur */
  background-position: center; /* Centrez l'image de fond */
}

.overlay-text {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  opacity: 0; /* Le texte est complètement transparent par défaut */
  transition: opacity 0.3s ease; /* Transition pour l'opacité */
  z-index: 2; /* Assurez-vous que le texte est au-dessus de l'image de fond */
}

.image-container:hover .overlay-text {
  opacity: 1; /* Le texte devient visible au survol */
}
.filter-sub-title {
  width: 100%; /* Assurez-vous que la largeur du sous-texte correspond à celle du bouton */
  text-align: center; /* Centrer le texte */
  color: white; /* Couleur du sous-texte */
  margin-top: 5px;
  cursor: pointer;
}

.sub-text {
  width: 100%; /* Assurez-vous que la largeur du sous-texte correspond à celle du bouton */
  text-align: center; /* Centrer le texte */
  color: white; /* Couleur du sous-texte */
  margin-top: 5px;
  cursor: pointer;
  font-size: 1.5rem; /* Augmentez la taille de la police selon vos besoins */
  line-height: 1.4; /* Ajustez l'espacement des lignes pour une meilleure lisibilité */
  max-width: 100%; /* Assurez-vous que le sous-texte peut s'étendre jusqu'à 100% de la largeur de son conteneur */
  word-wrap: break-word;
  margin: 0 auto; /* Centrer le sous-texte */
  max-width: 90%; 
}

.search-container {
  background-color: rgba(
    255,
    255,
    255,
    0.9
  ); /* Fond blanc légèrement transparent */
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Ombre portée légère */
  margin-bottom: 20px; /* Espace en dessous du conteneur */
}

.v-select {
  border: 1px solid #ccc; /* Bordure pour v-select */
  border-radius: 4px; /* Arrondir les coins */
  padding: 5px; /* Espace intérieur */
  margin-bottom: 10px; /* Espace entre les composants v-select */
}

.v-select .vs__dropdown-toggle {
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
}

.v-select .vs__selected-options {
  padding-left: 10px; /* Espace à gauche des options sélectionnées */
}

.v-select .vs__actions {
  padding-right: 10px; /* Espace à droite des boutons d'action */
}

/* Additional global styles */
</style>