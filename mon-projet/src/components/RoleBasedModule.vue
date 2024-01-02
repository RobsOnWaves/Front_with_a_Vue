<template>
    <div>
      <div v-if="userRole === 'admin' || userRole === 'gold_digger'">
        <button @click="goToFileUpload">Go to File Upload</button>
      </div>
      <div v-else>
        No apps for you
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      userRole: String
    },
    methods: {
  goToFileUpload() {
    this.$emit('navigate-to-fileupload');
  },
    mounted() {
    console.log("UserRole:", this.userRole);
  }
}
  }
  </script>
  