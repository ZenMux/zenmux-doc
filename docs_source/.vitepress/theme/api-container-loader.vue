<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue";
import { useData } from "vitepress";

const ApiContainer = defineAsyncComponent(() => import("./api-container.vue"));
const { frontmatter } = useData();
const isApiPage = computed(() => frontmatter.value.pageClass === "api-page");
</script>

<template>
  <ApiContainer v-if="isApiPage" />
</template>
