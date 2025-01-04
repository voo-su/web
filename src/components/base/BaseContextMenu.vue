<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'

const props = defineProps(['x', 'y', 'options'])
const emit = defineEmits(['select', 'click-outside'])
const show = ref<boolean>(false)
const panel = ref()

const init = (value: any) => {
  const el = panel.value
  if (el) {
    //const rect = el.getBoundingClientRect()
    el.style.left = value.x + 'px'
    el.style.top = value.y + 'px'
    show.value = true
  }
}

const event = (e: any) => {
  const el = panel.value
  if (el && !el.contains(e.target)) {
    emit('click-outside')
  }
}

watch(props, init)

onMounted(() => init(props))

window.addEventListener('mousedown', e => event(e))
window.addEventListener('wheel', e => event(e))
window.addEventListener('keydown', e => event(e))
</script>

<template>
  <div
    v-show="show"
    ref="panel"
    class="context-menu"
  >
    <div
      v-for="(item, index) in props.options"
      :key="index"
      class="menu-item"
      @click="emit('select', item.key)"
    >
      <el-icon>
        <component :is="item.icon" />
      </el-icon>
      {{ item.label }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.context-menu {
  position: absolute;
  z-index: 2000;
  backdrop-filter: blur(10px);
  box-shadow: 0 0.25rem 0.5rem 0.125rem rgb(114, 114, 114, 0.251);
  border-radius: 0.75rem;
  padding: 0.25rem 0;
  min-width: 13.5rem;

  .menu-item {
    display: flex;
    align-items: center;
    position: relative;
    line-height: 1.5rem;
    color: rgb(0, 0, 0);
    cursor: pointer;
    font-size: 0.875rem;
    margin: 0.125rem 0.25rem;
    padding: 0.25rem;
    border-radius: 0.375rem;
    transform: scale(1);
    transition: 0.15s ease-in-out transform;

    .el-icon {
      max-width: 1.25rem;
      font-size: 1.25rem;
      margin: 0 0.5rem;
    }

    &:hover, &:focus, &:active {
      background: rgb(0, 0, 0, 0.067);
      text-decoration: none;
    }
  }
}
</style>
