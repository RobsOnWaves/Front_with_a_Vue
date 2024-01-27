<template>
  <div class="role-based-module">
    <div v-if="isLoadingFile || isLoadingWords" class="loader"></div>
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
          Récupérer le fichier de toutes les rencontres enregistrées MEP avec
          lobbies
        </div>

        <div class="request-section">
          <h2 class="filter-title">Filtres de Recherche</h2>

          <div class="image-button-container">
            <div v-for="(options, key) in apiResponse" :key="key">
              <label :for="key" class="sub-text">{{ key }}</label>
              <input
                v-if="
                  [
                    'Title',
                    'Meeting With',
                    'Meeting Related to Procedure',
                  ].includes(key)
                "
                type="text"
                v-model="selectedValues[key]"
                class="form-control"
                :id="key"
              />

              <v-select
                v-else
                :options="filteredOptions[key]"
                :reduce="(option) => option"
                label="name"
                taggable
                @search="(searchEvent) => filterOptions(key, searchEvent)"
                v-model="selectedValues[key]"
              ></v-select>
            </div>
            <div>
              <label class="sub-text">Début de la plage de recherche</label>
              <input
                type="date"
                v-model="startDate"
                class="form-control"
                placeholder="Date de début"
              />
            </div>
            <div>
              <label class="sub-text">Fin de la plage de recherche</label>
              <input
                type="date"
                v-model="endDate"
                class="form-control"
                placeholder="Date de fin"
              />
            </div>
            <button class="btn btn-success" @click="handleButtonClick">
              Appliquer les filtrer, récupérer le fichier et mettre à jours les
              indicateurs
            </button>
            <button class="btn btn-success" @click="getStatRequest">
              Appliquer les filtres et afficher les indicateurs
            </button>
          </div>
        </div>
        <div v-if="displayStats">
          <div class="request-section">
            <h2 class="filter-title">
              Nuage de termes dans les titres des rencontres
            </h2>

            <div>
              <vue-word-cloud
                :key="wordCloudKey"
                style="height: 480px; width: 640px"
                :words="wordCloudData"
                :color="
                  ([, weight]) =>
                    weight > medianWeightTitle
                      ? 'DeepPink'
                      : weight < medianWeightTitle
                      ? 'RoyalBlue'
                      : 'Indigo'
                "
                font-family="Roboto"
              />
            </div>
          </div>
          <div class="request-section">
            <h2 class="filter-title">Nuage de termes organismes rencontrés</h2>

            <div>
              <vue-word-cloud
                :key="wordCloudKeyMeeting"
                style="height: 480px; width: 640px"
                :words="wordMeetingWith"
                :color="
                  ([, weight]) =>
                    weight > medianWeightMeeting
                      ? 'DeepPink'
                      : weight < medianWeightMeeting
                      ? 'RoyalBlue'
                      : 'Indigo'
                "
                font-family="Roboto"
              />
            </div>
          </div>

          <div class="request-section">
            <h2 class="filter-title">
              Nombre de rencontres groupées par groupes parlementaires européens
            </h2>

            <EasyDataTable
              :key="keyPolGroups"
              :headers="headers"
              :items="politicalGroups"
              row-id-key="name"
            />
          </div>

          <div class="request-section">
            <h2 class="filter-title">
              Nombre de rencontres groupées par groupes parlementaires nationaux
            </h2>

            <EasyDataTable
              :key="keyPolNationalGroups"
              :headers="headers"
              :items="politicalNationalGroups"
              row-id-key="name"
            />
          </div>

          <div class="request-section">
            <h2 class="filter-title">Cumul des titres de rencontres</h2>

            <EasyDataTable
              :key="keyTitlesRaw"
              :headers="headers"
              :items="titlesRaw"
              row-id-key="name"
            />
          </div>

          <div class="request-section">
            <h2 class="filter-title">Cumul des entités rencontrées</h2>

            <EasyDataTable
              :key="keyMeetingsRaw"
              :headers="headers"
              :items="meetingsRaw"
              row-id-key="name"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axiosInstance from "../axiosConfig";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { store } from "../store";

