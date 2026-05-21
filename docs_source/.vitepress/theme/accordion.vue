<template>
  <div class="accordion">
    <slot />
  </div>
</template>

<style scoped>
.accordion {
  border: 1px solid #e6e6e6;
  border-radius: 12px;
  overflow: hidden;
  margin: 16px 0;
}

.dark .accordion {
  border-color: #333;
}
</style>
