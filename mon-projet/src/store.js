// store.js
import { reactive } from 'vue';

export const store = reactive({
  isLoggedIn: true,
  errorMessage: {
    visible: false,
    message: ''
  }
});
