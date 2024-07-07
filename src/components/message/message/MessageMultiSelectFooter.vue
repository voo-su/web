<script lang="ts" setup>
import { ref } from 'vue'
import { useDialogueStore } from '@/store/dialogue'
import { Close, Delete, Share } from '@element-plus/icons-vue'
import ContactModal from '@/components/contact/ContactModal.vue'

const dialogueStore = useDialogueStore()
const isShowContactModal = ref(false)
const forwardMode = ref(0)

const onShowContactModal = (type: any) => {
  forwardMode.value = type
  isShowContactModal.value = true
}

const onClose = () => {
  dialogueStore.closeMultiSelect()
}

const onMergeForward = () => {
  if (dialogueStore.selectItems.length) {
    onShowContactModal(2)
  }
}

const onSingleForward = () => {
  if (dialogueStore.selectItems.length) {
    onShowContactModal(1)
  }
}

const onMultiDelete = () => {
  let ids = dialogueStore.selectItems.map((item: any) => item.id)
  if (!ids.length)
    return
  dialogueStore.ApiDeleteRecord(ids)
}

const onContactModal = (data: any) => {
  let ids = dialogueStore.selectItems.map((item: any) => item.id)
  let user_ids = []
  let group_ids = []
  for (const o of data) {
    if (o.type == 1) {
      user_ids.push(o.id)
    } else {
      group_ids.push(o.id)
    }
  }
  dialogueStore.ApiForwardRecord({
    forward_mode: forwardMode.value,
    records_ids: ids.join(','),
    receive_user_ids: user_ids.join(','),
    receive_group_ids: group_ids.join(',')
  })
  isShowContactModal.value = false
}
</script>

<template>
  <section class="section">
    <div class="multi-title">
      <span>Выбрано: {{ dialogueStore.selectItems.length }} сообщений</span>
    </div>
    <div class="multi-groups">
      <div class="btn-group">
        <div
          class="multi-icon flex-center"
          @click="onMergeForward"
        >
          <el-icon :size="22">
            <share />
          </el-icon>
        </div>
        <p>Совместное пересылка</p>
      </div>


      <div class="btn-group">
        <div
          class="multi-icon flex-center"
          @click="onSingleForward"
        >
          <el-icon :size="22">
            <share />
          </el-icon>
        </div>
        <p>Переслать по одному</p>
      </div>


      <div class="btn-group">
        <div
          class="multi-icon flex-center"
          @click="onMultiDelete"
        >
          <el-icon :size="22">
            <delete />
          </el-icon>
        </div>
        <p>Массовое удаление</p>
      </div>


      <div class="btn-group">
        <div
          class="multi-icon flex-center"
          @click="onClose"
        >
          <el-icon :size="22">
            <close />
          </el-icon>
        </div>
        <p>Закрыть</p>
      </div>
    </div>
  </section>
  <contact-modal
    v-model="isShowContactModal"
    @close="isShowContactModal = false"
    @on-submit="onContactModal"
  />
</template>

<style lang="scss" scoped>
.section {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  border-top: 1px solid var(--el-border-color);

  .multi-title {
    width: 100%;
    height: 80px;
    line-height: 80px;
    text-align: center;
    color: #878484;
    font-size: 14px;
  }

  .multi-groups {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;

    .btn-group {
      width: 50px;
      height: 80px;
      margin: 0 15px;

      .multi-icon {
        width: 50px;
        height: 50px;
        background-color: #dcdfe6;
        border-radius: 50%;
        cursor: pointer;

        &:hover {
          background-color: #ff5722;
          color: #fff;
        }
      }

      p {
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        text-align: center;
      }
    }
  }
}
</style>
