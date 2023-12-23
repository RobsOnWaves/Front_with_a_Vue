<template>
    <div> <!-- Maintenant, il y a un seul élément racine -->
      <input type="file" @change="handleFileUpload">
      <button @click="submitFile">Upload</button>
    </div>
  </template>
  
  <script>
  export default {
    props: ['token'], // Recevez le token en tant que prop
    // ... le reste du code pour gérer le téléversement de fichier ...
  };
  </script>
  