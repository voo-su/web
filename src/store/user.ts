import { defineStore } from 'pinia'
import { getAccountSettingApi } from '@/api/account'
import { findFriendApplyNumApi } from '@/api/contact'
import { delAccessToken } from '@/utils/auth'
import { storage } from '@/utils/storage/local-storage'
import { userInfo } from '@/constants/default'
import { logoutApi } from '@/api/auth'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      uid: 0,
      username: '',
      avatar: '',
      name: '',
      surname: '',
      gender: 0,
      email: '',
      about: '',
      online: false,
      isContactApply: false,
      isGroupApply: false
    }
  },
  // persist: true,
  actions: {
    updateSocketStatus(status) {
      this.online = status
    },

    logoutLogin() {
      this.$reset()

      logoutApi().then((res: any) => {
        console.log(res)
      })

      storage.remove(userInfo)
      delAccessToken()
      location.reload()
    },

    loadSetting() {
      getAccountSettingApi()
        .then((res: any) => {
          const {
            code,
            data
          } = res
          if (code == 200) {
            const { user_info } = data
            const {
              uid,
              username,
              avatar,
              name,
              surname,
              gender,
              email,
              about
              // is_qiye
            } = user_info
            this.uid = uid
            this.username = username
            this.avatar = avatar
            this.name = name
            this.surname = surname
            this.gender = gender
            this.email = email || ''
            this.about = about
            storage.set(userInfo, user_info)
          }
        })

      findFriendApplyNumApi()
        .then((res: any) => {
          const {
            code,
            data
          } = res
          if (code == 200) {
            this.isContactApply = data.unread_num > 0
          }
        })

      // groupApplyUnreadApi().then(({ code, data }) => {
      //   if (code == 200) {
      //     this.isGroupApply = data.unread_num > 0
      //   }
      // })
    }
  },
  getters: {}
})
