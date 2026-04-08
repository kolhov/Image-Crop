<script setup lang="ts">
import Crop from "./components/Crop/Crop.vue";
</script>

<template>
  <main>
    <div class="containter">
      <Crop />
    </div>
  </main>
</template>

<style scoped>
.containter {
  height: 100vh;
  margin: 0 auto;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: aqua;
  
  background-image:
    linear-gradient(to right, #ccc 1px, transparent 1px),
    linear-gradient(to bottom, #ccc 1px, transparent 1px);
  background-size: 20px 20px;
}
</style>