export default {
  setup() {
    return { store };
  },
  components: {
    "v-select": vSelect,
  },
  data() {
    return {
      isLoadingFile: false,
      isLoadingWords: false, // Ajoutez cette propriété pour gérer l'affichage du spinner
      mepLobbies: require("../../images/MEP_files.png"),
      apiResponse: null,
      selectedValues: {},
      filteredOptions: {},
      searchQuery: {},
      startDate: null,
      endDate: null,
      wordCloudData: [],
      wordCloudKey: 0,
      wordCloudKeyMeeting: 0,
      keyPolGroups: 0,
      keyPolNationalGroups: 0,
      maxWeightTitle: 10,
      minWeightTitle: 4,
      medianWeightTitle: 0,
      maxWeightMeetingWith: 10,
      minWeightMeetingWith: 4,
      medianWeightMeeting: 0,
      wordMeetingWith: [],
      maxWordLengthForCloud: 50,
      politicalGroups: [],
      politicalNationalGroups: [],
      headers: [
        { text: "Nom du Groupe", value: "name", autoSize: true },
        { text: "Nombre", value: "count", autoSize: true },
      ],
      titlesRaw: [],
      keyTitlesRaw: 0,
      meetingsRaw: [],
      keyMeetingsRaw: 0,
      displayStats: false,
    };
  },
  methods: {
    async getFile() {
      this.isLoadingFile = true; // Début du chargement
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Aucun jeton d'authentification trouvé");
        this.isLoadingFile = false; // Arrêt du chargement en cas d'erreur
        return;
      }

      try {
        const url = `${this.$apiUrl}/meps_file`;
        const response = await axiosInstance.get(url, {
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
        this.isLoadingFile = false; // Arrêt du chargement après la requête
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
    async handleButtonClick() {
      await this.sendRequest(); // Attendez que la première requête soit terminée
      await this.getStatRequest(); // Ensuite, appelez la deuxième requête
    },

    async sendRequest() {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams();
      this.isLoadingFile = true; // Début du chargement

      for (const [key, value] of Object.entries(this.selectedValues)) {
        const apiField = store.fieldMap[key];
        if (value && apiField) {
          queryParams.append(apiField, value);
        }
      }

      if (this.startDate) {
        // Convertit la date en format ISO si this.startDate est un objet Date
        const formattedStartDate = new Date(this.startDate).toISOString();
        queryParams.append("start_date", formattedStartDate);
      }
      if (this.endDate) {
        // Convertit la date en format ISO si this.endDate est un objet Date
        const formattedEndDate = new Date(this.endDate).toISOString();
        queryParams.append("end_date", formattedEndDate);
      }

      try {
        const response = await axiosInstance.get(`${this.$apiUrl}/meps_file`, {
          params: queryParams,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // Si vous attendez une réponse de type blob
        });

        // Traiter la réponse en tant que Blob si c'est un fichier
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement("a");
        fileLink.href = url;
        fileLink.setAttribute("download", "downloaded_file.xlsx"); // Nom du fichier à télécharger
        document.body.appendChild(fileLink);

        fileLink.click();
        window.URL.revokeObjectURL(url);
        fileLink.remove();
      } catch (error) {
        console.error("Erreur lors de la requête :", error);
        // Gestion supplémentaire des erreurs si nécessaire
      }
      this.isLoadingFile = false; // Début du chargement
    },

    async getStatRequest() {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams();
      this.isLoadingWords = true; // Début du chargement
      this.displayStats = true;
      for (const [key, value] of Object.entries(this.selectedValues)) {
        const apiField = store.fieldMap[key];
        if (value && apiField) {
          queryParams.append(apiField, value);
        }
      }

      if (this.startDate) {
        // Convertit la date en format ISO si this.startDate est un objet Date
        const formattedStartDate = new Date(this.startDate).toISOString();
        queryParams.append("start_date", formattedStartDate);
      }
      if (this.endDate) {
        // Convertit la date en format ISO si this.endDate est un objet Date
        const formattedEndDate = new Date(this.endDate).toISOString();
        queryParams.append("end_date", formattedEndDate);
      }

      try {
        const response = await axiosInstance.get(`${this.$apiUrl}/meps_stats`, {
          params: queryParams,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "json", // Si vous attendez une réponse de type blob
        });
        console.log(
          "Transformed titles:",
          this.transformTitles(response.data.Title)
        );
        const titles = this.transformTitles(response.data.Title, 100);

        const meetings = this.transformTitles(
          response.data.Meeting_With_no_stopwords,
          40
        );

        this.wordCloudData = titles.slice;
        this.wordMeetingWith = meetings.slice;
        this.medianWeightTitle = titles.medianWeight;
        this.minWeightTitle = titles.minWeight;
        this.medianWeightMeeting = meetings.medianWeight;
        console.log({ maxWeightMeetingWith: this.maxWeightMeetingWith / 2 });

        this.politicalGroups = Object.entries(
          response.data["MEP politicalGroup"]
        ).map(([name, count]) => ({
          name: name,
          count: count,
        }));

        this.politicalNationalGroups = Object.entries(
          response.data["MEP nationalPoliticalGroup"]
        ).map(([name, count]) => ({
          name: name,
          count: count,
        }));

        this.titlesRaw = Object.entries(
          response.data["Title_no_stopwords"]
        ).map(([name, count]) => ({
          name: name,
          count: count,
        }));

        this.meetingsRaw = Object.entries(
          response.data["Meeting_With_no_stopwords"]
        ).map(([name, count]) => ({
          name: name,
          count: count,
        }));

        console.log({ pols: this.politicalGroups });
        console.log({ pols2: this.politicalGroups2 });
        this.wordCloudKey = Date.now();
        this.wordCloudKeyMeeting = this.wordCloudKey + 1;
        this.keyPolGroups = this.wordCloudKey + 2;
        this.keyPolNationalGroups = this.wordCloudKey + 3;
        this.keyTitlesRaw = this.wordCloudKey + 4;
        this.keyMeetingsRaw = this.wordCloudKey + 5;
      } catch (error) {
        console.error("Erreur lors de la requête :", error);
        this.wordCloudData = [];
        this.wordMeetingWith = [];
        this.wordCloudKey = Date.now();
        this.wordCloudKeyMeeting = this.wordCloudKey + 1;
        this.keyPolGroups = this.wordCloudKey + 2;
        this.keyPolNationalGroups = this.wordCloudKey + 3;
        this.keyTitlesRaw = this.wordCloudKey + 4;
        this.keyMeetingsRaw = this.wordCloudKey + 5;

        // Gestion supplémentaire des erreurs si nécessaire
      }
      this.isLoadingWords = false;
    },
    transformTitles(titles, depth) {
      // Convert the titles object into an array of [word, weight] pairs
      const wordArray = Object.entries(titles);

      // Sort the array by weight in descending order
      const sortedWordArray = wordArray.sort((a, b) => b[1] - a[1]);
      let slice = sortedWordArray.slice(0, depth);

      const maxWeight = slice[0][1];
      const minWeight = slice[slice.length - 1][1];

      // Truncate titles longer than maxSliceRows characters and add '...'
      slice = slice.map(([title, weight]) => {
        if (title.length > this.maxWordLengthForCloud) {
          title = title.substring(0, this.maxWordLengthForCloud) + "...";
        }
        return [title, weight];
      });

      // Extracting the weights from the slice
      const weights = slice.map((item) => item[1]);

      // Calculating the median
      const medianWeight = this.median(weights);

      console.log(slice);
      console.log(maxWeight, minWeight, medianWeight);

      return { slice: slice, medianWeight: medianWeight, minWeight: minWeight };
    },
    median(values) {
      if (values.length === 0) throw new Error("No data");

      values.sort((a, b) => a - b);

      const half = Math.floor(values.length / 2);

      if (values.length % 2) return values[half];

      return (values[half - 1] + values[half]) / 2.0;
    },

    initializeSelectedValues() {
      if (this.apiResponse && typeof this.apiResponse === "object") {
        Object.keys(this.apiResponse).forEach((key) => {
          if (store.fieldMap[key]) {
            this.selectedValues[key] = null;
          }
        });
      } else {
        console.error("apiResponse is null or not an object");
      }
    },
    initializeFilteredOptions() {
      this.filteredOptions = {};
      Object.keys(this.apiResponse).forEach((key) => {
        if (store.fieldMap[key]) {
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
.filter-title {
  text-align: center; /* Centrer le titre */
  color: #fff; /* Couleur du texte du titre */
  margin-bottom: 15px; /* Espace sous le titre */
  padding: 10px; /* Espace intérieur pour le titre */
  background-color: #6c757d; /* Couleur de fond pour le titre */
  border-radius: 5px; /* Bords arrondis pour le titre */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Ombre pour le titre */
  text-transform: uppercase; /* Texte en majuscules */
  font-size: 1.2rem; /* Taille de la police */
}

.request-section {
  background-color: rgba(
    114,
    114,
    114,
    0.9
  ); /* Un arrière-plan légèrement différent */
  border: 1px solid #717171; /* Une bordure subtile */
  padding: 20px; /* Un peu d'espace à l'intérieur */
  margin-top: 20px; /* Espace au-dessus de la section */
  border-radius: 10px; /* Bords arrondis */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Ombre légère pour un effet de profondeur */
}

.error-message {
  color: #dc3545; /* Rouge pour les erreurs */
  background-color: rgba(220, 53, 69, 0.7);
  text-shadow: 0 0 3px #000;
  padding: 10px;
  border-radius: 5px;
}

.success-message {
  color: #28a745; /* Vert pour les succès */
  background-color: rgba(40, 167, 69, 0.7);
  text-shadow: 0 0 3px #000;
  padding: 10px;
  border-radius: 5px;
}

.form-control,
.v-select {
  background-color: rgba(255, 255, 255, 0.7);
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.form-group,
.search-container,
.image-button-container,
.btn-success,
.form-control {
  margin-bottom: 10px; /* Espace uniforme entre les éléments */
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
  background-color: rgba(
    255,
    255,
    255,
    0.9
  ); /* Fond blanc légèrement transparent */
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
