<script lang="ts" setup>
import { computed, onMounted, reactive } from 'vue'
import { confirmVoteHandleApi } from '@/api/chat'
import { useUserStore } from '@/store/user'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  extra: Object,
  data: Object
})

const { t } = useI18n()
const userStore = useUserStore()
const mode = props.extra.detail.answer_mode
const state = reactive<any>({
  options: []
})

const isCanSubmit = computed(() => {
  return state.options.some((item: any) => item.is_checked)
})

const isVoted = computed(() => {
  return props.extra.vote_users.some((item: any) => item == userStore.uid)
})

const setOptions = (options: any) => {
  for (const option of options) {
    state.options.push({
      key: option.key,
      value: option.value,
      is_checked: false,
      num: 0,
      progress: 0
    })
  }
}

const updateStatistics = (data: any) => {
  let { count } = data

  state.options.forEach((option: any) => {
    option.num = data.options[option.key]

    if (count > 0) {
      option.progress = (data.options[option.key] / count) * 100
    }
  })
}

const change = (data: any, option: any) => {
  if (mode == 0) {
    state.options.forEach((option: any) => (option.is_checked = false))
  }

  option.is_checked = data
}

const onSubmit = () => {
  if (!isCanSubmit.value) return

  let items: any = []

  state.options.forEach((item: any) => {
    item.is_checked && items.push(item.key)
  })

  confirmVoteHandleApi({
    record_id: props.data.id,
    options: items.join(',')
  }).then(({ code, data }: any) => {
    if (code == 200) {
      updateStatistics(data)
      props.extra.vote_users.push(userStore.uid)
      props.extra.detail.answered_num++
    }
  })
}

const detail = (detail: any) => detail.answer_anonymous ? t('anonymousPoll') : t('poll')

onMounted(() => {
  setOptions(props.extra.detail.answer_option)
  updateStatistics(props.extra.statistics)
})
</script>

<template>
  <section class="vote-message">
    <div class="from">
      <div class="detail">
        <p>{{ extra.detail.title }}</p>
        <span>{{ detail(extra.detail) }}</span>
      </div>
      <div class="body">
        <template v-if="isVoted">
          <div
            v-for="option in state.options"
            class="view"
          >
            <p class="option">
              {{ option.progress }}% {{ option.value }}
            </p>
            <el-progress
              :percentage="parseInt(option.progress)"
              :show-text="false"
              :text-inside="true"
            />
          </div>
        </template>
        <template v-else>
          <div
            v-for="option in state.options"
            :key="option.key"
            :class="{ radio: mode == 0 }"
            class="option"
          >
            <el-checkbox
              v-model="option.is_checked"
              @change="change(option.is_checked, option)"
            />
            <p
              class="text"
              @click="change(!option.is_checked, option)"
            >
              {{ option.value }}
            </p>
          </div>
          <el-button
            link
            @click="onSubmit"
          >
            {{ t('vote') }}
          </el-button>
        </template>
        <div
          v-if="extra.detail.answered_num >= 1 "
          class="num"
        >
          {{ t('votesCount', { num: extra.detail.answered_num }) }}
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.vote-message {
  width: 300px;
  min-height: 150px;
  box-sizing: border-box;
  border-radius: 10px;
  overflow: hidden;
  background: #F4F4F7;

  .from {
    width: 100%;

    .detail {
      padding: 10px 10px 0 10px;

      p {
        display: flex;
        align-items: center;
        font-size: 12px;
        font-weight: 600;
        user-select: none;
        margin-bottom: 5px;
      }

      span {
        font-weight: 300;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 12px;
        color: #8f959e;
      }
    }

    .body {
      min-height: 80px;
      width: 100%;
      padding: 5px 15px;
      box-sizing: border-box;
      margin-bottom: 10px;

      .num {
        font-weight: 300;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 12px;
        color: #8f959e;
      }

      .option {
        font-size: 13px;
        display: flex;
        flex-direction: row;
        margin-bottom: 5px;

        .el-checkbox {
          margin-right: 0;
          height: 26px;
        }

        .text {
          margin-left: 10px;
          cursor: pointer;
          line-height: 26px;
        }
      }

      .view {
        width: 100%;
        min-height: 30px;
        box-sizing: border-box;
        margin-bottom: 15px;

        .el-progress {
          margin-left: 30px;
        }

        > p {
          margin: 6px 0;
          font-size: 13px;
        }

        .option {
          min-height: 20px;
          line-height: 20px;
        }
      }
    }

    .el-button {
      width: 90%;
      font-weight: 400;
    }
  }

}
</style>
