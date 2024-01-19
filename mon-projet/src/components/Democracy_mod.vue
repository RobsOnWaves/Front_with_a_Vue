<template>
  <div class="role-based-module">
    <div v-if="isLoading" class="loader"></div>
    <div v-else>
      <div class="image-button-container">
        <div
          class="image-button"
          @click="getFile"
          :style="{ backgroundImage: 'url(' + mepLobbies + ')' }"
        >
          <span class="button-text">Rencontres MEPs/lobbies</span>
        </div>
        <div class="sub-text" @click="getFile">
          Récupérer le fichier de rencontres MEP avec lobbies
        </div>

        <div class="search-container">
          <div v-for="(options, key) in apiResponse" :key="key">
            <label :for="key">{{ key }}</label>
            <v-select
              :options="filteredOptions[key]"
              :reduce="(option) => option"
              label="name"
              @search="(searchEvent) => filterOptions(key, searchEvent)"
              v-model="selectedValues[key]"
            ></v-select>
          </div>
          <button @click="sendRequest">Send Request</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

export default {
  components: {
    'v-select': vSelect,
  },
  data() {
    return {
      isLoading: false, // Ajoutez cette propriété pour gérer l'affichage du spinner
      mepLobbies: require("../../images/MEP_files.png"),
      apiResponse: null,
      selectedValues: {},
      filteredOptions: {},
      searchQuery: {},
    };
  },
  methods: {
    async getFile() {
      this.isLoading = true; // Début du chargement
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Aucun jeton d'authentification trouvé");
        this.isLoading = false; // Arrêt du chargement en cas d'erreur
        return;
      }

      try {
        const url = `${this.$apiUrl}/meps_file`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        });

        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", "fichier_resultat.xlsx");
        document.body.appendChild(fileLink);

        fileLink.click();
        fileLink.remove();
      } catch (error) {
        console.error("Erreur lors de l'envoi du fichier :", error);
        this.loginError =
          error.response.data.detail || "Une erreur est survenue";
      } finally {
        this.isLoading = false; // Arrêt du chargement après la requête
      }
    },
    filterOptions(key, searchEvent = "") {
      const query = searchEvent.toLowerCase();
      this.filteredOptions[key] = this.apiResponse[key].filter((option) =>
        option.toLowerCase().includes(query)
      );
    },
    async fetchApiData() {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `${this.$apiUrl}/meps_file_fields_values`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        this.apiResponse = await response.json();
        this.initializeSelectedValues();
        this.initializeFilteredOptions();
        console.log(this.apiResponse);
        // You can handle the JSON response here as needed
      } catch (error) {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      }
    },
    async sendRequest() {
      const token = localStorage.getItem("token");
      const fieldMap = {
        "MEP Name": "mep_name",
        "MEP nationalPoliticalGroup": "national_political_group",
        "MEP politicalGroup": "political_group",
        Title: "title",
        Place: "place",
        "Meeting With": "meeting_with",
      };
      const queryParams = new URLSearchParams();

      // Construction des paramètres de requête à partir des valeurs sélectionnées
      for (const [key, value] of Object.entries(this.selectedValues)) {
        const apiField = fieldMap[key];
        if (value && apiField) {
          queryParams.append(apiField, value);
        }
      }

      try {
        const response = await fetch(
          `${this.$apiUrl}/meps_file?` + queryParams.toString(),
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        // Traiter la réponse en tant que Blob si c'est un fichier
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        // Créer un élément de lien pour le téléchargement
        const a = document.createElement("a");
        a.href = url;
        a.download = "downloaded_file"; // Nom du fichier à télécharger
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      } catch (error) {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      }
    },
    initializeSelectedValues() {
      const fieldMap = {
        "MEP Name": "mep_name",
        "MEP nationalPoliticalGroup": "national_political_group",
        "MEP politicalGroup": "political_group",
        Title: "title",
        Place: "place",
        "Meeting With": "meeting_with",
      };
      if (this.apiResponse && typeof this.apiResponse === "object") {
        Object.keys(this.apiResponse).forEach((key) => {
          if (fieldMap[key]) {
            this.selectedValues[key] = null;
          }
        });
      } else {
        console.error("apiResponse is null or not an object");
      }
    },
    initializeFilteredOptions() {
      const fieldMap = {
        "MEP Name": "mep_name",
        "MEP nationalPoliticalGroup": "national_political_group",
        "MEP politicalGroup": "political_group",
        Title: "title",
        Place: "place",
        "Meeting With": "meeting_with",
      };
      this.filteredOptions = {};
      Object.keys(this.apiResponse).forEach((key) => {
        if (fieldMap[key]) {
          this.filteredOptions[key] = []; // Ou une valeur par défaut appropriée
        }
      });
    },
  },
  async mounted() {
    await this.fetchApiData();

    this.searchQuery = {};
    for (const key in this.apiResponse) {
      this.searchQuery[key] = "";
      this.filterOptions(key); // Filtrez les options initiales
    }
  },
};
</script>
@import 'vue-select/dist/vue-select.css';
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
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.role-based-module {
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  padding: 20px;
  width: fit-content;
  margin: auto;
  display: flex; /* Définir le conteneur comme Flexbox */
  flex-direction: row;
  align-items: flex-start; /* Aligner les éléments enfants au début de l'axe transversal */
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  position: relative;
}

.image-button-container {
  display: flex;
  flex-direction: column; /* Organise les enfants en colonne */
  align-items: center; /* Centre les enfants horizontalement */
  margin-bottom: 10px;
  width: auto;
}

.image-button {
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

.image-container {
  background-image: url("../../images/noapp.png"); /* Chemin de votre image pour 'No apps for you' */
  width: 200px; /* Largeur de l'image */
  height: 200px; /* Hauteur de l'image */
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  margin-top: 20px; /* Espace au-dessus du conteneur */
  background-size: cover; /* Assurez-vous que l'image couvre le conteneur */
  background-position: center; /* Centrez l'image de fond */
}

.overlay-text {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  opacity: 0; /* Le texte est complètement transparent par défaut */
  transition: opacity 0.3s ease; /* Transition pour l'opacité */
  z-index: 2; /* Assurez-vous que le texte est au-dessus de l'image de fond */
}

.image-container:hover .overlay-text {
  opacity: 1; /* Le texte devient visible au survol */
}

.sub-text {
  width: 100%; /* Assurez-vous que la largeur du sous-texte correspond à celle du bouton */
  text-align: center; /* Centrer le texte */
  color: white; /* Couleur du sous-texte */
  margin-top: 5px;
  cursor: pointer;
}


.search-container {
  background-color: rgba(255, 255, 255, 0.9); /* Fond blanc légèrement transparent */
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Ombre portée légère */
  margin-bottom: 20px; /* Espace en dessous du conteneur */
}

.v-select {
  border: 1px solid #ccc; /* Bordure pour v-select */
  border-radius: 4px; /* Arrondir les coins */
  padding: 5px; /* Espace intérieur */
  margin-bottom: 10px; /* Espace entre les composants v-select */
}

.v-select .vs__dropdown-toggle {
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
}

.v-select .vs__selected-options {
  padding-left: 10px; /* Espace à gauche des options sélectionnées */
}

.v-select .vs__actions {
  padding-right: 10px; /* Espace à droite des boutons d'action */
}
</style>
