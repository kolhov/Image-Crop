<script setup lang="ts">
import CropLayout from "./CropLayout.vue";
</script>

<template>
  <div class="crop-wrap" draggable="false">
    <CropLayout class="crop__layout" />
    <img
      class="crop__img"
      draggable="false"
      src="https://img.freepik.com/premium-vector/beautiful-landscape-nature-background-images-free-download-freepik-vector_1305309-1538.jpg"
    />
  </div>
</template>

<style>
.crop-wrap {
  position: relative;
  height: 60%;
  width: 80%;

  background-color: white;
  border: 2px solid black;
  overflow: hidden;
}

.crop__layout {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 10;
}

.crop__img {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  height: 100%;
  width: 100%;

  object-fit: contain;
}
</style>
