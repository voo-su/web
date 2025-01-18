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
        content="Соглашение и правила пользования"
      />
    </template>
    <template #content>
      <div class="term-container">
        <div class="terms">
          <div class="logo">
            <icon-logo @click="goBack" />
          </div>
          <p>
            Настоящее Соглашение регламентирует отношения между Администрацией информационного ресурса «Voo.su» и
            физическим лицом, которое ищет и распространяет информацию на данном ресурсе.
          </p>
          <p>
            Информационный ресурс «Voo.su» не является средством массовой информации, Администрация ресурса не осуществляет
            редактирование размещаемой информации и не несет ответственность за ее содержание.
          </p>
          <p>
            Пользователь, разместивший информацию на ресурсе «Voo.su», самостоятельно представляет и защищает свои
            интересы, возникающие в связи с размещением указанной информации, в отношениях с третьими лицами.
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
  height: 100vh;

  .terms {
    margin: 10px auto;
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
