# albumTeka 🎵

[![Статус сборки](https://github.com/denis290788/albumTeka/actions/workflows/ci.yml/badge.svg)](https://github.com/denis290788/albumTeka/actions/workflows/main.yml)
[![Развернуто на Vercel](https://vercelbadge.vercel.app/api/denis290788/albumTeka)](https://album-teka.vercel.app/)
[![Лицензия MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Технологии: React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Технологии: Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Технологии: TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Технологии: Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Технологии: Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

Ваш личный музыкальный каталог, где вы можете собирать любимые альбомы, организовывать их в свою аудиотеку и слушать музыку прямо из разных стриминговых сервисов! Приложение уже доступно онлайн по адресу: [album-teka.vercel.app](https://album-teka.vercel.app/)

## ✨ О проекте

albumTeka – это веб-приложение, разработанное для меломанов, которые хотят иметь все свои любимые альбомы в одном месте. Вы можете добавлять карточки альбомов, прикреплять к ним плееры из популярных стриминговых платформ (SoundCloud, Bandcamp, Spotify, VK), а также создавать папки для удобной организации вашей коллекции.

Проект создан с учетом расширяемости, поэтому в будущем планируется добавление новых функций и интеграций.

## 🚀 Особенности

-   ✅ Создание карточек музыкальных альбомов
-   🔗 Поддержка плееров из Spotify, SoundCloud, Bandcamp, VK Music
-   📂 Организация альбомов в папки
-   🎛️ Drag-n-drop сортировка папок
-   🔍 Поиск по альбомам и исполнителям
-   🌙 Темная/светлая тема
-   📤 Шаринг альбомов для незарегистрированных пользователей
-   🔒 Аутентификация через Firebase
-   🔐 Персональная библиотека для авторизованных пользователей
-   📱 **PWA-режим**: можно установить как PWA приложение

## 🚀 Демо

Живая версия доступна по адресу: [album-teka.vercel.app](http://album-teka.vercel.app/)

## 🛠️ Стек технологий

-   **Фреймворк:** [Next.js 15](https://nextjs.org/)
-   **UI:** [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/)
-   **State Management:** [Redux Toolkit + RTK Query](https://redux-toolkit.js.org/)
-   **Бэкенд:** [Firebase Auth](https://firebase.google.com/products/auth), [Firestore](https://firebase.google.com/products/firestore)
-   **CI:** GitHub Actions
-   **CD:** [Vercel](https://vercel.com/)

## 🛠️ Установка и запуск

1. Клонируйте репозиторий:

```bash
git clone https://github.com/denis290788/albumTeka.git
cd albumTeka
```

1. Установите зависимости:

```bash
yarn install
или
npm install
```

3. Создайте файл .env.local в корневой директории проекта и добавьте переменные окружения для Firebase (вам потребуется создать проект в Firebase и получить соответствующие ключи)

4. Запустите проект:

```bash
yarn dev
или
npm run dev
```

5. Откройте http://localhost:3000

## 🤝 Как внести вклад

1. Форкните репозиторий
2. Создайте ветку (git checkout -b feature/AmazingFeature)
3. Сделайте коммит (git commit -m 'Add some AmazingFeature')
4. Запушьте (git push origin feature/AmazingFeature)
5. Откройте Pull Request

## 🗺 Планы на будущее

-   Комментарии и оценки
-   Поддержка английской версии
-   Редактирование карточки альбома/папки
-   Улучшение дизайна
-   Сортировка альбомов
-   Настройки пользователя

## 📄 Лицензия

Этот проект распространяется под лицензией MIT.

💻 Разработчик: [denis290788](https://github.com/denis290788)
🔧 Версия: 1.0.0
