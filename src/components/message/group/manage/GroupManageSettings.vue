<script lang="ts" setup>
// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { reactive } from 'vue'
import { dismissGroupApi, groupDetailApi, muteGroupApi, overtGroupApi } from '@/api/group-chat'
import { ElMessage } from 'element-plus'

const props = defineProps({
  id: {
    type: Number,
    default: 0
  }
})
const emit = defineEmits(['close'])

const detail = reactive({
  is_mute: false,
  mute_loading: false,
  is_overt: false,
  overt_loading: false
})

const onLoadData = () => {
  groupDetailApi({
    group_id: props.id
  })
    .then((res: any) => {
      if (res.code == 200) {
        detail.is_mute = res.data.is_mute == 1
        detail.is_overt = res.data.is_overt == 1
      }
    })
}

const onDismiss = () => {
  dismissGroupApi({
    group_id: props.id
  })
    .then((res: any) => {
      if (res.code == 200) {
        ElMessage.success('Группа удалена')
        emit('close')
      } else {
        ElMessage.info(res.message)
      }
    })
}

const onMute = (value: any) => {
  detail.mute_loading = true
  muteGroupApi({
    group_id: props.id,
    mode: detail.is_mute ? 2 : 1
  })
    .then((res: any) => {
      const {
        code,
        message
      } = res
      if (code == 200) {
        detail.is_mute = value
      } else {
        ElMessage.info(message)
      }
    })
    .finally(() => {
      detail.mute_loading = false
    })
}

const onOvert = (value: any) => {
  detail.overt_loading = true
  overtGroupApi({
    group_id: props.id,
    mode: detail.is_overt ? 2 : 1
  })
    .then((res: any) => {
      const { code, message } = res
      if (code == 200) {
        detail.is_overt = value
      } else {
        ElMessage.info(message)
      }
    })
    .finally(() => {
      detail.overt_loading = false
    })
}

onLoadData()
</script>

<template>
  <el-container class="section is-vertical h-100">
    <el-header class="header">
      <p>Настройки</p>
    </el-header>
    <el-main class="main">
      <el-form
        label-placement="left"
        label-width="auto"
      >
        <el-form-item label="Открытая группа">
          <el-switch
            :loading="detail.overt_loading"
            v-model="detail.is_overt"
            @change="onOvert"
          />
        </el-form-item>
        <el-form-item label="Запретить писать сообщения">
          <el-switch
            :loading="detail.mute_loading"
            v-model="detail.is_mute"
            @change="onMute"
          />
        </el-form-item>
        <div class="t-center">
          <el-popconfirm
            title="Вы действительно хотите удалить группу ?"
            width="350"
            confirm-button-text="Удалить"
            cancel-button-text="Отмена"
            @confirm="onDismiss"
          >
            <template #reference>
              <el-button
                type="danger"
                text
                >
                  Удалить группу
              </el-button>
            </template>
          </el-popconfirm>
        </div>
      </el-form>
    </el-main>
  </el-container>
</template>

<style lang="scss" scoped>
.header {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid var(--el-border-color);
}

.el-main {
  height: 406px;
  padding: 15px;
  box-sizing: border-box;
}
</style>
