<script lang="ts" setup>
import AppPageHeader from '@/components/app/AppPageHeader.vue'</script>

<template>
  <app-page-header>
    <template #left>
      <h3 class="title">Bot API</h3>
    </template>
  </app-page-header>
  <el-main>
    <div class="api-doc">

      <h2>Получение списка групповых чатов</h2>
      <h3>Описание</h3>
      Метод позволяет получить список групповых чатов, в которых бот может отправлять сообщения.
      <h3>URL</h3>
      <code>GET https://api.voo.su/bot/{Уникальный токен вашего бота}/group-chats</code>

      <h4>Параметры URL</h4>
      <ul>
        <li>
          <strong>Уникальный токен вашего бота</strong>
        </li>
      </ul>

      <el-divider/>

      <h2>Отправка сообщения</h2>
      <h3>URL</h3>
      <code>POST https://api.voo.su/bot/{Уникальный токен вашего бота}/send</code>

      <h3>Параметры</h3>
      <ul>
        <li>
          <strong>Уникальный токен вашего бота</strong>
        </li>
      </ul>

      <h4>Параметры тела запроса</h4>
      <ul>
        <li><strong>chatId</strong> (integer): Уникальный идентификатор чата, в который будет отправлено сообщение.</li>
        <li><strong>content</strong> (string): Содержимое сообщения, которое нужно отправить.</li>
        <!-- <li><strong>parseMode</strong> (string): (необязательный) Режим парсинга для форматирования текста. Например, "Markdown" или "HTML".</li>-->
      </ul>
    </div>
  </el-main>
</template>

<style lang="scss" scoped>
.el-page-header {
  padding: 10px;

  h3.title {
    border-bottom: none;
  }
}

.api-doc {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  padding: 20px;

  code {
    background-color: #f4f4f4;
    padding: 2px 4px;
    border-radius: 4px;
  }

  pre {
    background-color: #f4f4f4;
    padding: 10px;
    border-radius: 4px;
    overflow-x: auto;
  }

  ul {
    margin: 10px 0;
    padding-left: 20px;
  }
}

</style>
