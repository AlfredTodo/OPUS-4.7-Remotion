import { AbsoluteFill, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { Background } from "./Background";
import { Intro } from "./Intro";
import { Showcase } from "./Showcase";
import { Outro } from "./Outro";

loadFont("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin", "latin-ext", "cyrillic"],
});

const INTRO_FRAMES = 210;
const SHOWCASE_FRAMES = 300;
const OUTRO_FRAMES = 120;

export const NODE_PLAY_TOTAL_FRAMES =
  INTRO_FRAMES + SHOWCASE_FRAMES * 2 + OUTRO_FRAMES;

// Scene timing helpers: elements lift sequentially and stay raised until the
// scene fades out. The Showcase uses appearAt for the lift-in, hideAt for the
// fade-out (we set hideAt close to scene end so everything settles together).
const SCENE_FADEOUT = 30;
const sceneEnd = (frames: number) => frames - SCENE_FADEOUT;

const mainHighlights = [
  {
    x: 145,
    y: 130,
    w: 940,
    h: 180,
    label: "Активные серверы",
    caption:
      "Запущенные серверы на одном экране — статус, IP-адрес, игроки.",
    appearAt: 40,
    hideAt: sceneEnd(300),
    liftZ: 110,
    nudgeX: 0,
    nudgeY: -10,
  },
  {
    x: 145,
    y: 350,
    w: 320,
    h: 100,
    label: "Один клик до игры",
    caption: "Разверни новый сервер из готового шаблона за пару секунд.",
    appearAt: 95,
    hideAt: sceneEnd(300),
    liftZ: 80,
    nudgeX: -16,
    nudgeY: 8,
  },
  {
    x: 145,
    y: 480,
    w: 1080,
    h: 320,
    label: "Каталог игр",
    caption:
      "Сотни поддерживаемых игр. Запусти то, во что хочешь играть прямо сейчас.",
    appearAt: 150,
    hideAt: sceneEnd(300),
    liftZ: 70,
    nudgeX: 0,
    nudgeY: 12,
  },
];

const overviewHighlights = [
  {
    x: 195,
    y: 55,
    w: 1390,
    h: 50,
    label: "Метрики в реальном времени",
    caption: "ОЗУ, ЦПУ, диск и сеть — всё видно сразу.",
    appearAt: 40,
    hideAt: sceneEnd(300),
    liftZ: 100,
    nudgeY: -16,
  },
  {
    x: 170,
    y: 160,
    w: 200,
    h: 540,
    label: "Полный контроль",
    caption:
      "Файлы, консоль, конфиг, бэкапы и расписания — всё на одной панели.",
    appearAt: 100,
    hideAt: sceneEnd(300),
    liftZ: 90,
    nudgeX: -18,
  },
  {
    x: 880,
    y: 230,
    w: 700,
    h: 300,
    label: "Производительность",
    caption: "Графики нагрузки сервера в реальном времени без подключений.",
    appearAt: 160,
    hideAt: sceneEnd(300),
    liftZ: 70,
    nudgeX: 14,
  },
];

export const NodePlayPromo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
      <Sequence durationInFrames={INTRO_FRAMES}>
        <Intro />
      </Sequence>
      <Sequence from={INTRO_FRAMES} durationInFrames={SHOWCASE_FRAMES}>
        <Showcase
          src="assets/main.png"
          title="Главная панель"
          subtitle="Все серверы под рукой"
          highlights={mainHighlights}
          durationInFrames={SHOWCASE_FRAMES}
        />
      </Sequence>
      <Sequence
        from={INTRO_FRAMES + SHOWCASE_FRAMES}
        durationInFrames={SHOWCASE_FRAMES}
      >
        <Showcase
          src="assets/server-overview.png"
          title="Управление сервером"
          subtitle="Контроль каждой детали"
          highlights={overviewHighlights}
          durationInFrames={SHOWCASE_FRAMES}
        />
      </Sequence>
      <Sequence
        from={INTRO_FRAMES + SHOWCASE_FRAMES * 2}
        durationInFrames={OUTRO_FRAMES}
      >
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
