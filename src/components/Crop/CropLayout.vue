<script setup lang="ts">
import type {
  HighlightNormalizedBounds,
  HighlightRawPoints,
  ImageSize,
} from "@/lib/types";
import { computed, ref } from "vue";

interface CropLayoutProps {
  naturalSize?: ImageSize;
}

const { naturalSize } = defineProps<CropLayoutProps>();
const highlightedZone = defineModel<HighlightNormalizedBounds>();

const layout = ref<HTMLElement>();
const rawHighlight = ref<HighlightRawPoints>({});
const isHighlightningStarted = ref<boolean>(false);

const normalizedHighlight = computed(() => {
  const coords = {} as HighlightNormalizedBounds;
  const { xEnd, xStart, yEnd, yStart } = rawHighlight.value;

  if (
    !layout.value ||
    yStart == null ||
    yEnd == null ||
    xStart == null ||
    xEnd == null
  )
    return coords;

  if (yEnd < yStart) {
    coords.top = yEnd;
    coords.bottom = yStart;
  } else {
    coords.top = yStart;
    coords.bottom = yEnd;
  }

  if (xEnd < xStart) {
    coords.left = xEnd;
    coords.right = xStart;
  } else {
    coords.left = xStart;
    coords.right = xEnd;
  }

  const { scrollHeight, scrollWidth } = layout.value;
  
  return {
    top: Math.max(coords.top, 0),
    bottom: Math.min(coords.bottom, scrollHeight),
    left: Math.max(coords.left, 0),
    right: Math.min(coords.right, scrollWidth),
  };
});

const highlightW = computed(() => {
  const size =
    normalizedHighlight.value?.right != null &&
    normalizedHighlight.value?.left != null &&
    normalizedHighlight.value?.right - normalizedHighlight.value?.left;

  return Math.abs(size || 0);
});

const highlightH = computed(() => {
  const size =
    normalizedHighlight.value?.bottom != null &&
    normalizedHighlight.value?.top != null &&
    normalizedHighlight.value?.bottom - normalizedHighlight.value?.top;

  return Math.abs(size || 0);
});

const isHighlighted = computed<boolean>(
  () =>
    rawHighlight.value.xStart != null &&
    highlightW.value > 4 &&
    highlightH.value > 4,
);

function startHighlightning(e: MouseEvent) {
  rawHighlight.value.xStart = e.offsetX;
  rawHighlight.value.yStart = e.offsetY;

  rawHighlight.value.xEnd = undefined;
  rawHighlight.value.yEnd = undefined;

  isHighlightningStarted.value = true;
}

function onHover(e: MouseEvent) {
  if (!isHighlightningStarted.value) return;

  rawHighlight.value.xEnd = e.offsetX;
  rawHighlight.value.yEnd = e.offsetY;
}

function stopHighlightning(e: MouseEvent) {
  if (!isHighlightningStarted.value) return;
  isHighlightningStarted.value = false;

  rawHighlight.value.xEnd = e.offsetX;
  rawHighlight.value.yEnd = e.offsetY;

  calcCropArea();
}

function calcCropArea() {
  const { top, bottom, left, right } = normalizedHighlight.value;
  if (
    !layout.value ||
    top == null ||
    bottom == null ||
    left == null ||
    right == null ||
    !naturalSize
  )
    return;

  const { scrollHeight, scrollWidth } = layout.value;

  highlightedZone.value = {
    top: Math.floor((top / scrollHeight) * naturalSize?.h),
    bottom: Math.ceil((bottom / scrollHeight) * naturalSize?.h),
    left: Math.floor((left / scrollWidth) * naturalSize?.w),
    right: Math.ceil((right / scrollWidth) * naturalSize?.w),
  };
}
</script>

<template>
  <div
    ref="layout"
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
        top: `${normalizedHighlight?.top}px`,
        left: `${normalizedHighlight?.left}px`,
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
