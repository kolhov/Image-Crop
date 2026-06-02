<script setup lang="ts">
interface ButtonProps {
  type?: "primary" | "secondary";
}

const { type = "primary" } = defineProps<ButtonProps>();
</script>

<template>
  <button class="btn" :class="type === `primary` ? `btn--primary` : ``">
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
.btn {
  padding: 12px 24px;
  color: black;
  font-size: 17px;

  background-color: aqua;
  border-radius: 12px;
  cursor: pointer;
  opacity: 0.6;
  
  &:hover {
    opacity: 1;
  }

  &:disabled {
    opacity: 0.2;
  }
  
  &--primary {
    opacity: 0.9;
    color: aqua;
    border: none;
    background-color: rgb(149, 50, 255);
  }
}
</style>
