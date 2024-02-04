<template>
  <div class="upload-container">
    <div v-if="isLoading" class="loader"></div>
    <!-- Afficher le spinner lors du chargement -->

    <div v-else>
      <div class="form-outer-container">
        <div class="user-creation-container">
          <!-- Masquer le formulaire et le bouton lors du chargement -->
          <div class="form-group file-input-container">
            <label for="file">Fichier:</label>
            <input
              type="file"
              id="fileInput"
              ref="file"
              @change="handleFileChange"
              class="file-input"
            />

           <label for="file" class="file-input-label">
              <span>{{ fileName }}</span>
              <span class="file-input-btn">Choisir un fichier</span>
            </label>
          </div>
          <button type="button" @click="submitFile" class="upload-btn">
            Upload
          </button>
        </div>
      </div>
      <div class="form-outer-container">
        <div class="user-creation-container">
          <h2 class="form-title">Create New User</h2>
          <form @submit.prevent="submitForm" class="user-creation-form">
            <div class="form-group">
              <label for="user_name">User Name:</label>
              <input
                type="text"
                id="user_name"
                v-model="form.user_name"
                required
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="email">Email:</label>
              <input
                type="email"
                id="email"
                v-model="form.email"
                required
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="full_name">Full Name:</label>
              <input
                type="text"
                id="full_name"
                v-model="form.full_name"
                required
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="password">Password:</label>
              <input
                type="password"
                id="password"
                v-model="form.password"
                required
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="role">Role:</label>
              <select
                id="role"
                v-model="form.role"
                required
                class="form-select"
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="gold_digger">Gold Digger</option>
                <option value="meps">MEPs</option>
              </select>
            </div>
            <button type="submit" class="submit-btn" @click="createUser">
              Create User
            </button>
          </form>
        </div>
      </div>
    </div>
    <!-- Afficher la réponse JSON ici -->
    <div v-if="responseContent" class="response-container">
      <h3>Réponse du serveur:</h3>
      <ul>
        <li v-for="(value, key) in responseContent" :key="key">
          {{ value }}
        </li>
      </ul>
    </div>
  </div>
</template>


<script>
import axiosInstance from "../axiosConfig";
import { store } from "../store";

export default {
  setup() {
    return { store };
  },
  data() {
    return {
      selectedFile: null,
      isLoading: false,
      responseContent: null,
      form: {
        user_name: "",
        email: "",
        full_name: "",
        password: "",
        role: "user", // Default role, change as needed
      },
    };
  },
  methods: {
    async createUser() {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Aucun jeton d'authentification trouvé");
        this.isLoading = false; // Arrêt du chargement en cas d'erreur
        return;
      }

      try {
        const response = await axiosInstance.post(
          `${this.$apiUrl}/create_user`,
          this.form,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Accept: "application/json",
              // Include the Authorization header with the Bearer token
              // Ideally, the token should not be hardcoded but retrieved from a secure storage or state management
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        alert("User created successfully");
      } catch (error) {
        console.error("Error creating user:", error);
        alert("Error creating user");
      }
    },
    handleFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
    async submitFile() {
      if (!this.selectedFile) {
        alert("Veuillez sélectionner un fichier");
        return;
      }
      this.isLoading = true; // Début du chargement

      let formData = new FormData();
      formData.append("file", this.selectedFile);

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Aucun jeton d'authentification trouvé");
        this.isLoading = false; // Arrêt du chargement en cas d'erreur
        return;
      }

      try {
        const url = `${this.$apiUrl}/meps_file`;
        const response = await axiosInstance.post(url, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "json",
        });

        this.responseContent = response.data; // Mise à jour avec la réponse JSON
      } catch (error) {
        console.error("Erreur lors de l'envoi du fichier :", error);
        this.responseContent =
          error.response.data.detail || "Une erreur est survenue";
      } finally {
        this.isLoading = false; // Arrêt du chargement après la requête
      }
    },
  },
};
</script>
<style scoped>
.form-outer-container {
  display: flex;
  justify-content: center;
  padding: 40px;
  background-color: #e8e8e8; /* Light grey background for less contrast */
}

.user-creation-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background: linear-gradient(
    to bottom,
    #ffffff 0%,
    #f6f6f6 100%
  ); /* Subtle gradient background */
  border: 1px solid #d1d1d1; /* Light border for depth */
}

.form-title {
  margin-bottom: 20px;
  text-align: center;
  color: #5a5a5a; /* Softer color for the title text */
}
.user-creation-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #666;
}
.form-control,
.form-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  background-color: #f8f8f8; /* Light background for input fields */
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1); /* Inner shadow for depth */
  color: #333;
}

.submit-btn {
  padding: 10px 15px;
  color: #fff;
  background-color: #0056b3; /* Changed to a more subdued button color */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #003d82; /* Darker shade on hover for the button */
}
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
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.response-container {
  background-color: rgba(
    255,
    255,
    255,
    0.8
  ); /* Fond clair avec une légère transparence */
  border: 1px solid #ddd; /* Bordure subtile */
  border-radius: 5px; /* Coins arrondis */
  padding: 10px; /* Espacement interne */
  margin-top: 10px; /* Marge au-dessus du container */
  color: #333; /* Couleur de texte foncée pour un contraste élevé */
  font-size: 0.9rem; /* Taille de la police ajustée */
  overflow-x: auto; /* Permettre le défilement horizontal si nécessaire */
}

.file-input-container {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #ccc;
  padding: 8px 12px;
}

.file-input {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
}

.file-input-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  cursor: pointer;
}

.file-input-label .file-input-btn {
  background-color: #4caf50; /* Green background for the button */
  padding: 8px 16px;
  color: white;
  border-radius: 4px;
  margin-left: 8px;
}

.upload-btn {
  background-color: #007bff; /* Blue background for the upload button */
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 8px; /* Spacing between file input and upload button */
  width: 100%; /* Full-width button */
}
</style>
