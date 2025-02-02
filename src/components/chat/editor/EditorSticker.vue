<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useEditorStore } from '@/store/editor'
import { Upload as IconUpload, Delete as IconDelete } from '@element-plus/icons-vue'
import { emojiList as emoji } from '@/utils/emojis'

const emit = defineEmits(['on-select'])
const editorStore = useEditorStore()

const fileImageRef = ref<any>()
const tabIndex = ref<number>(0)

const items = computed(() => editorStore.sticker.items)

const onTriggerUpload = () => {
  fileImageRef.value.click()
}

const onUpload = (e: any) => {
  let file = e.target.files[0]
  editorStore.uploadUserSticker(file)
}

const onDelete = (index: number, id: number) => {
  editorStore.removeUserSticker({
    index,
    id
  })
}

const onTabs = (index: number) => {
  tabIndex.value = index
}

const onSendSticker = (type: number, value: string, img: string = '') => {
  if (img) {
    const imgSrcReg: RegExp = /<img.*?src='(.*?)'/g
    let match = imgSrcReg.exec(img)
    if (match) {
      emit('on-select', {
        type,
        value,
        img: match[1]
      })
    }
  } else {
    emit('on-select', {
      type,
      value,
      img
    })
  }
}
</script>

<template>
  <form
    enctype="multipart/form-data"
    style="display: none"
  >
    <input
      ref="fileImageRef"
      accept="image/*"
      type="file"
      @change="onUpload"
    >
  </form>
  <el-container class="is-vertical section h-100">
    <el-header class="sticker-header">
      <span>{{ items[tabIndex].name }}</span>
    </el-header>
    <el-main class="sticker-main scrollbar">
      <div
        v-if="tabIndex == 0"
        class="emoji-box"
      >
        <div class="options">
          <div
            v-for="img in emoji.emojis"
            class="option flex-center"
            @click="onSendSticker(1, img)"
            v-text="img"
          />
        </div>
      </div>
      <div v-else class="collect-box">
        <div
          v-if="tabIndex == 1"
          class="item upload-btn"
          @click="onTriggerUpload"
        >
          <el-icon>
            <IconUpload />
          </el-icon>
        </div>
        <div
          v-for="(item, index) in items[tabIndex].children"
          :key="index"
          class="item"
        >
          <img
            :src="item.src"
            @click="onSendSticker(2, item.media_id)"
          >
          <div
            v-if="tabIndex == 1"
            class="mask"
            @click="onDelete(index, item.media_id)"
          >
            <el-icon>
              <IconDelete />
            </el-icon>
          </div>
        </div>
      </div>
    </el-main>
    <el-footer class="sticker-footer tabs">
      <div
        v-for="(item, index) in items"
        :key="index"
        :class="{ active: index == tabIndex }"
        class="tab"
        @click="onTabs(index)"
      >
        <p class="tip">
          {{ item.name }}
        </p>
        <img
          :src="item.icon"
          height="20"
          width="20"
        >
      </div>
    </el-footer>
  </el-container>
</template>

<style lang="scss" scoped>
.section {
  height: 250px;
  overflow: hidden;
  background-color: white;
  border-radius: 3px;

  .sticker-header {
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    border-bottom: 1px solid var(--el-border-color);
  }

  .sticker-main {
    height: 100px;
    padding-bottom: 20px;

    .collect-box {
      display: flex;
      flex-wrap: wrap;

      .upload-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }

      .item {
        position: relative;
        width: 65px;
        height: 65px;
        background-color: #eff1f7;
        margin: 2px;
        cursor: pointer;

        .mask {
          display: none;
          position: absolute;
          top: 0;
          right: 0;
          width: 25px;
          height: 25px;
          background-color: #dcdfe6;
          align-items: center;
          justify-content: center;
        }

        &:hover {
          .mask {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }

  .sticker-footer {
    height: 32px;
    background-color: #dcdfe6;

    &.tabs {
      display: flex;
      align-items: center;

      .tab {
        position: relative;
        height: 26px;
        width: 26px;
        background-color: transparent;
        margin: 2px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        &.active {
          background-color: white;
        }

        .tip {
          position: absolute;
          left: 0;
          top: -32px;
          height: 26px;
          min-width: 20px;
          white-space: pre;
          padding: 0 5px;
          font-size: 12px;
          border-radius: 2px;
          background-color: rgba(31, 35, 41, 0.9);
          color: white;
          display: none;
          align-items: center;
        }

        &:hover {
          background-color: #dfdcdc;

          .tip {
            display: flex;
          }
        }
      }
    }
  }

  .emoji-box {
    .options {
      width: 100%;
      display: flex;
      flex-wrap: wrap;

      .option {
        height: 32px;
        width: 32px;
        margin: 2px;
        font-size: 24px;
        user-select: none;
        transition: all 0.5s;
        cursor: pointer;

        &:hover {
          transform: scale(1.3);
        }
      }
    }
  }
}
</style>
