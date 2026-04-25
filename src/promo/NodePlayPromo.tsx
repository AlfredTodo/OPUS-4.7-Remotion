import { AbsoluteFill, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { Background } from "./Background";
import { Intro } from "./Intro";
import { Showcase, type Highlight } from "./Showcase";
import { Outro } from "./Outro";

loadFont("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin", "latin-ext", "cyrillic"],
});

const INTRO_FRAMES = 210;
const SHOWCASE_FRAMES = 360;
const OUTRO_FRAMES = 120;

export const NODE_PLAY_TOTAL_FRAMES =
  INTRO_FRAMES + SHOWCASE_FRAMES * 2 + OUTRO_FRAMES;

// Highlight regions are in the SVG viewBox space (1914 x 855).
const mainHighlights: Highlight[] = [
  {
    x: 189,
    y: 156,
    w: 1144,
    h: 202,
    label: "Активные серверы",
    caption:
      "Все запущенные серверы на одном экране — статус, IP, игроки, быстрый запуск управления.",
  },
  {
    x: 190,
    y: 391,
    w: 370,
    h: 178,
    label: "Один клик до игры",
    caption:
      "Разверни новый сервер из готового шаблона за пару секунд — без терминала и конфигов.",
  },
  {
    x: 189,
    y: 682,
    w: 1144,
    h: 173,
    label: "Каталог игр",
    caption:
      "Сотни поддерживаемых игр — выбери проект и запусти его прямо отсюда.",
  },
];

const overviewHighlights: Highlight[] = [
  {
    x: 211,
    y: 38,
    w: 1492,
    h: 50,
    label: "Метрики в реальном времени",
    caption:
      "ОЗУ, ЦПУ, диск и сеть всегда видно сверху — держи руку на пульсе сервера.",
  },
  {
    x: 453,
    y: 310,
    w: 616,
    h: 387,
    label: "Информация о сервере",
    caption:
      "Адрес подключения, IP, порты, нода и регион — всё, что нужно игрокам, в одной карточке.",
  },
  {
    x: 1085,
    y: 310,
    w: 616,
    h: 387,
    label: "Производительность",
    caption:
      "Графики нагрузки сервера в реальном времени, без подключения к консоли.",
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
          src="assets/main.svg"
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
          src="assets/server-overview.svg"
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
