<script setup lang="ts">
import Button from "../Button/Button.vue";
import DropZone from "../DropZone/DropZone.vue";
import CropLayout from "./CropLayout.vue";
import CancelIcon from "../Icons/CancelIcon.vue";
import ScissorsIcon from "../Icons/ScissorsIcon.vue";
import { computed, ref, watch } from "vue";
import type { HighlightNormalizedBounds, ImageSize } from "@/lib/types";

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

function cancelHandler() {
  userImage.value = undefined;
  aspectRatio.value = undefined;
  naturalSize.value = undefined;
  highlightedZone.value = undefined;
}

async function cropHandler() {
  if (!highlightedZone.value || !imageUrl.value) return;

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
  if (!ctx) return;

  ctx.drawImage(image, left, top, width, height, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((res) =>
    canvas.toBlob(res, "image/png"),
  );

  if (!blob) return;

  downloadBlobAsImage(blob, userImage.value?.name || 'img');

  image.remove();
  canvas.remove();
}

function downloadBlobAsImage(blob: Blob, name: string) {
  const a = document.createElement("a");
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = `${name}-cropped.png`;
  a.click();

  a.remove();
  URL.revokeObjectURL(url);
}

watch(imageUrl, (_, prev) => {
  if (prev) {
    URL.revokeObjectURL(prev)
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
      <Button type="secondary" @click="cancelHandler" class="btn">
        <CancelIcon class="btn__icon" />
        Cancel
      </Button>
      <Button @click="cropHandler" class="btn">
        <ScissorsIcon class="btn__icon" />
        Crop
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
</style>
