<script lang="ts" setup>
const props = defineProps({
  extra: Object,
  data: Object
})
</script>

<template>
  <div class="text">
    {{ data.msg_type }} Неизвестный тип сообщения
  </div>
</template>

<style lang="scss" scoped>
.text {
  height: 35px;
  line-height: 35px;
  padding: 10px;
  border-radius: 20px;
  color: #979191;
  background: #eff0f1;
  text-align: center;
  font-weight: 300;
}
</style>
