// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { defineStore } from 'pinia'
import { forwardRecordsApi, removeRecordsApi, revokeRecordsApi } from '@/api/message'
import { getGroupMembersApi } from '@/api/group-chat'
import { ElMessage } from 'element-plus'

interface IDialog {
  username: string
  avatar: string
  name: string
  surname: string
  dialog_type: number
  receiver_id: number
}

interface IItems {
  dialog_type: number
  receiver_id: number
  read_sequence: number
  records: any
}

interface IDialogueState {
  chatId: number
  index_name: any
  dialog: IDialog
  is_bot: any
  keyboard: any
  online: any
  records: any
  unreadBubble: any
  isOpenMultiSelect: any
  isShowEditor: any
  isShowSessionList: any
  members: any
  items: IItems[]
}

let keyboardTimeout: any = null

export const useDialogueStore = defineStore('dialogue', {
  state: (): IDialogueState => {
    return {
      chatId: 0,
      index_name: null,
      dialog: {
        username: '',
        avatar: '',
        name: '',
        surname: '',
        dialog_type: 0,
        receiver_id: 0
      },
      is_bot: 0,
      keyboard: false,
      online: false,
      records: [],
      unreadBubble: 0,
      isOpenMultiSelect: false,
      isShowEditor: false,
      isShowSessionList: true,
      members: [],
      items: [
        {
          dialog_type: 1,
          receiver_id: 0,
          read_sequence: 0,
          records: []
        }
      ]
    }
  },

  actions: {
    setOnlineStatus(status: boolean) {
      this.online = status
    },

    setDialogue(data: any = {}) {
      this.chatId = data.id
      this.online = data.is_online == 1
      this.is_bot = data.is_bot
      this.dialog = {
        username: data.username,
        avatar: data.avatar,
        name: data.name,
        surname: data.surname,
        dialog_type: data.dialog_type,
        receiver_id: data.receiver_id
      }
      this.index_name = data.dialog_type + '_' + data.receiver_id
      this.records = []
      this.unreadBubble = 0
      this.isShowEditor = data.is_bot === 0

      if (data.dialog_type == 2) {
        this.updateGroupMembers()
      } else {
        this.members = []
      }
    },

    async updateGroupMembers() {
      const {
        code,
        data
      } = await getGroupMembersApi({
        group_id: this.dialog.receiver_id
      })

      if (code != 200) return
      this.members = []
      for (const o of data.items) {
        this.members.push({
          id: o.user_id,
          username: o.username,
          avatar: o.avatar,
          gender: o.gender,
          leader: o.leader,
          // remark: o.user_card,
          online: false,
          value: o.username
        })
      }
    },

    clearDialogueRecord() {
      this.records = []
    },

    unshiftDialogueRecord(records: any) {
      this.records.unshift(...records)
    },

    addDialogueRecord(record: any) {
      this.records.push(record)
    },

    updateDialogueRecord(params: any) {
      const { msg_id = '' } = params
      const item = this.records.find((item: { msg_id: number }) => item.msg_id === msg_id)
      item && Object.assign(item, params)
    },

    batchDelDialogueRecord(ids: number[]) {
      ids.forEach((id: number) => {
        const index = this.records.findIndex((item: { id: number }) => item.id === id)
        if (index >= 0) this.records.splice(index, 1)
      })
    },

    triggerKeyboard() {
      this.keyboard = true
      clearTimeout(keyboardTimeout)
      keyboardTimeout = setTimeout(() => (this.keyboard = false), 2000)
    },

    setUnreadBubble(value: number) {
      if (value == 0) {
        this.unreadBubble = 0
      } else {
        this.unreadBubble++
      }
    },

    closeMultiSelect() {
      this.isOpenMultiSelect = false
      for (const item of this.selectItems) {
        if (item.isCheck) {
          item.isCheck = false
        }
      }
    },

    deleteRecord(ids: number[] = []) {
      removeRecordsApi({
        dialog_type: this.dialog.dialog_type,
        receiver_id: this.dialog.receiver_id,
        record_id: ids.join(',')
      })
        .then((res: any) => {
          if (res.code == 200) {
            this.batchDelDialogueRecord(ids)
          } else {
            ElMessage.warning(res.message)
          }
        })
    },

    revokeRecord(msg_id: string = '') {
      revokeRecordsApi({ msg_id })
        .then((res: any) => {
          if (res.code == 200) {
            this.updateDialogueRecord({
              msg_id, is_revoke: 1
            })
          } else {
            ElMessage.warning(res.message)
          }
        })
    },

    forwardRecord(options: any) {
      const data = Object.assign(
        {
          dialog_type: this.dialog.dialog_type,
          receiver_id: this.dialog.receiver_id
        },
        options
      )

      forwardRecordsApi(data)
        .then((res: any) => {
          if (res.code == 200) {
            this.closeMultiSelect()
          }
        })
    }
  },

  getters: {
    selectItems: state => state.records.filter((item: any) => item.isCheck),
    isGroupDialog: state => state.dialog.dialog_type === 2
  }
})
