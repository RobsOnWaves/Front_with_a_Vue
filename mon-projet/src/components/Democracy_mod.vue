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
        <div class="sub-section">
          <h1 class="h1-title">Filtrage des données</h1>

          <div class="request-section">
            <h2 class="filter-title">Filtres de Recherche</h2>

            <div class="image-button-container">
              <div v-for="(options, key) in apiResponse" :key="key">
                <label :for="key" class="filter-sub-title">{{ key }}</label>
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
                <label class="filter-sub-title"
                  >Début de la plage de recherche</label
                >
                <input
                  type="date"
                  v-model="startDate"
                  class="form-control"
                  placeholder="Date de début"
                />
              </div>
              <div>
                <label class="filter-sub-title"
                  >Fin de la plage de recherche</label
                >
                <input
                  type="date"
                  v-model="endDate"
                  class="form-control"
                  placeholder="Date de fin"
                />
              </div>
            </div>
            </div>
            <div class="request-section">
              <h2 class="filter-title">Sélection de l'action</h2>
              <div class="buttons-container">
                <div class="button-group-container">
                  <div class="button-with-text">
                    <div
                      class="image-button"
                      @click="handleButtonClick"
                      :style="{
                        backgroundImage: 'url(' + getFilesAndView + ')',
                      }"
                    >
                      <span class="button-text">Télécharger et afficher</span>
                    </div>
                    <div class="sub-text" @click="handleButtonClick">
                      Appliquer les filtres, récupérer les fichiers et mettre à
                      jour les indicateurs
                    </div>
                  </div>
                  <div class="button-with-text">
                    <div
                      class="image-button"
                      @click="getStatRequest"
                      :style="{ backgroundImage: 'url(' + getStats + ')' }"
                    >
                      <span class="button-text">Afficher</span>
                    </div>
                    <div class="sub-text" @click="getStatRequest">
                      Appliquer les filtres et afficher les indicateurs
                    </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="displayStats" class="sub-section">
          <h1 class="h1-title">Affichage des données</h1>
          <div class="request-section">
            <h2 class="filter-title">
              Nuage de termes dans les titres des rencontres
            </h2>

            <div class="word-cloud-container">
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

            <div class="word-cloud-container">
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
      mepLobbies: require("../../images/MEP_files.jpg"),
      getFilesAndView: require("../../images/get_files_updated_data.jpg"),
      getStats: require("../../images/view_graphs.jpg"),
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
      maxWordLengthForCloud: 30,
      politicalGroups: [],
      politicalNationalGroups: [],
      headers: [
        { text: "Nom", value: "name", autoSize: true },
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
      await this.getStatRequest();
      await this.getStatRequestFile(); // Ensuite, appelez la deuxième requête
    },
    async handleButtonClickStats() {
      await this.getStatRequest();
      await this.getStatRequestFile(); // Ensuite, appelez la deuxième requête
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
        fileLink.setAttribute("download", "downloaded_file_raw_data.xlsx"); // Nom du fichier à télécharger
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

        this.titlesRaw = Object.entries(response.data["Title_unfiltered"]).map(
          ([name, count]) => ({
            name: name,
            count: count,
          })
        );

        this.meetingsRaw = Object.entries(
          response.data["Meeting_With_unfiltered"]
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
    async getStatRequestFile() {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams();
      this.isLoadingFile = true; // Début du chargement
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
        const response = await axiosInstance.get(
          `${this.$apiUrl}/meps_stats_file`,
          {
            params: queryParams,
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "blob", // Si vous attendez une réponse de type blob
          }
        );
        // Traiter la réponse en tant que Blob si c'est un fichier
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement("a");
        fileLink.href = url;
        fileLink.setAttribute("download", "downloaded_file_stats.xlsx"); // Nom du fichier à télécharger
        document.body.appendChild(fileLink);

        fileLink.click();
        window.URL.revokeObjectURL(url);
        fileLink.remove();
      } catch (error) {
        console.error("Erreur lors de la requête :", error);
        // Gestion supplémentaire des erreurs si nécessaire
      }
      this.isLoadingFile = false;
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
</style>
