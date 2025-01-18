// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

export default {
  lang: 'Русский',
  selectYourLang: 'Выберите ваш язык',
  loginOrRegister: 'Вход или регистрация',
  email: 'email',
  login: 'Войти',
  terms: 'Правила',
  developers: 'Разработчикам',

  success: 'Успешно',
  failed: 'Не удалось',
  botApi: 'Bot API',
  botManager: 'Менеджер ботов',
  newBot: 'Новый бот',
  createBot: 'Создание бота',
  usernameRequired: 'Поле «Имя пользователя» должно быть заполнено',
  usernameSuffix: 'Имя пользователя должно заканчиваться на "_bot" или "bot"',
  username: 'Имя пользователя',
  token: 'Токен',
  save: 'Сохранить',
  sessionExpired: 'Ваша текущая сессия истекла. Пожалуйста, выполните вход заново.',
  apiBotDoc: {
    title: 'Документация API бота',
    description: 'Существуют четыре способа передачи параметров в запросах к API бота:',
    urlQueryString: 'Строка запроса в URL (URL query string)',
    apiRequestFormat: 'Все запросы к API бота должны выполняться через HTTPS в следующем формате:',
    apiRequestExample: 'https://api.voo.su/bot/{Уникальный токен вашего бота}/METHOD_NAME',
    format: 'Формат',
    formatExcludingFileUpload: '(за исключением загрузки файлов)',
    formatForFileUpload: '(используется для загрузки файлов)',
    forExample: 'Например:',
    parameters: 'Параметры',
    groupChatsDescription: 'Метод позволяет получить список групповых чатов, в которых бот может отправлять сообщения.',
    sendMessageDescription: 'Метод позволяет отправить текстовое сообщение в указанный чат.',
    chatIdForTextMessage: 'Уникальный идентификатор чата, в который будет отправлено сообщение.',
    textMessageContent: 'Содержимое текстового сообщения, которое необходимо отправить в чат.',
    sendPhotoDescription: 'Метод позволяет отправить фото в указанный чат.',
    chatIdForPhoto: 'Уникальный идентификатор чата, в который будет отправлено фото.',
    localImageFile: 'Локальный файл изображения, который будет отправлен.',
    imageCaption: 'Подпись к изображению. Этот параметр необязателен.',
    sendVideoDescription: 'Метод позволяет отправить видео в указанный чат.',
    chatIdForVideo: 'Уникальный идентификатор чата, в который будет отправлено видео.',
    localVideoFile: 'Локальный файл видео, который будет отправлен.',
    videoCaption: 'Подпись к видео. Этот параметр необязателен.',
    sendAudioDescription: 'Метод позволяет отправить аудиофайл в указанный чат.',
    chatIdForAudio: 'Уникальный идентификатор чата, в который будет отправлено аудио.',
    localAudioFile: 'Локальный аудиофайл, который будет отправлен.',
    audioCaption: 'Подпись к аудиофайлу. Этот параметр необязателен.',
    sendDocumentDescription: 'Метод позволяет отправить документ (например, PDF, текстовый файл и другие) в указанный чат.',
    chatIdForDocument: 'Уникальный идентификатор чата, в который будет отправлен документ.',
    localDocumentFile: 'Локальный файл документа, который будет отправлен.',
    documentCaption: 'Подпись к документу. Этот параметр необязателен.'
  },

  xgplayer: {
    LANG: 'ru',
    TEXT: {
      ERROR_TYPES: {
        network: {
          code: 1,
          msg: 'ошибка загрузки видео'
        },
        mse: {
          code: 2,
          msg: 'ошибка добавления потока'
        },
        parse: {
          code: 3,
          msg: 'ошибка разбора данных'
        },
        format: {
          code: 4,
          msg: 'неправильный формат'
        },
        decoder: {
          code: 5,
          msg: 'ошибка декодирования'
        },
        runtime: {
          code: 6,
          msg: 'грамматические ошибки'
        },
        timeout: {
          code: 7,
          msg: 'истекло время ожидания воспроизведения'
        },
        other: {
          code: 8,
          msg: 'другие ошибки'
        }
      },
      HAVE_NOTHING: 'Нет информации о готовности аудио/видео',
      HAVE_METADATA: 'Метаданные аудио/видео готовы',
      HAVE_CURRENT_DATA: 'Доступны данные о текущем местоположении проигрывания, но недостаточно данных для воспроизведения следующего кадра/миллисекунды',
      HAVE_FUTURE_DATA: 'Доступны текущие данные и как минимум один кадр',
      HAVE_ENOUGH_DATA: 'Достаточно данных для начала воспроизведения',
      NETWORK_EMPTY: 'Аудио/видео не инициализированы',
      NETWORK_IDLE: 'Аудио/видео активны и выбраны для загрузки, но сеть не используется',
      NETWORK_LOADING: 'Браузер загружает данные',
      NETWORK_NO_SOURCE: 'Не найден источник аудио/видео',
      MEDIA_ERR_ABORTED: 'Процесс загрузки был прерван пользователем',
      MEDIA_ERR_NETWORK: 'Произошла ошибка при загрузке',
      MEDIA_ERR_DECODE: 'Произошла ошибка при декодировании',
      MEDIA_ERR_SRC_NOT_SUPPORTED: 'Аудио/видео не поддерживается',
      REPLAY: 'Повторить',
      ERROR: 'Сеть недоступна',
      PLAY_TIPS: 'Воспроизвести',
      PAUSE_TIPS: 'Пауза',
      PLAYNEXT_TIPS: 'Воспроизвести следующий',
      DOWNLOAD_TIPS: 'Скачать',
      ROTATE_TIPS: 'Повернуть',
      RELOAD_TIPS: 'Перезагрузить',
      FULLSCREEN_TIPS: 'На весь экран',
      EXITFULLSCREEN_TIPS: 'Выйти из полноэкранного режима',
      CSSFULLSCREEN_TIPS: 'CSS-полноэкранный режим',
      EXITCSSFULLSCREEN_TIPS: 'Выйти из CSS-полноэкранного режима',
      TEXTTRACK: 'Субтитры',
      PIP: 'PIP (картинка в картинке)',
      SCREENSHOT: 'Снимок экрана',
      LIVE: 'В прямом эфире',
      OFF: 'Выкл.',
      OPEN: 'Открыть',
      MINI_DRAG: 'Нажмите и удерживайте для перемещения',
      MINISCREEN: 'Мини-экран',
      REFRESH_TIPS: 'Пожалуйста, попробуйте снова',
      REFRESH: 'Обновить',
      FORWARD: 'Вперед',
      LIVE_TIP: 'Прямой эфир'
    }
  }
}
