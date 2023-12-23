<template>
  <div>
    <!-- Utiliser les alertes Bootstrap pour les messages d'erreur -->
    <div v-if="loginError" class="alert alert-danger">
      {{ loginError }}
    </div>

    <form @submit.prevent="login_mod">
      <!-- Champs de formulaire avec des styles Bootstrap -->
      <div class="form-group">
        <input type="text" class="form-control" v-model="username" placeholder="Nom d'utilisateur" required>
      </div>
      <div class="form-group">
        <input type="password" class="form-control" v-model="password" placeholder="Mot de passe" required>
      </div>
      <button type="submit" class="btn btn-primary">Connexion</button>
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
      axios.post(`${this.$apiUrl}/token`, formData)
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
