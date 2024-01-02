<template>
  <div class="role-based-module">
    <div v-if="userRole === 'admin' || userRole === 'gold_digger'" class="image-button-container">
      <div class="image-button" @click="goToFileUpload">
        <span class="button-text">Diggin' it !</span>
      </div>
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

.image-button-container {
  display: flex;
  justify-content: center;
}

.image-button {
  background-image: url('../../images/gold_digger.png'); /* Chemin de votre image */
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
</style>
