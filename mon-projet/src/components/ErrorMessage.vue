<template>
    <div v-if="visible" class="error-message">
      {{ message }}
    </div>
  </template>
  
  <script>
import { store } from '../store';

export default {
  setup() {
    return { store };
  },
    computed: {
      visible() {
        return store.errorMessage.visible;
      },
      message() {
        return store.errorMessage.message;
      }
    }
  };
  </script>
  
  <style>
  .error-message {
    position: fixed;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    background-color: red;
    color: white;
    padding: 10px;
    border-radius: 5px;
    z-index: 1000;
  }
  </style>
  