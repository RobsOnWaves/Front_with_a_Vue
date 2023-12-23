<template>
  <div>
    <!-- Affichez un message d'erreur si loginError n'est pas vide -->
    <p v-if="loginError" class="error">{{ loginError }}</p>

    <form @submit.prevent="login_mod">
      <input type="t  ext" v-model="username" placeholder="Nom d'utilisateur" required>
      <input type="password" v-model="password" placeholder="Mot de passe" required>
      <button type="submit">Connexion</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'; // Importation d'axios

export default {
  data() {
    return {
      username: '',
      password: '',
      loginError: '' // Ajouter une propriété pour stocker les messages d'erreur
    };
  },
  methods: {
    login_mod() {
        // Création d'une instance FormData pour envoyer les données sous la forme application/x-www-form-urlencoded
      let formData = new FormData();
      formData.append('username', this.username);
      formData.append('password', this.password);
      formData.append('client_id', "");
      formData.append('client_secret', "");
      axios.post('http://localhost:8002/token', formData)
    .then(response => {
      const token = response.data.access_token;
      console.log('Token:', token);
      localStorage.setItem('token', token);
      this.$emit('login-success', token);
    })
      .catch(error => {
  console.error('Error:', error);
  this.loginError = "Échec de la connexion. Veuillez vérifier vos identifiants et réessayer.";
  this.$emit('login-error'); // Émettre l'événement d'erreur de connexion
});

    }
  }
};
</script>

<style scoped>
.error {
  color: red;
}
</style>
