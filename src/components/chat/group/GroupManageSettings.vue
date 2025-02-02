<script lang="ts" setup>
import { reactive } from 'vue'
import { dismissGroupApi, groupDetailApi, muteGroupApi, overtGroupApi } from '@/api/group-chat'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  id: {
    type: Number,
    default: 0
  }
})
const emit = defineEmits(['close'])

const { t } = useI18n()
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
    .then(({ code, data }: any) => {
      if (code == 200) {
        detail.is_mute = data.is_mute == 1
        detail.is_overt = data.is_overt == 1
      }
    })
}

const onDismiss = () => {
  dismissGroupApi({
    group_id: props.id
  })
    .then(({ code, message }: any) => {
      if (code == 200) {
        ElMessage.success(t('groupDeleted'))
        emit('close')
      } else {
        ElMessage.info(message)
      }
    })
}

const onMute = (value: any) => {
  detail.mute_loading = true
  muteGroupApi({
    group_id: props.id,
    mode: detail.is_mute ? 2 : 1
  })
    .then(({ code, message }: any) => {
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
    .then(({ code, message }: any) => {
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
      <p>{{ t('groupSettings') }}</p>
    </el-header>
    <el-main class="main">
      <el-form
        label-placement="left"
        label-width="auto"
      >
        <el-form-item :label="t('openGroup')">
          <el-switch
            :loading="detail.overt_loading"
            v-model="detail.is_overt"
            @change="onOvert"
          />
        </el-form-item>
        <el-form-item :label="t('prohibitMessages')">
          <el-switch
            :loading="detail.mute_loading"
            v-model="detail.is_mute"
            @change="onMute"
          />
        </el-form-item>
        <div class="t-center">
          <el-popconfirm
            :title="t('confirmDeleteGroup')"
            width="350"
            :confirm-button-text="t('delete')"
            :cancel-button-text="t('cancelAction')"
            @confirm="onDismiss"
          >
            <template #reference>
              <el-button
                type="danger"
                text
                >
                  {{ t('deleteGroup') }}
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
