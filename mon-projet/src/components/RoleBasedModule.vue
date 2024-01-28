<template>
  <div class="role-based-module">
    <div v-if="userRole === 'user'" class="image-container">
      <div class="overlay-text">No apps for you</div>
    </div>
    <div v-if="userRole === 'admin' || userRole === 'gold_digger'">
      <div class="image-button-container">
        <div class="image-button" @click="goToFileUpload" :style="{ backgroundImage: 'url(' + goldDiggerImage + ')' }">
          <span class="button-text">Diggin' it !</span>
        </div>
        <div class="sub-text" @click="goToFileUpload"> Traitement des fichiers de ventes d'or </div>
      </div>
    </div>
    <div v-if="userRole === 'admin'">
      <div class="image-button-container">
        <div class="image-button" @click="goToAdmin" :style="{ backgroundImage: 'url(' + adminImage + ')' }">
          <span class="button-text">Admin</span>
        </div>
        <div class="sub-text" @click="goToAdmin">Interface d'administration </div>
      </div>
    </div>
    <div v-if="userRole === 'admin' || userRole === 'meps'">
      <div class="image-button-container">
        <div class="image-button" @click="goToDemocracy" :style="{ backgroundImage: 'url(' + democracyImage + ')' }">
          <span class="button-text">Démocratie</span>
        </div>
        <div class="sub-text" @click="goToDemocracy"> Données d'intérêt démocratique </div>
      </div>
    </div>

  </div>
</template>



<script>



export default {
  data() {
    return {
      goldDiggerImage: require('../../images/gold_digger.jpg'),
      adminImage: require('../../images/admin.jpg'),
      democracyImage: require('../../images/democracy.jpg'),
      noAppImage: require('../../images/noapp.jpg'),
    };
  },
  props: {
    userRole: String
  },
  methods: {
    goToFileUpload() {
      this.$emit('navigate-to-fileupload');
    },
    goToAdmin() {
      this.$emit('navigate-to-admin');
    },
    goToDemocracy() {
      this.$emit('navigate-to-democracy');
    },
  },
  mounted() {
    console.log("UserRole:", this.userRole);
  }
}
</script>

<style scoped>

</style>
