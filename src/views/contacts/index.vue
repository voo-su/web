<script lang="ts" setup>
import { computed, inject, onMounted, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import ContactUserCard from '@/components/contact/ContactUserCard.vue'
import ContactMemberCard from '@/components/contact/ContactMemberCard.vue'
import AppPageHeader from '@/components/app/AppPageHeader.vue'
import { modal } from '@/utils/common'
import { toDialog } from '@/utils/dialog'
import { useUserStore } from '@/store/user'
import { contactFoldersApi, getContactListApi } from '@/api/contact'
import ContactTopMenu from '@/components/contact/ContactTopMenu.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
// import ContactFolderManage from '@/components/contact/ContactFolderManage.vue'
// import { Files as IconFiles } from '@element-plus/icons-vue'

const emit = defineEmits(['close'])
const user: any = inject('$user')

// const isShowFolderManageModal = ref<boolean>(false)

const userStore = useUserStore()
const keywords = ref<string>('')
const index = ref<number>(0)
const items = ref<any>([])

// interface IFolder {
//   label: string
//   value: string
// }
//
// const folders = ref<IFolder[]>([])

const filter: any = computed(() => {
  return items.value.filter((item: any) => {
    let value = /*item.remark ||*/ item.username
    let findIndex = value.toLowerCase().indexOf(keywords.value.toLowerCase())
    if (index.value == 0) {
      return findIndex != -1
    }
    return findIndex != -1 && index.value == item.group_id
  })
})

const onLoad = () => {
  getContactListApi().then((res: any) => {
    if (res.code == 200) {
      items.value = res.data.items || []
    }
  })
}

// const onLoadFolders = () => {
//   contactFoldersApi().then((res: any) => {
//     if (res.code == 200) {
//       let items = res.data.items.map((item: any) => {
//         return {
//           label: `${item.name} (${item.count})`,
//           value: item.id,
//         }
//       })
//       folders.value = items || []
//     }
//   })
// }

const onToDialog = (item: any) => {
  toDialog(1, item.id)
}

const onInfo = (item: any) => {
  // user(item.id, () =>{
  //   emit('close')
  // })

  modal(ContactUserCard, {
    uid: parseInt(item.id)
  },
    () => emit('close')
  )
}

onMounted(() => {
  onLoad()
  // onLoadFolders()
})

// const onFolders = () => {
//   isShowFolderManageModal.value = true
// }
</script>

<template>
  <default-layout :index="1">
    <el-container class="is-vertical h-100">
      <app-page-header>
        <template #content>
          Контакты
        </template>
        <template #extra>
          <el-input
            v-model="keywords"
            :prefix-icon="Search"
            placeholder="Поиск"
          />
        </template>
      </app-page-header>
      <contact-top-menu/>
<!--      <div class="contact-folders">-->
<!--        <el-segmented-->
<!--          v-model="index"-->
<!--          :options="folders"-->
<!--        />-->
<!--        <el-button-->
<!--          :icon="IconFiles"-->
<!--          link-->
<!--          @click="onFolders()"-->
<!--        />-->
<!--      </div>-->
      <div
        v-if="filter.length"
        class="items"
      >
        <contact-member-card
          v-for="item in filter"
          :about="item.about"
          :avatar="item.avatar"
          :gender="item.gender"
          :name="item.name"
          :surname="item.surname"
          :username="/*item.remark ||*/ item.username"
          @click="onInfo(item)"
          @to-dialog="onToDialog(item)"
        />
      </div>
      <el-main v-else>
        <div class="empty">
          Ничего не найдено.
        </div>
      </el-main>
    </el-container>
  </default-layout>
<!--  <contact-folder-manage-->
<!--    v-model="isShowFolderManageModal"-->
<!--    @close="isShowFolderManageModal = false"-->
<!--    @relaod="onLoadFolders"-->
<!--  />-->
</template>

<style lang="scss" scoped>
.contact-folders {
  padding: 5px 0 0 5px;

  .el-segmented {
    --el-segmented-padding: 4px;
    min-height: 30px;
    font-size: 13px;
    --el-border-radius-base: 4px;
    --el-segmented-bg-color: transparent;
  }
}

.el-container {
  background: #FFFFFF;
  border-radius: 16px;
}

.from-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
}

.items {
  display: block;
  flex: 1;
  flex-basis: auto;
  overflow: auto;
  padding: 10px;
}
</style>
