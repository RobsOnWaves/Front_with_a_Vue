  <template>
    <div v-if="chartData" class="chart-container">
      <Line id="my-chart-id" :options="chartOptions" :data="chartData" />
    </div>
  </template>
    
    <script>
  import { Line } from "vue-chartjs";
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
  } from "chart.js";
  import { TimeScale, TimeSeriesScale } from "chart.js"; // Importez TimeScale
  import "chartjs-adapter-luxon";

  ChartJS.register(
    Title,
    Tooltip,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    TimeScale,
    TimeSeriesScale
  );

  export default {
    name: "LineChart",
    components: { Line },
    props: {
      rawData: {  // Ajoutez cette ligne pour définir la prop 'rawData'
        type: Object,
        required: true
      },
      
      selectedCategory: { // La nouvelle prop pour la catégorie fixe
        type: String,
        required: true
      }
      
    },
    data() {
      return {
        chartData: null,
        chartOptions: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: "time",
              time: {
                unit: "month",
              },
            },
            y: {},
          },
        },
      };
    },
    mounted() {
      this.chartData = this.createChartData(this.rawData, this.selectedCategory);
    },
    methods: {
        createChartData(rawData) {

      const labels = Object.keys(rawData);
      const datasets = this.createDatasets(rawData);

      return {
        labels,
        datasets,
      };
    },
    createDatasets(rawData) {
        // Remove labels parameter if not needed
        let allTitles = {};
        const colors = [
          "rgba(255, 99, 132, 0.5)", // Rouge
          "rgba(54, 162, 235, 0.5)", // Bleu
          "rgba(255, 206, 86, 0.5)", // Jaune
          "rgba(75, 192, 192, 0.5)", // Vert
          "rgba(153, 102, 255, 0.5)", // Violet
          "rgba(255, 159, 64, 0.5)", // Orange
          "rgba(199, 199, 199, 0.5)", // Gris
          "rgba(93, 165, 218, 0.5)", // Bleu clair
          "rgba(250, 164, 58, 0.5)", // Orange clair
          "rgba(96, 189, 104, 0.5)", // Vert clair
          "rgba(222, 207, 63, 0.5)", // Jaune foncé
          "rgba(241, 88, 84, 0.5)", // Rouge clair
          "rgba(77, 77, 77, 0.5)", // Charbon
          "rgba(153, 69, 255, 0.5)", // Mauve
          "rgba(255, 69, 96, 0.5)", // Rose
          "rgba(0, 123, 255, 0.5)", // Bleu roi
          "rgba(32, 201, 151, 0.5)", // Turquoise
          "rgba(255, 193, 7, 0.5)", // Ambre
          "rgba(128, 0, 128, 0.5)", // Pourpre
          "rgba(70, 130, 180, 0.5)", // ...ajoutez plus de couleurs si vous avez plus de labels
        ];
        Object.keys(rawData).forEach((label, index) => {
          let sortedTitles = Object.entries(rawData[label][this.selectedCategory])
            .sort((a, b) => b[1] - a[1])
            .slice(0, 20);

          sortedTitles.forEach(([title]) => {
            if (!allTitles[title]) {
              allTitles[title] = Array(Object.keys(rawData).length).fill(null);
            }
            allTitles[title][index] = rawData[label][this.selectedCategory][title];
          });
        });

        let colorIndex = 0;
        return Object.keys(allTitles).map((title) => {
          const color = colors[colorIndex % colors.length]; // Cycle through colors array
          colorIndex++; // Increment color index

          return {
            label: title,
            data: allTitles[title],
            fill: false,
            borderColor: color,
            backgroundColor: color, // Additional dataset options...
          };
        });
      },
    },
  };
  </script>
    <style scoped>
  .chart-container {
    height: 1000px;
    width: 1000px;
    margin: 0 auto;
    background-color: white;
  }
  </style>
    