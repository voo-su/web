<script lang="ts" setup>
import AppLayout from '@/components/app/AppLayout.vue'
import IconLogo from '@/components/icons/IconLogo.vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

const goBack = () => router.push('/')
</script>

<template>
  <app-layout>
    <template #header>
      <el-page-header
        @back="goBack"
        :content="t('terms')"
      />
    </template>
    <template #content>
      <div class="term-container">
        <div class="terms">
          <div class="logo">
            <icon-logo @click="goBack" />
          </div>
          <p>
            {{ t('termsText.text1') }}
          </p>
          <p>
            {{ t('termsText.text2') }}
          </p>
          <p>
            {{ t('termsText.text3') }}
          </p>
        </div>
      </div>
    </template>
  </app-layout>
</template>

<style lang="scss" scoped>
.el-page-header {
  border-bottom: none;
}

.term-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;

  .terms {
    text-align: left;
    max-width: 800px;
    width: 100%;

    .logo {
      text-align: center;
      cursor: pointer;
      margin-bottom: 20px;

      svg {
        width: 90px;
        height: 90px;
      }
    }

    p {
      font-size: 14px;
      margin-bottom: 10px;
    }
  }
}
</style>
