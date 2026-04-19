# react-hook-form-zod-mui

Учебное SPA на **React 19** и **Vite 8**: форма пользователя с **Material UI**, валидацией через **Zod** и **react-hook-form**, загрузкой и сохранением данных через **TanStack Query** и **Axios**.

## Возможности

- Создание и редактирование пользователя: список слева, форма справа.
- Поля: имя, email, штаты (до 2), языки, пол, навыки (до 2), дата и время регистрации, период бывшей работы (диапазон дат), зарплатный диапазон (слайдер), переключатель «учитель» и динамический список студентов при `isTeacher === true`.
- Схема формы и типы выводятся из одного **Zod**-схемы (`src/users/types/schema.ts`); отправка на API через `mapData` (`src/users/utils/mapData.ts`).
- В режиме разработки подключён **React Hook Form DevTools** (`UsersProvider`).

## Стек

| Область        | Технологии                                      |
| -------------- | ----------------------------------------------- |
| Сборка         | Vite, TypeScript, React Compiler (Babel preset) |
| UI             | MUI 9, Emotion, MUI X Date Pickers / Pro        |
| Форма          | react-hook-form, @hookform/resolvers (zod)      |
| Валидация      | Zod 4                                           |
| Данные         | TanStack Query v5, Axios                        |
| Даты           | date-fns                                        |

## Требования

- **Node.js** с поддержкой текущих версий зависимостей (рекомендуется актуальный LTS).
- Запущенный **REST API** с базовым URL, заданным в переменной окружения (см. ниже). В репозитории рядом лежит демо-бэкенд на **json-server** (`../back`, порт **8080**).

## Переменные окружения

Приложение читает `VITE_API_URL` при старте. Если переменная не задана, модуль `src/config/env.ts` выбросит ошибку.

Создайте файл `.env` в корне каталога `front`:

```env
VITE_API_URL=http://localhost:8080
```

Подставьте свой URL без завершающего слэша (код сам добавляет путь вида `/users`, `/states` и т.д.).

## Установка и скрипты

```bash
npm install
npm run dev      # dev-сервер Vite (по умолчанию http://localhost:5173)
npm run build    # tsc -b && vite build
npm run preview  # предпросмотр production-сборки
npm run lint     # ESLint
```

## Запуск вместе с демо API

1. В каталоге `../back`: `npm install`, затем `npm start` — сервер слушает порт **8080**.
2. В `front`: `.env` с `VITE_API_URL=http://localhost:8080`, затем `npm run dev`.

## Ожидаемый API (контракт)

Клиент обращается к ресурсам относительно `VITE_API_URL`:

| Метод | Путь            | Назначение |
| ----- | --------------- | ---------- |
| GET   | `/states`       | Список опций `{ id, label }` |
| GET   | `/languages`    | То же |
| GET   | `/genders`      | То же |
| GET   | `/skills`       | То же |
| GET   | `/users`        | Список пользователей (маппится в опции для списка) |
| GET   | `/users/:id`    | Один пользователь для заполнения формы |
| POST  | `/users`        | Создание (тело без поля `variant`, см. `mapData` / `omit` в мутациях) |
| PUT   | `/users/:id`    | Обновление |

Типы ответов и полей тела описаны в `src/users/types/apiTypes.ts`.

## Структура `src`

| Путь | Содержание |
| ---- | ---------- |
| `main.tsx` | Корень: `QueryClientProvider`, рендер `App` |
| `App.tsx` | Обёртка `UsersProvider` |
| `config/env.ts` | `VITE_API_URL` |
| `constants.ts` | Общие константы (например, regex для email) |
| `components/RHF*.tsx` | Обёртки MUI + `Controller` для react-hook-form |
| `users/components/UsersProvider.tsx` | `useForm` + `zodResolver`, `FormProvider`, DevTools |
| `users/components/Users.tsx` | UI формы и списка пользователей |
| `users/services/queries.ts` / `mutations.ts` | React Query |
| `users/types/schema.ts` | Zod-схема и `defaultValues` |
| `users/utils/mapData.ts` | Преобразование формы в формат API |

## MUI X Pro

В зависимостях есть **@mui/x-date-pickers-pro**. Для коммерческого использования может потребоваться [лицензия MUI X](https://mui.com/x/introduction/licensing/); для локального обучения обычно достаточно dev-режима согласно документации MUI.