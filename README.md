# OPUS-4.7-Remotion

Простой пример анимации на [Remotion](https://www.remotion.dev/).

## Установка

```bash
npm install
```

## Запуск Remotion Studio

```bash
npm start
```

Откроется Remotion Studio, где можно посмотреть композицию `HelloWorld`.

## Рендер видео

```bash
npx remotion render HelloWorld out/hello.mp4
```

## Структура

- `src/index.ts` — точка входа, регистрирует корневую композицию.
- `src/Root.tsx` — описание композиции (длительность, fps, размер).
- `src/HelloWorld.tsx` — сама анимация с текстом «Привет, я готов :)».
- `remotion.config.ts` — конфигурация рендера.
