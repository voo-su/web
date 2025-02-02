import { i18n } from '@/utils/i18n'

const t = i18n()

export const chatMsgTypeText: number = 1
export const chatMsgTypeCode: number = 2
export const chatMsgTypeImage: number = 3
export const chatMsgTypeAudio: number = 4
export const chatMsgTypeVideo: number = 5
export const chatMsgTypeFile: number = 6
export const chatMsgTypeLocation: number = 7
export const chatMsgTypeCard: number = 8
export const chatMsgTypeForward: number = 9
export const chatMsgTypeLogin: number = 10
export const chatMsgTypeVote: number = 11
export const chatMsgTypeMixed: number = 12

export const chatMsgSysText: number = 1000
export const chatMsgSysGroupCreate: number = 1101
export const chatMsgSysGroupMemberJoin: number = 1102
export const chatMsgSysGroupMemberQuit: number = 1103
export const chatMsgSysGroupMemberKicked: number = 1104
export const chatMsgSysGroupMessageRevoke: number = 1105
export const chatMsgSysGroupDismissed: number = 1106
export const chatMsgSysGroupMuted: number = 1107
export const chatMsgSysGroupCancelMuted: number = 1108
export const chatMsgSysGroupMemberMuted: number = 1109
export const chatMsgSysGroupMemberCancelMuted: number = 1110
export const chatMsgSysGroupAds: number = 1111
export const chatMsgSysGroupTransfer: number = 1113

export const chatMsgTypeMapping = {
  [chatMsgTypeText]: t('message'),
  [chatMsgTypeImage]: t('photo'),
  [chatMsgTypeAudio]: t('audioRecording'),
  [chatMsgTypeVideo]: t('video'),
  [chatMsgTypeFile]: t('file'),
  [chatMsgTypeLocation]: t('location'),
  [chatMsgTypeCard]: t('card'),
  [chatMsgTypeForward]: t('forwardedMessage'),
  [chatMsgTypeLogin]: t('loginNotification'),
  [chatMsgTypeVote]: t('poll'),
  [chatMsgTypeCode]: t('code'),
  [chatMsgTypeMixed]: t('photos'),
  [chatMsgSysText]: t('systemMessage'),
  [chatMsgSysGroupCreate]: t('groupCreation'),
  [chatMsgSysGroupMemberJoin]: t('groupJoin'),
  [chatMsgSysGroupMemberQuit]: t('groupLeave'),
  [chatMsgSysGroupMemberKicked]: t('groupExclusion'),
  [chatMsgSysGroupMessageRevoke]: t('messageRevoke'),
  [chatMsgSysGroupDismissed]: t('groupDissolution'),
  [chatMsgSysGroupMuted]: t('groupNotificationsOff'),
  [chatMsgSysGroupCancelMuted]: t('groupNotificationsOn'),
  [chatMsgSysGroupMemberMuted]: t('memberNotificationsOff'),
  [chatMsgSysGroupMemberCancelMuted]: t('memberNotificationsOn'),
  [chatMsgSysGroupAds]: t('groupAnnouncement')
}

export const messageComponents = {
  [chatMsgTypeText]: 'text-message',
  [chatMsgTypeImage]: 'image-message',
  [chatMsgTypeAudio]: 'audio-message',
  [chatMsgTypeVideo]: 'video-message',
  [chatMsgTypeFile]: 'file-message',
  [chatMsgTypeLocation]: 'location-message',
  [chatMsgTypeCard]: 'user-card-message',
  [chatMsgTypeForward]: 'forward-message',
  [chatMsgTypeLogin]: 'login-message',
  [chatMsgTypeVote]: 'vote-message',
  [chatMsgTypeCode]: 'code-message',
  [chatMsgTypeMixed]: 'mixed-message',
  [chatMsgSysText]: 'sys-text-message',
  [chatMsgSysGroupCreate]: 'sys-group-create-message',
  [chatMsgSysGroupMemberJoin]: 'sys-group-join-message',
  [chatMsgSysGroupMemberQuit]: 'sys-group-member-quit-message',
  [chatMsgSysGroupMemberKicked]: 'sys-group-member-kicked-message',
  [chatMsgSysGroupMemberMuted]: 'sys-group-member-muted-message',
  [chatMsgSysGroupMemberCancelMuted]: 'sys-group-member-cancel-muted-message',
  [chatMsgSysGroupTransfer]: 'sys-group-transfer-message',
  [chatMsgSysGroupMuted]: 'sys-group-muted-message',
  [chatMsgSysGroupCancelMuted]: 'sys-group-cancel-muted-message',
  [chatMsgSysGroupAds]: 'group-ads-message'
}

export const forwardableMessageType = [
  chatMsgTypeText,
  chatMsgTypeCode,
  chatMsgTypeImage,
  chatMsgTypeAudio,
  chatMsgTypeVideo,
  chatMsgTypeFile,
  chatMsgTypeLocation,
  chatMsgTypeCard
]
