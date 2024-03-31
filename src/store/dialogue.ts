import { defineStore } from 'pinia'
import { removeRecordsApi, revokeRecordsApi } from '@/api/message'
import { getGroupMembersApi } from '@/api/group-chat'

let keyboardTimeout = null

export const useDialogueStore = defineStore('dialogue', {
  state: () => {
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
    setOnlineStatus(status) {
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
      } = await getGroupMembersApi({ group_id: this.dialog.receiver_id })

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

    unshiftDialogueRecord(records) {
      this.records.unshift(...records)
    },

    addDialogueRecord(record) {
      this.records.push(record)
    },

    updateDialogueRecord(params) {
      const { msg_id = '' } = params
      const item = this.records.find(item => item.msg_id === msg_id)
      item && Object.assign(item, params)
    },

    batchDelDialogueRecord(ids) {
      ids.forEach(id => {
        const index = this.records.findIndex(item => item.id === id)
        if (index >= 0) this.records.splice(index, 1)
      })
    },

    triggerKeyboard() {
      this.keyboard = true
      clearTimeout(keyboardTimeout)
      keyboardTimeout = setTimeout(() => (this.keyboard = false), 2000)
    },

    setUnreadBubble(value) {
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

    ApiDeleteRecord(ids = []) {
      removeRecordsApi({
        dialog_type: this.dialog.dialog_type,
        receiver_id: this.dialog.receiver_id,
        record_id: ids.join(',')
      }).then(res => {
        if (res.code == 200) {
          this.batchDelDialogueRecord(ids)
        } else {
          window['$message'].warning(res.message)
        }
      })
    },

    ApiRevokeRecord(msg_id = '') {
      revokeRecordsApi({ msg_id }).then(res => {
        if (res.code == 200) {
          this.updateDialogueRecord({ msg_id, is_revoke: 1 })
        } else {
          window['$message'].warning(res.message)
        }
      })
    }
  },
  getters: {
    selectItems: state => state.records.filter(item => item.isCheck),
    isGroupDialog: state => state.dialog.dialog_type === 2
  }
})
