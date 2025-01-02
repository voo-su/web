<script lang="ts" setup>
// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { onMounted, ref, computed } from 'vue'
import { getTaskCommentsApi, createTaskCommentApi } from '@/api/project'
import AvatarBox from '../../base/BaseAvatarBox.vue'
import Xtime from '../../base/BaseXtime.vue'
import Editor from '../../message/editor/Editor.vue'
import { throttle } from '@/utils/common'
import { ElMessage } from 'element-plus'
import { useProjectStore } from '@/store'

const props = defineProps({
  taskId: {
    type: Number,
    default: 0
  }
})

const projectStore = useProjectStore()

interface IItem {
  id: number
  comment: string
  user: {
    avatar: string
    username: string
    name: string
    surname: string
  }
  created_at: string
}

interface IRes {
  code?: number
  data: {
    items: IItem[]
  }
}

const items: any = computed(() => {
  return projectStore.getComments
})

const load = () => {
  projectStore.loadTaskComments(props.taskId)
}

const onSendComment = (data: any = {}, callBack: any) => {
  createTaskCommentApi({
    task_id: props.taskId,
    comment: data.content
  })
    .then(({ code, message }: any) => {
      if (code == 200) {
        callBack(true)
      } else {
        ElMessage.warning(message)
      }
    })
    .catch(() => {
      ElMessage.warning('Сеть перегружена, пожалуйста, попробуйте позже')
    })
}

const onSendTextEvent = throttle(({ data, callBack }: any) => {
  let message = {
    content: data.items[0].content
  }
  onSendComment(message, (ok: boolean) => {
    if (!ok) return

    projectStore.updateCommentItem({
      //  index_name: props.index_name,
      draft_text: ''
    })

    console.log(ok)
    // TODO

    let el = document.getElementById('comments')
    if (el) {
      el.scrollTop = 0
    }

    callBack(true)
  })
}, 1000)

const onSendImageEvent = ({ data, callBack }: any) => {
  console.log(data)
  // TODO
}

const onSendImageAttachEvent = ({ data, callBack }: any) => {
  console.log(data)
  // TODO
}

const onSendVideoEvent = async ({ data }: any) => {
  console.log(data)
  // TODO
}

const onSendAudioEvent = ({ data }: any) => {
  console.log(data)
  // TODO
}

const onSendFileEvent = ({ data }: any) => {
  console.log(data)
  // TODO
}

const onInputEvent = ({ data }: any) => {
  console.log(data)
  // TODO
}

const onSendVoteEvent = ({ data, callBack }: any) => {
  console.log(data)
  // TODO
}

const onSendStickerEvent = ({ data, callBack }: any) => {
  console.log(data)
  // TODO
}

const onSendMixedEvent = ({ data, callBack }: any) => {
  console.log(data)
  // TODO
}

const events: any = {
  text_event: onSendTextEvent,
  image_event: onSendImageEvent,
  image_attach_event: onSendImageAttachEvent,
  video_event: onSendVideoEvent,
  audio_event: onSendAudioEvent,
  file_event: onSendFileEvent,
  input_event: onInputEvent,
  vote_event: onSendVoteEvent,
  sticker_event: onSendStickerEvent,
  mixed_event: onSendMixedEvent
}
const onEditorEvent = (msg: any) => {
  events[msg.event] && events[msg.event](msg)
}

onMounted(() => {
  load()
})
</script>

<template>
  <div class="task-comments">
    <div class="header">
      <div class="header_title">
        Комментарии
      </div>
    </div>
    <el-container class="h-100">
      <div class="section">
        <div id="comments" class="comments scrollbar">
          <div
            v-for="(item, index) in items"
            :key="index"
            class="comment-item"
          >
            <div class="left-item">
              <avatar-box
                :avatar="item.user.avatar"
                :username="item.user.username"
                :name="item.user.name"
                :surname="item.user.surname"
              />
            </div>
            <div class="content">
              <div class="content-header">
                <span class="name">
                  {{ item.comment }}
                </span>
                <div class="datetime">
                  <xtime :time="item.created_at" />
                </div>
              </div>
              <div class="content-comment">
                {{ item.comment }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-container>
    <editor @editor-event="onEditorEvent" />
  </div>
</template>

<style lang="scss" scoped>
.task-comments {
  margin: 10px;
  // height: 400px;
  border-top: 1px solid var(--el-border-color);

  .header {
    margin: 10px;

    &_title {
      line-height: var(--el-dialog-font-line-height);
      font-size: var(--el-dialog-title-font-size);
      color: var(--el-text-color-primary);
    }
  }

  .section {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  .comments {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    padding: 10px 15px 30px;
    overflow-y: auto;
    overflow-x: hidden;

    .comment-item {
      height: 50px;
      display: flex;
      align-items: center;
      margin: 5px;

      .left-item {
        position: relative;
      }

      .content {
        height: 40px;
        display: flex;
        flex-direction: column;
        flex: 1 1;
        margin-left: 10px;

        &-header {
          width: 100%;
          height: 20px;
          display: flex;
          align-items: center;

          .name {
            color: #1f2329;
            font-size: 14px;
            line-height: 20px;
            font-weight: 600;
          }

          .datetime {
            color: #8f959e;
            font-size: 12px;
            margin-left: 10px;
            user-select: none;
          }
        }

        &-comment {
          font-weight: 300;
          font-size: 13px;
          color: #8f959e;
        }
      }
    }
  }
}
</style>
