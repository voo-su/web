<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { getTaskCommentsApi } from '@/api/project'
import AvatarBox from '../../base/BaseAvatarBox.vue'
import Xtime from '../../base/BaseXtime.vue'

const props = defineProps({
  taskId: {
    type: Number,
    default: 0
  }
})

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

const comments = ref<IItem[]>([])

const load = () => {
  getTaskCommentsApi({
    task_id: props.taskId
  }).then((res: IRes) => {
    if (res.code == 200 && res.data) {
      const { data } = res
      comments.value = data.items || []
    }
  })
}

onMounted(() => {
  load()
})
</script>

<template>
  <div class="comments">
    <div class="header">
      <div class="header_title">
        Комментарии
      </div>
    </div>
    <div class="items">
      <div
        v-for="(item, index) in comments"
        :key="index"
        class="item-card"
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
</template>

<style lang="scss" scoped>
.comments {
  margin: 10px;
  //border-top: 1px solid var(--el-border-color);

  .header {
    margin: 10px;

    &_title {
      line-height: var(--el-dialog-font-line-height);
      font-size: var(--el-dialog-title-font-size);
      color: var(--el-text-color-primary);
    }
  }

  .items {

    .item-card {
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
