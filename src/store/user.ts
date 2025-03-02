import { defineStore } from 'pinia'
import { getAccountApi } from '@/api/account'
import { findFriendApplyNumApi } from '@/api/contact'
import { delAccessToken } from '@/utils/auth'
import { storage } from '@/utils/storage/local-storage'
import { USER_INFO } from '@/constants/default'
import { logoutApi } from '@/api/auth'

interface IUser {
  uid: number
  username: string
  avatar: string
  name: string
  surname: string
  gender: number
  email: string
  about: string
  online: boolean
  isContactApply: boolean
  isGroupApply: boolean
}

export const useUserStore = defineStore('user', {
  state: (): IUser => ({
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
  }),
  // persist: true,
  actions: {
    updateSocketStatus(status: boolean) {
      this.online = status
    },

    logoutLogin() {
      this.$reset()

      logoutApi().then((res: any) => {
        console.log(res)
      })

      storage.remove(USER_INFO)
      delAccessToken()
      location.reload()
    },

    loadSetting() {
      getAccountApi()
        .then(({ code, data }: any) => {
          if (code == 200) {
            const {
              id,
              username,
              avatar,
              name,
              surname,
              gender,
              email,
              about
            } = data
            this.uid = id
            this.username = username
            this.avatar = avatar
            this.name = name
            this.surname = surname
            this.gender = gender
            this.email = email || ''
            this.about = about
            storage.set(USER_INFO, data)
          }
        })

      findFriendApplyNumApi()
        .then(({ code, data }: any) => {
          if (code == 200) {
            this.isContactApply = data.unread_num > 0
          }
        })

      // groupApplyUnreadApi()
      //   .then(({ code, data }: any) => {
      //     if (code == 200) {
      //       this.isGroupApply = data.unread_num > 0
      //     }
      //   })
    }
  },
  getters: {}
})
