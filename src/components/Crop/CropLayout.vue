<script setup lang="ts">
import { computed, ref, watch } from "vue";

interface HighlightPos {
  xStart?: number;
  yStart?: number;
  xEnd?: number;
  yEnd?: number;
}

const highlight = ref<HighlightPos>({});
const isHighlightningStarted = ref<boolean>(false);
const isHighlighted = computed<boolean>(
  () =>
    !!highlight.value.xStart && highlightW.value > 4 && highlightH.value > 4,
);

const top = computed(() => {
  let size = 0;
  const { yEnd, yStart } = highlight.value;
  if (!yStart) return;

  if (yEnd && yEnd < yStart) size = yEnd;
  else size = yStart;

  return `${size}px`;
});

const left = computed(() => {
  let size = 0;
  const { xEnd, xStart } = highlight.value;
  if (!xStart) return;

  if (xEnd && xEnd < xStart) size = xEnd;
  else size = xStart;

  return `${size}px`;
});

const highlightW = computed(() => {
  const size =
    highlight.value?.xEnd &&
    highlight.value?.xStart &&
    highlight.value?.xEnd - highlight.value?.xStart;

  return Math.abs(size || 0);
});

const highlightH = computed(() => {
  const size =
    highlight.value?.yEnd &&
    highlight.value?.yStart &&
    highlight.value?.yEnd - highlight.value?.yStart;

  return Math.abs(size || 0);
});

function startHighlightning(e: MouseEvent) {
  highlight.value.xStart = e.offsetX;
  highlight.value.yStart = e.offsetY;

  highlight.value.xEnd = undefined;
  highlight.value.yEnd = undefined;

  isHighlightningStarted.value = true;
}

function onHover(e: MouseEvent) {
  if (!isHighlightningStarted.value) return;

  highlight.value.xEnd = e.offsetX;
  highlight.value.yEnd = e.offsetY;
}

function stopHighlightning(e: MouseEvent) {
  if (!isHighlightningStarted.value) return;
  isHighlightningStarted.value = false;

  highlight.value.xEnd = e.offsetX;
  highlight.value.yEnd = e.offsetY;
}
</script>

<template>
  <div
    @mousedown="startHighlightning"
    @mouseup="stopHighlightning"
    @mouseleave="stopHighlightning"
    @mousemove="onHover"
    draggable="false"
  >
    <div
      v-if="isHighlighted"
      class="crop__highlight"
      :style="{
        width: `${highlightW}px`,
        height: `${highlightH}px`,
        top,
        left,
      }"
    ></div>
    <slot></slot>
  </div>
</template>

<style>
.crop__highlight {
  position: absolute;
  z-index: 9;

  pointer-events: none;
  border: 1px solid wheat;
  box-shadow: 0 0 0 200vw rgba(1, 1, 1, 0.5);
}
</style>
