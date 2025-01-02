// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

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
  [chatMsgTypeText]: 'Сообщение',
  [chatMsgTypeImage]: 'Фотография',
  [chatMsgTypeAudio]: 'Аудиозапись',
  [chatMsgTypeVideo]: 'Видео',
  [chatMsgTypeFile]: 'Файл',
  [chatMsgTypeLocation]: 'Местоположение',
  [chatMsgTypeCard]: 'Карточка',
  [chatMsgTypeForward]: 'Пересланное сообщение',
  [chatMsgTypeLogin]: 'Уведомление о входе в систему',
  [chatMsgTypeVote]: 'Опрос',
  [chatMsgTypeCode]: 'Код',
  [chatMsgTypeMixed]: 'Фотографии',
  [chatMsgSysText]: 'Системное сообщение',
  [chatMsgSysGroupCreate]: 'Создание группы',
  [chatMsgSysGroupMemberJoin]: 'Присоединение к группе',
  [chatMsgSysGroupMemberQuit]: 'Выход из группы',
  [chatMsgSysGroupMemberKicked]: 'Исключение из группы',
  [chatMsgSysGroupMessageRevoke]: 'Отзыв сообщения',
  [chatMsgSysGroupDismissed]: 'Роспуск группы',
  [chatMsgSysGroupMuted]: 'Отключение уведомлений в группе',
  [chatMsgSysGroupCancelMuted]: 'Включение уведомлений в группе',
  [chatMsgSysGroupMemberMuted]: 'Отключение уведомлений для участника группы',
  [chatMsgSysGroupMemberCancelMuted]: 'Включение уведомлений для участника группы',
  [chatMsgSysGroupAds]: 'Объявление в группе'
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
  [chatMsgSysGroupAds]: 'Group-ads-message'
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
