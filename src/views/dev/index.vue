<script lang="ts" setup>
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

      <h2>Получение списка групповых чатов</h2>
      <h3>Описание</h3>
      Метод позволяет получить список групповых чатов, в которых бот может отправлять сообщения.
      <h3>URL</h3>
      <code>GET https://api.voo.su/bot/{Уникальный токен вашего бота}/group-chats</code>

      <el-divider/>

      <h2>Отправка сообщения</h2>
      <h3>Описание</h3>
      Метод позволяет отправить текстовое сообщение в указанный чат.
      <h3>URL</h3>
      <code>POST https://api.voo.su/bot/{Уникальный токен вашего бота}/send/message</code>

      <h4>Тип контента запроса</h4>
      <ul>
        <li><strong>Content-Type:</strong> <code>application/x-www-form-urlencoded</code></li>
      </ul>

      <h4>Параметры тела запроса</h4>
      <ul>
        <li><strong>chat_id</strong> (integer): Уникальный идентификатор чата, в который будет отправлено сообщение.</li>
        <li><strong>text</strong> (string): Содержимое текстового сообщения, которое необходимо отправить в чат.</li>
      </ul>

      <el-divider/>

      <h2>Отправка фото</h2>
      <h3>Описание</h3>
      Метод позволяет отправить фото в указанный чат.
      <h3>URL</h3>
      <code>POST https://api.voo.su/bot/{Уникальный токен вашего бота}/send/photo</code>

      <h4>Тип контента запроса</h4>
      <ul>
        <li><strong>Content-Type:</strong> <code>multipart/form-data</code></li>
      </ul>

      <h4>Параметры тела запроса</h4>
      <ul>
        <li><strong>chat_id</strong> (integer): Уникальный идентификатор чата, в который будет отправлено фото.</li>
        <li><strong>photo</strong> (file): Локальный файл изображения, который будет отправлен.</li>
        <li><strong>caption</strong> (string, optional): Подпись к изображению. Этот параметр необязателен.</li>
      </ul>

      <el-divider/>

      <h2>Отправка видео</h2>
      <h3>Описание</h3>
      Метод позволяет отправить видео в указанный чат.
      <h3>URL</h3>
      <code>POST https://api.voo.su/bot/{Уникальный токен вашего бота}/send/video</code>

      <h4>Тип контента запроса</h4>
      <ul>
        <li><strong>Content-Type:</strong> <code>multipart/form-data</code></li>
      </ul>

      <h4>Параметры тела запроса</h4>
      <ul>
        <li><strong>chat_id</strong> (integer): Уникальный идентификатор чата, в который будет отправлено видео.</li>
        <li><strong>video</strong> (file): Локальный файл видео, который будет отправлен.</li>
        <li><strong>caption</strong> (string, optional): Подпись к видео. Этот параметр необязателен.</li>
      </ul>

      <el-divider/>

      <h2>Отправка аудио</h2>
      <h3>Описание</h3>
      Метод позволяет отправить аудиофайл в указанный чат.
      <h3>URL</h3>
      <code>POST https://api.voo.su/bot/{Уникальный токен вашего бота}/send/audio</code>

      <h4>Тип контента запроса</h4>
      <ul>
        <li><strong>Content-Type:</strong> <code>multipart/form-data</code></li>
      </ul>

      <h4>Параметры тела запроса</h4>
      <ul>
        <li><strong>chat_id</strong> (integer): Уникальный идентификатор чата, в который будет отправлено аудио.</li>
        <li><strong>audio</strong> (file): Локальный аудиофайл, который будет отправлен.</li>
        <li><strong>caption</strong> (string, optional): Подпись к аудиофайлу. Этот параметр необязателен.</li>
      </ul>

      <el-divider/>

      <h2>Отправка документа</h2>
      <h3>Описание</h3>
      Метод позволяет отправить документ (например, PDF, текстовый файл и другие) в указанный чат.
      <h3>URL</h3>
      <code>POST https://api.voo.su/bot/{Уникальный токен вашего бота}/send/document</code>

      <h4>Тип контента запроса</h4>
      <ul>
        <li><strong>Content-Type:</strong> <code>multipart/form-data</code></li>
      </ul>

      <h4>Параметры тела запроса</h4>
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
