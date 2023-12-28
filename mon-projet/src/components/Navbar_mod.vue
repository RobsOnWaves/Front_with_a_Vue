<template>
  <nav class="navbar">
    <div class="container">
      <a class="navbar-brand" href="#">ROBSONWAVES</a>
      <!-- Autres contenus de la barre de navigation -->
      <!-- Le bouton de déconnexion appelle la méthode logout lorsqu'il est cliqué -->
      <span v-if="isLoggedIn" class="navbar-username"> Bienvenue {{ userName }}</span>   
      <button v-if="isLoggedIn" @click="logout" class="btn btn-danger logout-button">
    <i class="bi bi-box-arrow-right"></i> Déconnexion
  </button>
    </div>
  </nav>
</template>
  
<script>
export default {
  props: {
    isLoggedIn: Boolean,
    userName: String
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.$emit('logout');
    }
  }
};
</script>

  
  <style scoped>
  .navbar {
    background-color: #0d1117;
    border-bottom: 2px solid #58a6ff;
    padding: 1rem 0;
  }
  .navbar-brand {
    font-family: 'Orbitron', sans-serif;
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
  </style>
  