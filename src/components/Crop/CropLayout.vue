<script setup lang="ts">
import {
  CornerSideEnum,
  type HighlightNormalizedBounds,
  type HighlightRawPoints,
  type ImageSize,
} from "@/lib/types";
import { computed, ref } from "vue";
import HandleIcon from "../Icons/HandleIcon.vue";

interface CropLayoutProps {
  naturalSize?: ImageSize;
}

const CORNER_SIZE_PX = 18;
const CORNER_OFFSET_PX = 4;

const { naturalSize } = defineProps<CropLayoutProps>();
const highlightedZone = defineModel<HighlightNormalizedBounds>();

const layout = ref<HTMLElement>();
const layoutRect = computed(() => layout.value?.getBoundingClientRect());

const rawHighlight = ref<HighlightRawPoints>({});

const normalizedHighlight = computed(() => {
  const coords = {} as HighlightNormalizedBounds;
  const { right, left, bottom, top } = rawHighlight.value;

  if (
    !layout.value ||
    top == null ||
    bottom == null ||
    left == null ||
    right == null
  )
    return coords;

  if (bottom < top) {
    coords.top = bottom;
    coords.bottom = top;
  } else {
    coords.top = top;
    coords.bottom = bottom;
  }

  if (right < left) {
    coords.left = right;
    coords.right = left;
  } else {
    coords.left = left;
    coords.right = right;
  }

  const { clientHeight, clientWidth } = layout.value;

  return {
    top: Math.max(coords.top, 0),
    bottom: Math.min(coords.bottom, clientHeight),
    left: Math.max(coords.left, 0),
    right: Math.min(coords.right, clientWidth),
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
    rawHighlight.value.left != null &&
    highlightW.value > 4 &&
    highlightH.value > 4,
);

//#region Hightlight events
const isHighlightningStarted = ref<boolean>(false);

function startHighlightning(e: MouseEvent) {
  rawHighlight.value.left = e.offsetX;
  rawHighlight.value.top = e.offsetY;

  rawHighlight.value.right = undefined;
  rawHighlight.value.bottom = undefined;

  isHighlightningStarted.value = true;

  window.addEventListener("mousemove", onHover);
  window.addEventListener("mouseup", stopHighlightning);
}

function onHover(e: MouseEvent) {
  if (!isHighlightningStarted.value || !layoutRect.value) return;

  const rect = layoutRect.value;

  rawHighlight.value.right = e.clientX - rect?.left;
  rawHighlight.value.bottom = e.clientY - rect?.top;
}

function stopHighlightning(e: MouseEvent) {
  if (!isHighlightningStarted.value) return;
  isHighlightningStarted.value = false;

  window.removeEventListener("mousemove", onHover);
  window.removeEventListener("mouseup", stopHighlightning);

  rawHighlight.value = normalizedHighlight.value;

  calcCropArea();
}
//#endregion

//#region Corner events
const selectedCorner = ref();

function startEditingHighlight(e: MouseEvent, index: number) {
  selectedCorner.value = index;

  window.addEventListener("mousemove", onHoverEditing);
  window.addEventListener("mouseup", stopEditingHighlight);
}

function onHoverEditing(e: MouseEvent) {
  if (selectedCorner.value == null || !layoutRect.value) return;

  const rect = layoutRect.value;

  switch (selectedCorner.value) {
    case CornerSideEnum.TopLeft: {
      rawHighlight.value.left = e.clientX - rect?.left;
      rawHighlight.value.top = e.clientY - rect?.top;
      break;
    }
    case CornerSideEnum.TopRight: {
      rawHighlight.value.right = e.clientX - rect?.left;
      rawHighlight.value.top = e.clientY - rect?.top;
      break;
    }
    case CornerSideEnum.BottomRight: {
      rawHighlight.value.right = e.clientX - rect?.left;
      rawHighlight.value.bottom = e.clientY - rect?.top;
      break;
    }
    case CornerSideEnum.BottomLeft: {
      rawHighlight.value.left = e.clientX - rect?.left;
      rawHighlight.value.bottom = e.clientY - rect?.top;
      break;
    }
  }
}

function stopEditingHighlight(e: MouseEvent) {
  window.removeEventListener("mousemove", onHoverEditing);
  window.removeEventListener("mouseup", stopEditingHighlight);
  rawHighlight.value = normalizedHighlight.value;

  calcCropArea();
}
//#endregion

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

  const { clientHeight, clientWidth } = layout.value;

  highlightedZone.value = {
    top: Math.ceil((top / clientHeight) * naturalSize?.h),
    left: Math.ceil((left / clientWidth) * naturalSize?.w),
    bottom: Math.ceil((bottom / clientHeight) * naturalSize?.h),
    right: Math.ceil((right / clientWidth) * naturalSize?.w),
  };
}
</script>

<template>
  <div ref="layout" @mousedown="startHighlightning" draggable="false">
    <div
      v-if="isHighlighted"
      class="crop__corner"
      :style="{
        top: `${normalizedHighlight?.top - CORNER_OFFSET_PX}px`,
        left: `${normalizedHighlight?.left - CORNER_OFFSET_PX}px`,
        rotate: `180deg`,
      }"
      @mousedown.stop.prevent="(e) => startEditingHighlight(e, 0)"
    >
      <HandleIcon />
    </div>
    <div
      v-if="isHighlighted"
      class="crop__corner"
      :style="{
        top: `${normalizedHighlight?.top - CORNER_OFFSET_PX}px`,
        left: `${normalizedHighlight?.right - CORNER_SIZE_PX + CORNER_OFFSET_PX}px`,
        rotate: `270deg`,
      }"
      @mousedown.stop.prevent="(e) => startEditingHighlight(e, 1)"
    >
      <HandleIcon />
    </div>
    <div
      v-if="isHighlighted"
      class="crop__corner"
      :style="{
        top: `${normalizedHighlight?.bottom - CORNER_SIZE_PX + CORNER_OFFSET_PX}px`,
        left: `${normalizedHighlight?.right - CORNER_SIZE_PX + CORNER_OFFSET_PX}px`,
      }"
      @mousedown.stop.prevent="(e) => startEditingHighlight(e, 2)"
    >
      <HandleIcon />
    </div>
    <div
      v-if="isHighlighted"
      class="crop__corner"
      :style="{
        top: `${normalizedHighlight?.bottom - CORNER_SIZE_PX + CORNER_OFFSET_PX}px`,
        left: `${normalizedHighlight?.left - CORNER_OFFSET_PX}px`,
        rotate: `90deg`,
      }"
      @mousedown.stop.prevent="(e) => startEditingHighlight(e, 3)"
    >
      <HandleIcon />
    </div>
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

<style lang="scss">
.crop {
  &__highlight {
    position: absolute;
    z-index: 9;

    pointer-events: none;
    border: 1px solid wheat;
    box-shadow: 0 0 0 200vw rgba(1, 1, 1, 0.5);
  }

  &__corner {
    --size: v-bind(CORNER_SIZE_PX + "px");
    position: absolute;
    z-index: 10;
    scale: 1.5;
    cursor: pointer;

    height: var(--size);
    min-height: var(--size);
    width: var(--size);
    min-width: var(--size);
    color: whitesmoke;

    svg:hover {
      color: yellowgreen;
    }
  }
}
</style>
