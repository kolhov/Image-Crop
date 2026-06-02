<script setup lang="ts">
import Button from "../Button/Button.vue";
import DropZone from "../DropZone/DropZone.vue";
import CropLayout from "./CropLayout.vue";
import CancelIcon from "../Icons/CancelIcon.vue";
import ScissorsIcon from "../Icons/ScissorsIcon.vue";
import { computed, ref, watch } from "vue";
import type { HighlightNormalizedBounds, ImageSize } from "@/lib/types";
import { downloadBlobAsImage } from "@/lib/utils.ts";

const userImage = ref<File>();
const aspectRatio = ref<string | null>();
const naturalSize = ref<ImageSize>();
const highlightedZone = ref<HighlightNormalizedBounds>();

const imageUrl = computed(
  () => userImage.value && URL.createObjectURL(userImage.value),
);

function setLayoutAspectRatio(e: Event) {
  const img = e.target as HTMLImageElement;
  aspectRatio.value = `${img.naturalWidth} / ${img.naturalHeight}`;
  naturalSize.value = { h: img.naturalHeight, w: img.naturalWidth };
}

//#region Buttons
const isLoading = ref(false);

function cancelHandler() {
  userImage.value = undefined;
  aspectRatio.value = undefined;
  naturalSize.value = undefined;
  highlightedZone.value = undefined;
}

async function cropHandler() {
  if (!highlightedZone.value || !imageUrl.value) return;
  isLoading.value = true;

  const image = new Image();
  image.src = imageUrl.value;
  await image.decode();

  const { top, bottom, left, right } = highlightedZone.value;
  const width = right - left;
  const height = bottom - top;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return isLoading.value = false;

  ctx.drawImage(image, left, top, width, height, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((res) =>
    canvas.toBlob(res, "image/png"),
  );

  if (!blob) return isLoading.value = false;

  downloadBlobAsImage(
    blob,
    `${userImage.value?.name}-cropped.png` || "cropped-img.png",
  );

  image.remove();
  canvas.remove();
  isLoading.value = false;
}
//#endregion

// Preventing memory leak
watch(imageUrl, (_, prev) => {
  if (prev) {
    URL.revokeObjectURL(prev);
  }
});
</script>

<template>
  <div class="crop">
    <div class="crop__window" draggable="false">
      <div v-if="userImage" class="crop__preview" draggable="false">
        <CropLayout :naturalSize v-model="highlightedZone" class="crop__layout">
          <img
            :src="imageUrl"
            draggable="false"
            class="crop__img"
            @load="setLayoutAspectRatio"
          />
        </CropLayout>
      </div>
      <DropZone v-else v-model="userImage" />
    </div>
    <div v-if="userImage" class="crop__buttons">
      <Button
        type="secondary"
        @click="cancelHandler"
        class="btn"
        :disabled="isLoading"
      >
        <CancelIcon class="btn__icon" />
        Cancel
      </Button>
      <Button @click="cropHandler" :disabled="isLoading || !highlightedZone?.top">
        <span v-if="!isLoading" class="btn">
          <ScissorsIcon class="btn__icon" />
          Crop
        </span>
        <div v-else class="spinner">
        </div>
      </Button>
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

  &__buttons {
    display: flex;
    gap: 24px;
  }
}

.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  &__icon {
    height: 18px;
    width: 18px;
  }
}

.spinner {
  width: 18px;
  height: 18px;
  padding: 1px;
  border: 2px solid #ddd;
  border-top-color: #1c008a;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
