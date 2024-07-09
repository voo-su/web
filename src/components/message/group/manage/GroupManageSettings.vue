<script lang="ts" setup>
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
