export const ChatMsgTypeText: number = 1
export const ChatMsgTypeCode: number = 2
export const ChatMsgTypeImage: number = 3
export const ChatMsgTypeAudio: number = 4
export const ChatMsgTypeVideo: number = 5
export const ChatMsgTypeFile: number = 6
export const ChatMsgTypeLocation: number = 7
export const ChatMsgTypeCard: number = 8
export const ChatMsgTypeForward: number = 9
export const ChatMsgTypeLogin: number = 10
export const ChatMsgTypeVote: number = 11
export const ChatMsgTypeMixed: number = 12

export const ChatMsgSysText: number = 1000
export const ChatMsgSysGroupCreate: number = 1101
export const ChatMsgSysGroupMemberJoin: number = 1102
export const ChatMsgSysGroupMemberQuit: number = 1103
export const ChatMsgSysGroupMemberKicked: number = 1104
export const ChatMsgSysGroupMessageRevoke: number = 1105
export const ChatMsgSysGroupDismissed: number = 1106
export const ChatMsgSysGroupMuted: number = 1107
export const ChatMsgSysGroupCancelMuted: number = 1108
export const ChatMsgSysGroupMemberMuted: number = 1109
export const ChatMsgSysGroupMemberCancelMuted: number = 1110
export const ChatMsgSysGroupNotice: number = 1111
export const ChatMsgSysGroupTransfer: number = 1113

export const ChatMsgTypeMapping = {
  [ChatMsgTypeText]: 'Сообщения',
  [ChatMsgTypeImage]: 'Фотография',
  [ChatMsgTypeAudio]: 'Аудиозапись',
  [ChatMsgTypeVideo]: 'Видео',
  [ChatMsgTypeFile]: 'Файл',
  [ChatMsgTypeLocation]: 'Местоположение',
  [ChatMsgTypeCard]: 'Карточка',
  [ChatMsgTypeForward]: 'Пересланное сообщение',
  [ChatMsgTypeLogin]: 'Уведомление о входе в систему',
  [ChatMsgTypeVote]: 'Опрос',
  [ChatMsgTypeCode]: 'Код',
  [ChatMsgTypeMixed]: 'Фотографии',
  [ChatMsgSysText]: 'Системное сообщение',
  [ChatMsgSysGroupCreate]: 'Создание группы',
  [ChatMsgSysGroupMemberJoin]: 'Присоединение к группе',
  [ChatMsgSysGroupMemberQuit]: 'Выход из группы',
  [ChatMsgSysGroupMemberKicked]: 'Исключение из группы',
  [ChatMsgSysGroupMessageRevoke]: 'Отзыв сообщения',
  [ChatMsgSysGroupDismissed]: 'Роспуск группы',
  [ChatMsgSysGroupMuted]: 'Заглушение группы',
  [ChatMsgSysGroupCancelMuted]: 'Снятие заглушения группы',
  [ChatMsgSysGroupMemberMuted]: 'Заглушение участника группы',
  [ChatMsgSysGroupMemberCancelMuted]: 'Снятие заглушения участника группы',
  [ChatMsgSysGroupNotice]: 'Объявление в группе'
}

export const MessageComponents = {
  [ChatMsgTypeText]: 'text-message',
  [ChatMsgTypeImage]: 'image-message',
  [ChatMsgTypeAudio]: 'audio-message',
  [ChatMsgTypeVideo]: 'video-message',
  [ChatMsgTypeFile]: 'file-message',
  [ChatMsgTypeLocation]: 'location-message',
  [ChatMsgTypeCard]: 'user-card-message',
  [ChatMsgTypeForward]: 'forward-message',
  [ChatMsgTypeLogin]: 'login-message',
  [ChatMsgTypeVote]: 'vote-message',
  [ChatMsgTypeCode]: 'code-message',
  [ChatMsgTypeMixed]: 'mixed-message',
  [ChatMsgSysText]: 'sys-text-message',
  [ChatMsgSysGroupCreate]: 'sys-group-create-message',
  [ChatMsgSysGroupMemberJoin]: 'sys-group-join-message',
  [ChatMsgSysGroupMemberQuit]: 'sys-group-member-quit-message',
  [ChatMsgSysGroupMemberKicked]: 'sys-group-member-kicked-message',
  [ChatMsgSysGroupMemberMuted]: 'sys-group-member-muted-message',
  [ChatMsgSysGroupMemberCancelMuted]: 'sys-group-member-cancel-muted-message',
  [ChatMsgSysGroupTransfer]: 'sys-group-transfer-message',
  [ChatMsgSysGroupMuted]: 'sys-group-muted-message',
  [ChatMsgSysGroupCancelMuted]: 'sys-group-cancel-muted-message',
  [ChatMsgSysGroupNotice]: 'Group-notice-message'
}

export const ForwardableMessageType = [
  ChatMsgTypeText,
  ChatMsgTypeCode,
  ChatMsgTypeImage,
  ChatMsgTypeAudio,
  ChatMsgTypeVideo,
  ChatMsgTypeFile,
  ChatMsgTypeLocation,
  ChatMsgTypeCard
]
