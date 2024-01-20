// store.js
import { reactive } from 'vue';

export const store = reactive({
  isLoggedIn: false,
  errorMessage: {
    visible: false,
    message: ''
  }
});
