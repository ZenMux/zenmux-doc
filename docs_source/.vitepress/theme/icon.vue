<script setup lang="ts">
interface Props {
  name: string
}

const props = withDefaults(defineProps<Props>(), {
})
</script>

<template>
  <span :class="'el-icon-' + name"
    :style="`--icon: url('https://api.iconify.design/ion/${name}.svg');`"></span>
</template>

<style>
[class^="el-icon-"] {
  display: inline-block;
  width: 1em;
  height: 1em;
  fill: currentColor;
  vertical-align: middle;

  -webkit-mask: var(--icon) no-repeat;
  mask: var(--icon) no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  background-color: currentColor;
  color: inherit;
}
</style>
