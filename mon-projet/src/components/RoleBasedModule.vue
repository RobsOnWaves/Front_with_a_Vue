<template>
  <div class="role-based-module">
    <div v-if="userRole === 'admin' || userRole === 'gold_digger'" class="button-container">
      <button @click="goToFileUpload" class="upload-button">Go to File Upload</button>
    </div>
    <div v-else class="message-container">
      No apps for you
    </div>
  </div>
</template>

<script>
export default {
  props: {
    userRole: String
  },
  methods: {
    goToFileUpload() {
      this.$emit('navigate-to-fileupload');
    }
  },
  mounted() {
    console.log("UserRole:", this.userRole);
  }
}
</script>

<style scoped>
.role-based-module {
  text-align: center;
  margin-top: 20px;
}

.button-container, .message-container {
  margin: 10px 0;
}

.upload-button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.upload-button:hover {
  background-color: #45a049;
}

.message-container {
  color: white; /* Couleur du texte */
  background-color: rgba(0, 0, 0, 0.5); /* Arrière-plan semi-transparent */
  padding: 10px; /* Espacement autour du texte */
  border-radius: 5px; /* Bordures arrondies pour le fond */
  text-shadow: 2px 2px 4px #000000; /* Ombre portée pour le texte */
  font-size: 1.5rem; /* Taille de la police */
  letter-spacing: 0.1rem; /* Espacement des lettres */
  width: fit-content; /* S'adapte au contenu */
  margin: auto; /* Centrer dans le conteneur */
  margin-top: 20px; /* Ajustez l'espacement en haut si nécessaire */
}

</style>
