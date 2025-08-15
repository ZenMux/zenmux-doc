<script setup lang="ts">
import { useAttrs, computed } from 'vue'
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const passthroughAttrs = computed(() => {
  const { class: _c, style: _s, ...rest } = attrs
  return rest
})

interface Props {
  name: string
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
})

const className = computed(() => ['el-icon-' + props.name, (attrs.class || ''), props.className || ''].join(' ').trim())
const style = computed(() => ({
  '--icon': `url('https://api.iconify.design/ion/${props.name}.svg')`,
  ...(attrs.style as Record<string, string>)
}))
</script>

<template>
  <span
    :class="className"
    :style="style"
    v-bind="passthroughAttrs"
  ></span>
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
