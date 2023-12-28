<template>
  <nav class="navbar">
    <div class="container">
      <a class="navbar-brand" href="#">ROBSONWAVES</a>
      <!-- Autres contenus de la barre de navigation -->
      <!-- Le bouton de déconnexion appelle la méthode logout lorsqu'il est cliqué -->
      <button v-if="isLoggedIn" @click="logout" class="btn btn-danger logout-button">
    <i class="bi bi-box-arrow-right"></i> Déconnexion
  </button>
    </div>
  </nav>
</template>
  
<script>
export default {
  props: {
    isLoggedIn: Boolean
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
  /* Additional styling */
  </style>
  