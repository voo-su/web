<script lang="ts" setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { searchUsersApi } from '@/api/search'
import AppPageHeader from '@/components/app/AppPageHeader.vue'
import SearchCard from '@/components/contact/ContactSearchCard.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits(['update:show'])

const keywords = ref<string>('')

interface IItem {
  id: number
  username: string
  avatar: string
  name: string
  surname: string
}

const items = ref<IItem[]>([])

const onSearchInput = (value: any) => {
  if (value.trim().length >= 2) {
    searchUsersApi({
      q: keywords.value
    }).then((res: any) => {
      if (res.code == 200) {
        items.value = res.data.items || []
      }
    })
  }
}
</script>

<template>
  <default-layout :index="2">
    <el-container class="is-vertical h-100">
      <app-page-header>
        <template #center>
          <el-input
            v-model="keywords"
            :prefix-icon="Search"
            :placeholder="t('searchByUsername')"
            @input="onSearchInput"
          />
        </template>
      </app-page-header>
      <el-main class="scrollbar">
        <div
          v-if="items.length === 0"
          class="empty"
        >
          {{ t('nothingFound') }}
        </div>
        <search-card
          v-else
          v-for="item in items"
          :id="item.id"
          :username="item.username"
          :avatar="item.avatar"
          :name="item.name"
          :surname="item.surname"
        />
      </el-main>
    </el-container>
  </default-layout>
</template>

<style lang="scss" scoped>
.el-container{
  background: #FFFFFF;
  border-radius: 16px;
}
</style>
