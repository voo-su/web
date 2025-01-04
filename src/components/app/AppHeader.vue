<script lang="ts" setup>
import { computed, markRaw, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { useUploadsStore } from '@/store/uploads'
import { useDialogStore } from '@/store'
import {
  ChatRound as IconChatRound,
  Loading as IconLoading,
  Search as IconSearch,
  Setting as IconSetting,
  User as IconUser,
  Memo as MemoUser
} from '@element-plus/icons-vue'
import IconLogo from '@/components/icons/IconLogo.vue'
import AvatarBox from '@/components/base/BaseAvatarBox.vue'
import BaseUploadsModal from '@/components/base/BaseUploadsModal.vue'
import { toggleDark, isDark } from '@/composition/dark'
import IconLight from '@/components/icons/IconLight.vue'
import IconDark from '@/components/icons/IconDark.vue'
import IconExit from '@/components/icons/IconExit.vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  index: {
    type: Number,
    default: 0
  }
})

const { t } = useI18n()
const userStore = useUserStore()
const dialogStore = useDialogStore()
const uploadsStore = useUploadsStore()
const router = useRouter()

const menus = reactive([
  {
    link: '/',
    icon: markRaw(IconChatRound),
    hotspot: computed(() => dialogStore.dialogUnreadNum > 0)
  },
  {
    link: '/contacts',
    icon: markRaw(IconUser),
    hotspot: computed(() => userStore.isContactApply || userStore.isGroupApply)
  },
  {
    link: '/search',
    icon: markRaw(IconSearch),
    hotspot: false
  },
  // {
  //   link: '/projects',
  //   icon: markRaw(MemoUser),
  //   hotspot: null
  // }
])

const onClickMenu = (menu: any) => {
  router.push(menu.link)
}

const onLogout = () => {
  userStore.logoutLogin()
}
</script>

<template>
  <div class="navbar-default navbar-fixed-top">
    <div class="header-fixed">
      <div class="container-fluid">
        <div class="nav-left">
          <div
            class="logo"
            @click="onClickMenu({ link: '/' })"
          >
            <icon-logo />
          </div>
        </div>
        <div class="nav-center">
          <div class="navs">
            <div
              v-for="(nav, i) in menus"
              :key="nav.link"
              :class="{active: i === props.index}"
              class="nav-item"
              @click="onClickMenu(nav)"
            >
              <el-icon :size="20">
                <component :is="nav.icon" />
              </el-icon>
              <div
                v-if="nav.hotspot"
                class="notify"
              />
            </div>
          </div>
        </div>
        <div class="nav-right">
          <div class="nav-account">
            <el-dropdown>
              <avatar-box
                :avatar="userStore.avatar"
                :username="userStore.username"
                :name="userStore.name"
                :surname="userStore.surname"
                class="avatar"
                :size="20"
              />
              <template #dropdown>
                <el-dropdown-menu>
                  <!--                  <el-dropdown-item @click="toggleDark()">-->
                  <!--                    <el-icon :size="18">-->
                  <!--                      <icon-dark v-if="isDark" />-->
                  <!--                      <icon-light v-else />-->
                  <!--                    </el-icon>-->
                  <!--                    {{ t('toggleMode') }}-->
                  <!--                  </el-dropdown-item>-->
                  <el-dropdown-item
                    @click="onClickMenu({ link: '/settings' })"
                  >
                    <el-icon :size="18">
                      <icon-setting />
                    </el-icon>
                    {{ t('settings') }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    divided
                    @click="onLogout"
                  >
                    <el-icon :size="18">
                      <icon-exit />
                    </el-icon>
                    {{ t('logout') }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <div
              v-if="uploadsStore.isShow"
              class="upload-manager"
            >
              <el-popover
                :width="400"
                visible
              >
                <template #reference>
                  <el-icon
                    :size="20"
                    class="is-loading"
                  >
                    <icon-loading />
                  </el-icon>
                </template>
                <template #default>
                  <el-scrollbar always>
                    <base-uploads-modal />
                  </el-scrollbar>
                </template>
              </el-popover>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.navbar-default {
  border: none;
  height: 49px;
  background-color: #ffffff;
  border-bottom: 1px solid var(--el-border-color);

  .header-fixed {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0;

    & > .container-fluid {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 5px;
      //padding-bottom: 5px;
      //padding: 5px 0 10px 0;
      //border-bottom: 1px solid var(--el-border-color);

      .nav-left {
        display: flex;

        .logo {
          margin-top: 5px;
          cursor: pointer;

          svg {
            width: 30px;
            height: 30px;
          }
        }
      }

      .nav-center {
        margin-right: 20px;
        margin-left: 20px;
        width: 100%;
        max-width: 310px;

        .navs {
          flex: auto;
          width: 100%;
          overflow: hidden;
          display: flex;

          .nav-item {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            user-select: none;
            cursor: pointer;
            border-radius: 10px;
            font-size: 12px;
            width: 35px;
            height: 35px;
            //margin: 8px auto 20px;
            margin: 0 auto;
            //color: rgb(184, 184, 184);

            &:hover {
              background-color: #ececec;
            }

            &.active {
              background-color: #2F80ED;
              color: #FFFFFF;
            }

            .notify {
              position: absolute;
              display: inline-block;
              width: 10px;
              height: 10px;
              right: 5px;
              bottom: 6px;
              background: #ff1e1e;
              border-radius: 5px;
              animation: _notifymove 3s infinite;
              animation-direction: alternate;
              -webkit-animation: _notifymove 3s infinite;
            }
          }
        }
      }

      .nav-right {
        float: right !important;

        .nav-account {
          width: 100%;
          display: flex;

          .upload-manager {
            margin: 5px 0 0 10px;
          }

          .avatar {
            cursor: pointer;
          }
        }
      }

    }
  }
}

//@media (min-width: 1350px) {
//  .navbar-default .header-fixed {
//    max-width: 1280px;
//  }
//}
</style>
