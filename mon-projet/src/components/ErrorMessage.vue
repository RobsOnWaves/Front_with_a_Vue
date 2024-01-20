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
    position: relative;
    top: 10px;
    display: flex;
    left: 50%;
    margin-bottom: 15px;
    transform: translateX(-50%);
    background-color: red;
    color: white;
    padding: 20px;
    border-radius: 5px;
    z-index: 1000;
  }
  </style>
  