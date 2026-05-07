<script setup lang="ts">
import Crop from "./components/Crop/Crop.vue";

// Avoid file drop
window.addEventListener("drop", (e) => {
  if (
    e.dataTransfer &&
    [...e.dataTransfer.items].some((item) => item.kind === "file")
  ) {
    e.preventDefault();
  }
});

window.addEventListener("dragover", (e) => {
  const fileItems =
    e.dataTransfer &&
    [...e.dataTransfer.items].filter((item) => item.kind === "file");
  if (fileItems && fileItems.length > 0) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "none";
  }
});
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
