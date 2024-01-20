<template>
  <nav class="navbar">
    <div class="container">
      <a class="navbar-brand" href="#">ROBSONWAVES</a>
      <!-- Regroupez le nom d'utilisateur et les boutons dans un conteneur -->
      <div class="controls-container" v-if="store.isLoggedIn">
        <span class="navbar-username">Bienvenue, {{ userName }}</span>
        <button @click="backtolist" class="btn btn-warning logout-button">
          <i class="bi bi-box-arrow-right"></i> Retour aux applications
        </button>
        <button @click="logout" class="btn btn-danger logout-button">
          <i class="bi bi-box-arrow-right"></i> Déconnexion
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
import { store } from '../store';


export default {
  setup() {
    return { store };
  },
  props: {
    userName: String,
  },
  methods: {
    logout() {
      console.log("logout dans navbar")
      localStorage.removeItem("token");
      this.$emit("logout");
    },
    backtolist() {
      console.log("backtolist dans navbar")
      this.$emit("backtolist");
    }
  },
};
</script>

  
  <style scoped>
.navbar {
  background-color: #0d1117;
  border-bottom: 2px solid #58a6ff;
  padding: 1rem 0;
}
.navbar-brand {
  font-family: "Orbitron", sans-serif;
  color: #58a6ff;
  font-size: 1.5rem;
}

.logout-button {
  margin-left: auto; /* Pour aligner à droite dans la barre de navigation */
  color: white; /* Couleur du texte */
}

.navbar-username {
  color: #ffffff; /* Couleur blanche pour contraste */
  font-size: 1rem; /* Taille de la police ajustée */
  margin-right: 1rem; /* Espace à droite */
  font-weight: bold; /* Rendre le texte en gras */
  margin-right: 0.5rem;
}

/* Si votre .navbar utilise Flexbox */
.navbar .container {
  display: flex;
  justify-content: space-between; /* Espacement entre les éléments */
  align-items: center; /* Centrer les éléments verticalement */
}

/* Si vous voulez que le nom d'utilisateur soit aligné avec le bouton de déconnexion */
.navbar .container > * {
  display: flex;
  align-items: center;
}
/* Additional styling */

.controls-container {
  display: flex;
  align-items: center;
  gap: 0.5rem; /* Espacement entre les éléments */
}

</style>
  