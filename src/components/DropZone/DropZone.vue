<script setup lang="ts">
import { ref } from "vue";
import Upload from "../Icons/Upload.vue";

const isDragOver = ref(false);
const img = defineModel();

function imageHandler(e: DragEvent) {
  isDragOver.value = false;
  const files = e.dataTransfer?.files;
  if (!files) return;

}

function dragoverHandler(e: DragEvent) {
  e.preventDefault();
  e.stopPropagation();
  e.dataTransfer && (e.dataTransfer.dropEffect = "copy");
}
</script>

<template>
  <div class="dropzone__wrap">
    <label
      for="file-drop"
      class="dropzone"
      :class="{ 'dropzone--active': isDragOver }"
      @drop.prevent="imageHandler"
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
