# albumTeka 🎵

**🇬🇧 [English version available below](#english-version)**

[![Статус сборки](https://github.com/denis290788/albumTeka/actions/workflows/ci.yml/badge.svg)](https://github.com/denis290788/albumTeka/actions/workflows/main.yml)
[![Развернуто на Vercel](https://vercelbadge.vercel.app/api/denis290788/albumTeka)](https://album-teka.vercel.app/)
[![Лицензия MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Testing Library](https://img.shields.io/badge/-TestingLibrary-%23E33332?style=flat&logo=testing-library&logoColor=white)](https://testing-library.com/)
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
-   🌐 Русская и английская версии интерфейса

## 🛠️ Стек технологий

-   **Фреймворк:** [Next.js 15](https://nextjs.org/)
-   **UI:** [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/)
-   **State Management:** [Redux Toolkit + RTK Query](https://redux-toolkit.js.org/)
-   **Бэкенд:** [Firebase Auth](https://firebase.google.com/products/auth), [Firestore](https://firebase.google.com/products/firestore)
-   **Тестирование:** [Jest](https://jestjs.io/), [Testing Library](https://testing-library.com/)
-   **CI:** GitHub Actions (с автоматическим прогоном тестов перед сборкой)
-   **CD:** [Vercel](https://vercel.com/)

## 🚀 Демо

Живая версия доступна по адресу: [album-teka.vercel.app](http://album-teka.vercel.app/)

**Обзор интерфейса главной страницы (переключение плееров)** <details><summary>📹 Показать видео (нажмите чтобы развернуть)</summary>
<video src="https://github.com/user-attachments/assets/975db5f5-3f5f-458a-954a-742a4142fae4" width="800" controls></video></details>

**Добавление папки / сортировка папок / добавление альбома в папку** <details><summary>📹 Показать видео (нажмите чтобы развернуть)</summary>
<video src="https://github.com/user-attachments/assets/2742b6b2-4d71-4b32-b906-358bccd05064" width="800" controls></video></details>

**Поиск альбомов / добавление и удаление плеера / переключение цветовой темы** <details><summary>📹 Показать видео (нажмите чтобы развернуть)</summary>
<video src="https://github.com/user-attachments/assets/e2f990e7-f37c-47e6-9bff-34c433ca1619" width="800" controls></video></details>

**Пагинация списка / шаринг альбома между пользователями** <details><summary>📹 Показать видео (нажмите чтобы развернуть)</summary>
<video src="https://github.com/user-attachments/assets/65029231-0599-40d1-965f-9db0ad4c8fe2" width="800" controls></video></details>

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

3. Создайте файл `.env.local` в корневой директории проекта на основе `.env.example` и добавьте переменные окружения для Firebase (вам потребуется создать проект в Firebase)

4. Запустите проект:

```bash
yarn dev
или
npm run dev
```

5. Откройте http://localhost:3000

## 🧪 Тестирование

Проект покрыт юнит-тестами с использованием современных инструментов тестирования:

-   **Тест-раннер:** [Jest](https://jestjs.io/)
-   **Тестирование компонентов:** [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
-   **Тестирование запросов:** [MSW (Mock Service Worker)](https://mswjs.io/)

**Покрытие тестами:**

-   Компоненты React
-   Бизнес-логика приложения
-   Работа с API

Запуск тестов:

```bash
yarn test  # Для разработки (watch mode)
yarn test:ci  # Для CI (с покрытием)
```

## 🤝 Как внести вклад

1. Форкните репозиторий
2. Создайте ветку `git checkout -b feature/AmazingFeature`
3. Сделайте коммит `git commit -m 'Add some AmazingFeature'`
4. Запушьте `git push origin feature/AmazingFeature`
5. Откройте Pull Request

## 🗺 Планы на будущее

-   Комментарии и оценки
-   Редактирование карточки альбома/папки
-   Улучшение дизайна
-   Сортировка альбомов
-   Настройки пользователя

## 📄 Лицензия

Этот проект распространяется под лицензией MIT.

💻 Разработчик: [denis290788](https://github.com/denis290788)
🔧 Версия: 1.0.0

---

<a id="english-version"></a>

# albumTeka 🎵

Your personal music catalog where you can collect favorite albums, organize them into your audio library, and listen to music directly from various streaming services! The app is already available online at: [album-teka.vercel.app](https://album-teka.vercel.app/)

## ✨ About The Project

albumTeka is a web application designed for music lovers who want to have all their favorite albums in one place. You can add album cards, attach players from popular streaming platforms (SoundCloud, Bandcamp, Spotify, VK), and create folders for convenient organization of your collection.

The project is built with scalability in mind, so new features and integrations are planned for the future.

## 🚀 Features

-   ✅ Create music album cards
-   🔗 Support for players from Spotify, SoundCloud, Bandcamp, VK Music
-   📂 Organize albums into folders
-   🎛️ Drag-n-drop folder sorting
-   🔍 Search through albums and artists
-   🌙 Dark/light theme
-   📤 Album sharing for unregistered users
-   🔒 Authentication via Firebase
-   🔐 Personal library for authorized users
-   📱 **PWA mode**: can be installed as a PWA app
-   🌐 Russian and English interface versions

## 🛠️ Tech Stack

-   **Framework:** [Next.js 15](https://nextjs.org/)
-   **UI:** [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/)
-   **State Management:** [Redux Toolkit + RTK Query](https://redux-toolkit.js.org/)
-   **Backend:** [Firebase Auth](https://firebase.google.com/products/auth), [Firestore](https://firebase.google.com/products/firestore)
-   **Testing:** [Jest](https://jestjs.io/), [Testing Library](https://testing-library.com/)
-   **CI:** GitHub Actions (with automatic test runs before build)
-   **CD:** [Vercel](https://vercel.com/)

## 🚀 Demo

Live version is available at: [album-teka.vercel.app](http://album-teka.vercel.app/)

**Main page interface overview (player switching)** <details><summary>📹 Show video (click to expand)</summary>
<video src="https://github.com/user-attachments/assets/975db5f5-3f5f-458a-954a-742a4142fae4" width="800" controls></video></details>

**Adding a folder / sorting folders / adding an album to a folder** <details><summary>📹 Show video (click to expand)</summary>
<video src="https://github.com/user-attachments/assets/2742b6b2-4d71-4b32-b906-358bccd05064" width="800" controls></video></details>

**Album search / adding and removing a player / color theme switching** <details><summary>📹 Show video (click to expand)</summary>
<video src="https://github.com/user-attachments/assets/e2f990e7-f37c-47e6-9bff-34c433ca1619" width="800" controls></video></details>

**List pagination / album sharing between users** <details><summary>📹 Show video (click to expand)</summary>
<video src="https://github.com/user-attachments/assets/65029231-0599-40d1-965f-9db0ad4c8fe2" width="800" controls></video></details>

## 🛠️ Installation & Setup

1.  Clone the repository:

```bash
git clone https://github.com/denis290788/albumTeka.git
cd albumTeka
```

1. Install dependencies:

```bash
yarn install
or
npm install
```

3. Create a `.env.local` file in the project root based on `.env.example` and add your Firebase environment variables (you'll need to create a Firebase project)

4. Run the project:

```bash
yarn dev
or
npm run dev
```

5. Open http://localhost:3000

## 🧪 Testing

The project is covered with unit tests using modern testing tools:

-   **Test Runner:** [Jest](https://jestjs.io/)
-   **Component Testing:** [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
-   **API Testing:** [MSW (Mock Service Worker)](https://mswjs.io/)

**Test Coverage:**

-   React Components
-   Application Business Logic
-   API Interactions

Run tests:

```bash
yarn test  # For development (watch mode)
yarn test:ci  # For CI (with coverage)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch `git checkout -b feature/AmazingFeature`
3. Commit your changes `git commit -m 'Add some AmazingFeature'`
4. Push to the branch `git push origin feature/AmazingFeature`
5. Open a Pull Request

## 🗺 Future Plans

-   Comments and ratings
-   Album/folder card editing
-   Design improvements
-   Album sorting
-   User settings

## 📄 License

This project is distributed under the MIT License.

💻 Developer: [denis290788](https://github.com/denis290788)
🔧 Version: 1.0.0
