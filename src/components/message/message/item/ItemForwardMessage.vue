<script lang="ts" setup>
import { computed, ref } from 'vue'
import ForwardRecord from '../../ForwardRecord.vue'
import type { ForwardExtra } from './types'

const props = defineProps<{
  extra: ForwardExtra
  data: any
  maxWidth: Boolean
  pid: string
}>()

const isShowRecord = ref<boolean>(false)

const title = computed(() => {
  return [...new Set(props.extra.records.map(v => v.username))].join(',')
})

const onClick = () => {
  isShowRecord.value = true
}
let pids = props.pid
if (pids == '' || pids == undefined) {
  pids = props.data.id
} else {
  pids = `${pids},${props.data.id}`
}
</script>

<template>
  <section
    class="forward-message"
    @click="onClick"
  >
    <div class="title">
      История переписки с {{ title }}
    </div>
    <div
      v-for="(record, index) in extra.records"
      :key="index"
      class="list"
    >
      <p>
        <span>{{ record.username }}: </span>
        <span>{{ record.text }}</span>
      </p>
    </div>
    <div class="tips">
      <span>Пересылка: История чата ({{ extra.msg_ids.length }} сообщений)</span>
    </div>
    <forward-record
      v-if="isShowRecord"
      :record-id="data.id"
      :pid="pids"
      @close="isShowRecord = false"
    />
  </section>
</template>

<style lang="scss" scoped>
.forward-message {
  width: 250px;
  min-height: 95px;
  max-height: 150px;
  border-radius: 10px;
  padding: 8px 10px;
  border: 1px solid rgb(239 239 245);
  user-select: none;
  background-color: #ffffff;
  cursor: pointer;

  .title {
    height: 30px;
    line-height: 30px;
    font-size: 15px;
    color: #0d1a26;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 400;
    margin-bottom: 5px;
  }

  .list p {
    height: 18px;
    line-height: 18px;
    font-size: 12px;
    color: #a8a8a8;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 5px;
  }

  .tips {
    height: 32px;
    line-height: 35px;
    color: #8a8888;
    border-top: 1px solid var(--el-border-color);
    font-size: 12px;
    margin-top: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
