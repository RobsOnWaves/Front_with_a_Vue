<template>
  <div class="login-container d-flex flex-column justify-content-center align-items-center">    <!-- Utiliser les alertes Bootstrap pour les messages d'erreur -->
    <div v-if="loginError" class="alert alert-danger">
      {{ loginError }}
    </div>

    <form @submit.prevent="login_mod" class="login-form">
      <!-- Champs de formulaire avec des styles Bootstrap et personnalisés -->
      <div class="form-group">
        <input type="text" class="form-control" v-model="username" placeholder="Nom d'utilisateur" required>
      </div>
      <div class="form-group">
        <input type="password" class="form-control" v-model="password" placeholder="Mot de passe" required>
      </div>
      <div class="mt-auto w-100 text-center">
        <button type="submit" class="btn btn-primary">Connexion</button>
      </div>
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
.login-container {
  background-color: rgba(0, 0, 0, 0.8); /* Fond sombre semi-transparent */
  border-radius: 10px;
  padding: 20px;
  width: fit-content;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%; /* Assurez-vous que le conteneur a une hauteur définie */

}

.login-form .form-group {
  margin-bottom: 15px;
  height: 100%; /* Assurez-vous que le formulaire remplit le conteneur */
}

.form-control {
  background-color: rgba(255, 255, 255, 0.7); /* Fond clair semi-transparent pour les champs */
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.alert-danger {
  background-color: rgba(220, 53, 69, 0.7);
}

/* Ajouter un style pour les messages d'erreur */
.error {
  color: #dc3545; /* Utilisez une couleur rouge pour les erreurs */
  text-shadow: 0 0 3px #000;
}
</style>

