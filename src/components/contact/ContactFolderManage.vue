<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { contactFoldersApi, contactFolderSaveApi } from '@/api/contact'
import { Delete as IconDelete, Plus as IconPlus } from '@element-plus/icons-vue'
import { ElDialog } from 'element-plus'
import { ElMessage } from 'element-plus'

const isShowBox = ref(true)
const emit = defineEmits(['close', 'relaod'])

interface Item {
  id: number
  index: number
  name: string
  count: number
}

const options = reactive<Item[]>([])

let index = 1

const onLoad = async () => {
  let { code, data } = await contactFoldersApi()
  if (code != 200) return
  let items = data.items || []
  for (const item of items) {
    if (item.id) {
      options.push({
        id: item.id,
        name: item.name,
        index: index++,
        count: item.count
      })
    }
  }
  if (!options.length) {
    options.push({
      id: 0,
      name: '',
      index: index++,
      count: 0
    })
  }
}

const onSubmit = () => {
  contactFolderSaveApi({items: options})
    .then((res: any) => {
      const {code, message} = res
      if (code == 200) {
        ElMessage.success('Успешно')
        emit('relaod')
        emit('close')
      } else {
        ElMessage.error(message)
      }
    })
}

const addOption = () => {
  options.push({
    name: '',
    id: 0,
    index: index++,
    count: 0
  })
}

const delOption = (item: Item) => {
  let fn = () => {
    let i = options.findIndex(value => value.index == item.index)
    if (i >= 0) {
      options.length > 0 && options.splice(i, 1)
    }
  }
  if (item.count > 0) {
    ElDialog.create({
      title: '',
      content: `В папке ${item.name} есть ${item.count} контакты. Вы уверены, что хотите удалить ?`,
      positiveText: 'Ок',
      negativeText: 'Отмена',
      onPositiveClick: () => {
        fn()
      }
    })
  } else {
    fn()
  }
}

const onCloseClick = () => {
  emit('close')
}
const isCanSubmit = computed(() => {
  return options.some((item: Item) => item.name.trim().length === 0)
})

onLoad()
</script>

<template>
  <el-dialog
    v-model="isShowBox"
    :before-close="onCloseClick"
    title="Папки с контактами"
    width="30%"
  >
    <el-container class="launch-box">
      <div class="options">
        <div
          v-for="(item, index) in options"
          class="option"
          :key="index"
        >
          <el-input
            v-model="item.name"
            placeholder="Введите название папки"
          />
          <el-button
            @click="delOption(item)"
            :icon="IconDelete"
            class="btn"
            link
          />
        </div>
        <el-button
          v-if="options.length < 6"
          :icon="IconPlus"
          class="btn plus"
          link
          @click="addOption"
        >
          Еще
        </el-button>
      </div>
    </el-container>
    <template #footer>
      <div class="footer">
        <el-button
          @click="isShowBox = false"
        >
          Отмена
        </el-button>
        <el-button
          :disabled="isCanSubmit"
          class="ml-15"
          type="primary"
          @click="onSubmit"
        >
          Сохранить
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.launch-box {
  margin: 20px;

  .options {
    width: 100%;

    .option {
      margin: 8px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      user-select: none;
    }

    .btn {
      width: 30px;
      height: 30px;
      margin-left: 3px;
      cursor: pointer;

      &.plus {
        margin-left: auto;
        display: flex;
      }
    }
  }
}

.footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 15px;
  border-top: 1px solid var(--el-border-color);
}
</style>
