<template>
  <div class="contact-cards">
    <slot />
  </div>
</template>

<style scoped>
.contact-cards {
  display: flex;
  gap: 12px;
  margin: 20px 0;
}

@media (max-width: 768px) {
  .contact-cards {
    flex-direction: column;
  }
}
</style>
