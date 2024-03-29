<template>
  <div class="upload-container">
    <div v-if="isLoading" class="loader"></div> <!-- Afficher le spinner lors du chargement -->

    <div v-else> <!-- Masquer le formulaire et le bouton lors du chargement -->
      <div class="form-group">
        <label for="fileInput">Fichier:</label>
        <input type="file" id="fileInput" class="form-control-file" @change="handleFileChange">
      </div>
      <div class="form-group">
        <label for="pricePerkg">Prix de l'or par kg:</label>
        <input type="number" id="pricePerkg" class="form-control" v-model="pricePerkg" placeholder="Entrez le prix" @blur="validatePrice">
        <p v-if="priceError" class="error-message">Veuillez entrer le prix de l'or par kg.</p>
      </div>
      <button class="btn btn-success" @click="submitFile">Upload</button>
    </div>
  </div>
</template>

<script>
import axiosInstance from '../axiosConfig';
import { store } from '../store';

export default {
  setup() {
    return { store };
  },
  data() {
    return {
      selectedFile: null,
      pricePerkg: 0,
      priceError: false,
      isLoading: false, // Ajoutez cette propriété pour gérer l'affichage du spinner
    };
  },
  methods: {
    handleFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
    validatePrice() {
      this.priceError = !this.pricePerkg;
    },
    async submitFile() {
      if (!this.selectedFile || !this.pricePerkg) {
        this.priceError = true;
        alert("Veuillez sélectionner un fichier et saisir le prix par kg.");
        return;
      }
      this.priceError = false;
      this.isLoading = true; // Début du chargement

      let formData = new FormData();
      formData.append('file', this.selectedFile);

      const token = localStorage.getItem('token');
      if (!token) {
        console.error("Aucun jeton d'authentification trouvé");
        this.isLoading = false; // Arrêt du chargement en cas d'erreur
        return;
      }

      try {
        const url = `${this.$apiUrl}/gold_file_converter?price_per_kg=${encodeURIComponent(this.pricePerkg)}`;
        const response = await axiosInstance.post(url, formData, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          responseType: 'blob',
        });

        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement('a');
        fileLink.href = fileURL;
        fileLink.setAttribute('download', 'fichier_resultat.xlsx');
        document.body.appendChild(fileLink);
        
        fileLink.click();
        fileLink.remove();
      } catch (error) {
        console.error("Erreur lors de l'envoi du fichier :", error);
        this.loginError = error.response.data.detail || "Une erreur est survenue";
      } finally {
        this.isLoading = false; // Arrêt du chargement après la requête
      }
    }
  }
};
</script>

<style scoped>
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
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}
</style>
