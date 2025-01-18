<script lang="ts" setup>
import AppPageHeader from '@/components/app/AppPageHeader.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <app-page-header>
    <template #left>
      <h3 class="title">{{ t('apiBotDoc.title') }}</h3>
    </template>
  </app-page-header>
  <el-main>
    <div class="api-doc">
      <p>{{ t('apiBotDoc.description') }}</p>
      <ul>
        <li>{{ t('apiBotDoc.urlQueryString') }}</li>
        <li>{{ t('apiBotDoc.format') }} <code>application/x-www-form-urlencoded</code></li>
        <li>{{ t('apiBotDoc.format') }} <code>application/json</code> {{ t('apiBotDoc.formatExcludingFileUpload') }}</li>
        <li>{{ t('apiBotDoc.format') }} <code>multipart/form-data</code> {{ t('apiBotDoc.formatForFileUpload') }}</li>
      </ul>
      <p>
        <span>{{ t('apiBotDoc.apiRequestFormat') }}</span>
        <br>
        <code>https://api.voo.su/bot/{{ '{' + t('apiBotDoc.apiYourBotToken') + '}' }}/METHOD_NAME</code>
      </p>
      <span>{{ t('apiBotDoc.forExample') }} <code>GET https://api.voo.su/bot/0123456789/group-chats</code></span>
      <el-divider/>
      <p>GET <code>group-chats</code></p>
      <p>{{ t('apiBotDoc.groupChatsDescription') }}</p>
      <el-divider/>
      <p>POST <code>send/message</code></p>
      <p>{{ t('apiBotDoc.sendMessageDescription') }}</p>
      <h4>{{ t('apiBotDoc.parameters') }}</h4>
      <ul>
        <li><strong>chat_id</strong> (integer): {{ t('apiBotDoc.chatIdForTextMessage') }}</li>
        <li><strong>text</strong> (string): {{ t('apiBotDoc.textMessageContent') }}</li>
      </ul>
      <el-divider/>
      <p>POST <code>send/photo</code></p>
      <p>{{ t('apiBotDoc.sendPhotoDescription') }}</p>
      <h4>{{ t('apiBotDoc.parameters') }}</h4>
      <ul>
        <li><strong>chat_id</strong> (integer): {{ t('apiBotDoc.chatIdForPhoto') }}</li>
        <li><strong>photo</strong> (file): {{ t('apiBotDoc.localImageFile') }}</li>
        <li><strong>caption</strong> (string, optional): {{ t('apiBotDoc.imageCaption') }}</li>
      </ul>
      <el-divider/>
      <p>POST <code>send/video</code></p>
      <p>{{ t('apiBotDoc.sendVideoDescription') }}</p>
      <h4>{{ t('apiBotDoc.parameters') }}</h4>
      <ul>
        <li><strong>chat_id</strong> (integer): {{ t('apiBotDoc.chatIdForVideo') }}</li>
        <li><strong>video</strong> (file): {{ t('apiBotDoc.localVideoFile') }}</li>
        <li><strong>caption</strong> (string, optional): {{ t('apiBotDoc.videoCaption') }}</li>
      </ul>
      <el-divider/>
      <p>POST <code>send/audio</code></p>
      <p>{{ t('apiBotDoc.sendAudioDescription') }}</p>
      <h4>{{ t('apiBotDoc.parameters') }}</h4>
      <ul>
        <li><strong>chat_id</strong> (integer): {{ t('apiBotDoc.chatIdForAudio') }}</li>
        <li><strong>audio</strong> (file): {{ t('apiBotDoc.localAudioFile') }}</li>
        <li><strong>caption</strong> (string, optional): {{ t('apiBotDoc.audioCaption') }}</li>
      </ul>
      <el-divider/>
      <p>POST <code>send/document</code></p>
      <p>{{ t('apiBotDoc.sendDocumentDescription') }}</p>
      <h4>{{ t('apiBotDoc.parameters') }}</h4>
      <ul>
        <li><strong>chat_id</strong> (integer): {{ t('apiBotDoc.chatIdForDocument') }}</li>
        <li><strong>document</strong> (file): {{ t('apiBotDoc.localDocumentFile') }}</li>
        <li><strong>caption</strong> (string, optional): {{ t('apiBotDoc.documentCaption') }}</li>
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
