<script lang="ts" setup>
// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import AppPageHeader from '@/components/app/AppPageHeader.vue'
</script>

<template>
  <app-page-header>
    <template #left>
      <h3 class="title">Bot API</h3>
    </template>
  </app-page-header>
  <el-main>
    <div class="api-doc">
      <p>
        Существуют четыре способа передачи параметров в запросах к API бота:
      </p>
      <ul>
        <li>Строка запроса в URL (URL query string)</li>
        <li>Формат <code>application/x-www-form-urlencoded</code></li>
        <li>Формат <code>application/json</code> (за исключением загрузки файлов)</li>
        <li>Формат <code>multipart/form-data</code> (используется для загрузки файлов)</li>
      </ul>
      <p>
        <span>Все запросы к API бота должны выполняться через HTTPS в следующем формате:</span>
        <br>
        <code>https://api.voo.su/bot/{Уникальный токен вашего бота}/METHOD_NAME</code>
      </p>
      <span>
        Например: <code>GET https://api.voo.su/bot/0123456789/group-chats</code>
      </span>
      <el-divider/>

      <p>
        GET
        <code>group-chats</code>
      </p>
      <p>Метод позволяет получить список групповых чатов, в которых бот может отправлять сообщения.</p>

      <el-divider/>

      <p>
        POST
        <code>send/message</code>
      </p>
      <p>Метод позволяет отправить текстовое сообщение в указанный чат.</p>
      <h4>Параметры</h4>
      <ul>
        <li><strong>chat_id</strong> (integer): Уникальный идентификатор чата, в который будет отправлено сообщение.</li>
        <li><strong>text</strong> (string): Содержимое текстового сообщения, которое необходимо отправить в чат.</li>
      </ul>

      <el-divider/>

      <p>
        POST
        <code>send/photo</code>
      </p>
      <p>Метод позволяет отправить фото в указанный чат.</p>
      <h4>Параметры</h4>
      <ul>
        <li><strong>chat_id</strong> (integer): Уникальный идентификатор чата, в который будет отправлено фото.</li>
        <li><strong>photo</strong> (file): Локальный файл изображения, который будет отправлен.</li>
        <li><strong>caption</strong> (string, optional): Подпись к изображению. Этот параметр необязателен.</li>
      </ul>

      <el-divider/>

      <p>
        POST
        <code>send/video</code>
      </p>
      <p>Метод позволяет отправить видео в указанный чат.</p>
      <h4>Параметры</h4>
      <ul>
        <li><strong>chat_id</strong> (integer): Уникальный идентификатор чата, в который будет отправлено видео.</li>
        <li><strong>video</strong> (file): Локальный файл видео, который будет отправлен.</li>
        <li><strong>caption</strong> (string, optional): Подпись к видео. Этот параметр необязателен.</li>
      </ul>

      <el-divider/>

      <p>
        POST
        <code>send/audio</code>
      </p>
      <p>Метод позволяет отправить аудиофайл в указанный чат.</p>
      <h4>Параметры</h4>
      <ul>
        <li><strong>chat_id</strong> (integer): Уникальный идентификатор чата, в который будет отправлено аудио.</li>
        <li><strong>audio</strong> (file): Локальный аудиофайл, который будет отправлен.</li>
        <li><strong>caption</strong> (string, optional): Подпись к аудиофайлу. Этот параметр необязателен.</li>
      </ul>

      <el-divider/>

      <p>
        POST
        <code>send/document</code>
      </p>
      <p>Метод позволяет отправить документ (например, PDF, текстовый файл и другие) в указанный чат.</p>
      <h4>Параметры</h4>
      <ul>
        <li><strong>chat_id</strong> (integer): Уникальный идентификатор чата, в который будет отправлен документ.</li>
        <li><strong>document</strong> (file): Локальный файл документа, который будет отправлен.</li>
        <li><strong>caption</strong> (string, optional): Подпись к документу. Этот параметр необязателен.</li>
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

  h2 {
    font-size: 20px;
    margin-top: 32px;
    margin-bottom: 10px;
  }

  p {
    margin: 5px 0;
  }

  code {
    background-color: #f4f4f4;
    padding: 2px 4px;
    border-radius: 4px;
  }

  ul {
    margin: 5px 0;
    padding-left: 20px;
  }
}
</style>
