<script setup lang="ts">
import { h } from 'vue';
import ApiRequest from './api-request.vue';
import ApiResponse from './api-response.vue';
</script>

<template>
  <div class="api-container">
    <ApiRequest />
    <ApiResponse />
  </div>
</template>

<style>
.api-container {
  position: fixed;
  top: 80px;
  right: 20px;
  width: 480px;
  max-width: min(500px, calc(100vw - 912px));
  max-height: calc(100vh - 100px);
  z-index: 22;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

@media (max-width: 1280px) {
  .api-container {
    position: static;
    width: 100%;
    max-width: 100%;
    min-width: 640px;
    margin: 0 auto;
    padding: 0 32px;
  }
}
</style>
