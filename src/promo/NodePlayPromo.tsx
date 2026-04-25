import { AbsoluteFill, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { Background } from "./Background";
import { Intro } from "./Intro";
import { Showcase } from "./Showcase";
import { Outro } from "./Outro";

loadFont("normal", {
  weights: ["400", "500", "700", "800"],
  subsets: ["latin", "latin-ext", "cyrillic"],
});

const INTRO_FRAMES = 210;
const SHOWCASE_FRAMES = 300;
const OUTRO_FRAMES = 120;

export const NODE_PLAY_TOTAL_FRAMES =
  INTRO_FRAMES + SHOWCASE_FRAMES * 2 + OUTRO_FRAMES;

const mainHighlights = [
  {
    x: 145,
    y: 130,
    w: 940,
    h: 180,
    label: "Активные серверы",
    caption:
      "Запущенные серверы на одном экране — статус, IP-адрес, игроки.",
    appearAt: 60,
    hideAt: 130,
    side: "right" as const,
  },
  {
    x: 145,
    y: 350,
    w: 320,
    h: 100,
    label: "Один клик до игры",
    caption:
      "Разверни новый сервер из готового шаблона за пару секунд.",
    appearAt: 130,
    hideAt: 200,
    side: "right" as const,
  },
  {
    x: 145,
    y: 480,
    w: 1450,
    h: 460,
    label: "Каталог игр",
    caption:
      "Сотни поддерживаемых игр. Запусти то, во что хочешь играть прямо сейчас.",
    appearAt: 200,
    hideAt: 280,
    side: "top" as const,
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
    appearAt: 60,
    hideAt: 130,
    side: "bottom" as const,
  },
  {
    x: 170,
    y: 160,
    w: 200,
    h: 540,
    label: "Полный контроль",
    caption:
      "Файлы, консоль, конфиг, бэкапы и расписания — всё на одной панели.",
    appearAt: 130,
    hideAt: 220,
    side: "right" as const,
  },
  {
    x: 880,
    y: 230,
    w: 700,
    h: 300,
    label: "Производительность",
    caption: "Графики нагрузки сервера в реальном времени без подключений.",
    appearAt: 220,
    hideAt: 290,
    side: "left" as const,
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
