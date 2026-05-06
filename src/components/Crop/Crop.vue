<script setup lang="ts">
import { ref, watch } from "vue";
import CropLayout from "./CropLayout.vue";
import type { HighlightNormalizedBounds, ImageSize } from "@/lib/types";

const aspectRatio = ref<string | null>();
const naturalSize = ref<ImageSize>();
const highlightedZone = ref<HighlightNormalizedBounds>();

function setLayoutAspectRatio(e: Event) {
  const img = e.target as HTMLImageElement;
  aspectRatio.value = `${img.naturalWidth} / ${img.naturalHeight}`;
  naturalSize.value = { h: img.naturalHeight, w: img.naturalWidth };
}

watch(highlightedZone, (x) => console.log(x));
</script>

<template>
  <div class="crop">
    <div class="crop__window" draggable="false">
      <div class="crop__preview" draggable="false">
        <CropLayout :naturalSize v-model="highlightedZone" class="crop__layout">
          <img
            class="crop__img"
            draggable="false"
            src="https://img.freepik.com/premium-vector/beautiful-landscape-nature-background-images-free-download-freepik-vector_1305309-1538.jpg"
            @load="setLayoutAspectRatio"
          />
        </CropLayout>
      </div>
    </div>
    <div class="crop__buttons">
      <button>Cancel</button>
      <button>Reset</button>
    </div>
  </div>
</template>

<style lang="scss">
.crop {
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;

  &__window {
    aspect-ratio: v-bind(aspectRatio);

    width: 90%;
    max-height: 65%;

    background-color: white;
    border: 2px solid black;
    overflow: hidden;

    user-select: none;
    -webkit-user-drag: none;
  }

  &__preview {
    position: relative;
    aspect-ratio: v-bind(aspectRatio);
    max-width: 100%;
    max-height: 100%;

    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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
