<script setup lang="ts">
import { ref } from "vue";
import CropLayout from "./CropLayout.vue";

const aspectRatio = ref<string | null>();

function setLayoutAspectRatio(e: Event) {
  const img = e.target as HTMLImageElement;
  aspectRatio.value = `${img.naturalWidth} / ${img.naturalHeight}`;
}
</script>

<template>
  <div class="crop__wrap" draggable="false">
    <div class="crop" draggable="false">
      <CropLayout class="crop__layout">
        <img
          class="crop__img"
          draggable="false"
          src="https://img.freepik.com/premium-vector/beautiful-landscape-nature-background-images-free-download-freepik-vector_1305309-1538.jpg"
          @load="setLayoutAspectRatio"
        />
      </CropLayout>
    </div>
  </div>
</template>

<style lang="scss">
.crop {
  position: relative;
  aspect-ratio: v-bind(aspectRatio);
  max-width: 100%;
  max-height: 100%;

  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  &__wrap {
    aspect-ratio: v-bind(aspectRatio);

    width: 90%;
    max-height: 60%;

    background-color: white;
    border: 2px solid black;
    overflow: hidden;

    user-select: none;
    -webkit-user-drag: none;
  }

  &__layout {
    aspect-ratio: v-bind(aspectRatio);

    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10;
    overflow: hidden;
  }

  &__img {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;

    object-fit: contain;
  }
}
</style>
