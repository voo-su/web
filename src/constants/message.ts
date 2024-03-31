export const ChatMsgTypeText = 1
export const ChatMsgTypeCode = 2
export const ChatMsgTypeImage = 3
export const ChatMsgTypeAudio = 4
export const ChatMsgTypeVideo = 5
export const ChatMsgTypeFile = 6
export const ChatMsgTypeLocation = 7
export const ChatMsgTypeCard = 8
export const ChatMsgTypeForward = 9
export const ChatMsgTypeLogin = 10
export const ChatMsgTypeVote = 11
export const ChatMsgTypeMixed = 12

export const ChatMsgSysText = 1000
export const ChatMsgSysGroupCreate = 1101
export const ChatMsgSysGroupMemberJoin = 1102
export const ChatMsgSysGroupMemberQuit = 1103
export const ChatMsgSysGroupMemberKicked = 1104
export const ChatMsgSysGroupMessageRevoke = 1105
export const ChatMsgSysGroupDismissed = 1106
export const ChatMsgSysGroupMuted = 1107
export const ChatMsgSysGroupCancelMuted = 1108
export const ChatMsgSysGroupMemberMuted = 1109
export const ChatMsgSysGroupMemberCancelMuted = 1110
export const ChatMsgSysGroupNotice = 1111
export const ChatMsgSysGroupTransfer = 1113

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
