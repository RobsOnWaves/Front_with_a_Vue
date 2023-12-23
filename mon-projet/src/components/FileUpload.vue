<template>
    <div>
      <div class="form-group">
        <input type="file" class="form-control-file" @change="handleFileChange">
      </div>
      <div class="form-group">
        <input type="number" class="form-control" v-model="pricePerKg" placeholder="Prix par Kg">
      </div>
      <button class="btn btn-success" @click="submitFile">Upload</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        selectedFile: null,
        pricePerKg: 0,
      };
    },
    methods: {
      handleFileChange(event) {
        this.selectedFile = event.target.files[0];
      },
      async submitFile() {
        if (!this.selectedFile || !this.pricePerKg) {
          alert("Veuillez sélectionner un fichier et saisir le prix par Kg.");
          return;
        }
  
        let formData = new FormData();
        formData.append('file', this.selectedFile);
  
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("Aucun jeton d'authentification trouvé");
          return;
        }
  
        try {
          const url = `${this.$apiUrl}/gold_file_converter?price_per_kg=${encodeURIComponent(this.pricePerKg)}`;
  
          const response = await axios.post(url, formData, {
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
        }
      }
    }
  };
  </script>
  
  <style>
  /* Ajoutez ici du style personnalisé si nécessaire */
  </style>
  