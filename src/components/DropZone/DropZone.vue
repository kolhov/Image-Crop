<script setup lang="ts">
import { ref } from "vue";
import Upload from "../Icons/UploadIcon.vue";

const isDragOver = ref(false);
const img = defineModel();

function dropHandler(e: DragEvent) {
  isDragOver.value = false;
  if (!e.dataTransfer) return;

  const items = [...e.dataTransfer?.items];
  const imgItem = items.find((item) => item.type.startsWith("image/"));

  if (!imgItem) return;

  img.value = imgItem.getAsFile();
}

function dragoverHandler(e: DragEvent) {
  if (!e.dataTransfer) return;

  const fileItems = [...e.dataTransfer.items].filter(
    (item) => item.kind === "file",
  );
  if (fileItems.length > 0) {
    e.preventDefault();
    e.stopPropagation();

    const img = fileItems.find((item) => item.type.startsWith("image/"));
    if (img) {
      e.dataTransfer.dropEffect = "copy";
    } else {
      e.dataTransfer.dropEffect = "none";
    }
  }
}

function changeImageHandler(ev: Event) {
  const input = ev.target as HTMLInputElement;
  if (!input.files) return;

  const image = [...input.files].find((item) => item.type.startsWith("image/"));

  img.value = image;
}
</script>

<template>
  <div class="dropzone__wrap">
    <label
      for="file-drop"
      class="dropzone"
      :class="{ 'dropzone--active': isDragOver }"
      @drop.prevent="dropHandler"
      @dragenter="isDragOver = true"
      @dragleave="isDragOver = false"
      @dragover="dragoverHandler"
    >
      <Upload class="dropzone__icon" />
      Drop image here, or click to upload
      <input
        id="file-drop"
        type="file"
        accept="image/*"
        class="dropzone__input"
        @change="changeImageHandler"
      />
    </label>
  </div>
</template>

<style lang="scss">
.dropzone {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 30vh;
  min-width: 90%;
  margin: 24px;
  padding: 4px;
  cursor: pointer;

  border: 3px dotted black;
  border-radius: 14px;
  color: slategray;
  background-color: rgba(green, 0.04);
  outline: 6px solid rgba(green, 0.04);

  font-weight: 500;
  font-size: 20px;

  &:hover {
    background-color: rgba(green, 0.1);
    outline: 6px solid rgba(green, 0.1);
  }

  &--active {
    background-color: rgba(green, 0.2);
    outline: 6px solid rgba(green, 0.2);
  }

  &__input {
    display: none;
  }

  &__icon {
    $size: 80px;

    height: $size;
    width: $size;
    pointer-events: none;
  }
}
</style>
