import { defineStore } from 'pinia'
import { getAccountApi } from '@/api/account'
import { findFriendApplyNumApi } from '@/api/contact'
import { delAccessToken } from '@/utils/auth'
import { storage } from '@/utils/storage/local-storage'
import { userInfo } from '@/constants/default'
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
  state: (): IUser => {
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
    updateSocketStatus(status: boolean) {
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
      getAccountApi()
        .then((res: any) => {
          const {
            code,
            data
          } = res
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
            storage.set(userInfo, data)
          }
        })

      findFriendApplyNumApi()
        .then((res: any) => {
          const { code, data } = res
          if (code == 200) {
            this.isContactApply = data.unread_num > 0
          }
        })

      // groupApplyUnreadApi()
      //   .then((res: any) => {
      //     const { code, data } = res
      //     if (code == 200) {
      //       this.isGroupApply = data.unread_num > 0
      //     }
      //   })
    }
  },
  getters: {}
})
