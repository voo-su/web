<script lang="ts" setup>
// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import IconLogo from '@/components/icons/IconLogo.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => router.push('/')
</script>

<template>
  <el-page-header
    @back="goBack"
    content="Соглашение и правила пользования Voo.su"
    class="navbar-fixed-top"
  />
  <div class="container">
    <div class="main">
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

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  .logo {
    text-align: center;
    cursor: pointer;
    margin-bottom: 20px;

    svg {
      width: 90px;
      height: 90px;
    }
  }

  .main {
    text-align: left;
    max-width: 800px;
    width: 100%;

    p {
      font-size: 14px;
      margin-bottom: 10px;
    }
  }
}
</style>
