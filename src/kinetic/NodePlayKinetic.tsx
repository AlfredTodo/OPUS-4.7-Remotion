import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";

import { ColdOpen, COLD_OPEN_DUR } from "./scenes/ColdOpen";
import { LogoReveal, LOGO_REVEAL_DUR } from "./scenes/LogoReveal";
import { Manifesto, MANIFESTO_DUR } from "./scenes/Manifesto";
import {
  PanelShowcase,
  panelShowcaseDuration,
  Focus,
} from "./scenes/PanelShowcase";
import { Outro, OUTRO_DUR } from "./scenes/Outro";
import { theme } from "./theme";

loadFont("normal", { weights: ["400", "500", "600", "700", "800", "900"] });

const mainFocuses: Focus[] = [
  {
    x: 189,
    y: 156,
    w: 1144,
    h: 202,
    word: "Все серверы.\nОдин экран.",
    caption:
      "Статусы, IP, игроки и быстрый доступ к управлению — без лишних окон и переключений.",
    index: "01",
  },
  {
    x: 190,
    y: 391,
    w: 370,
    h: 178,
    word: "Один клик —\nи готово.",
    caption:
      "Развёртывание сервера из готового шаблона за пару секунд. Без терминала и конфигов.",
    index: "02",
  },
  {
    x: 189,
    y: 682,
    w: 1144,
    h: 173,
    word: "Сотни игр\nв каталоге.",
    caption:
      "Minecraft, CS, Rust, ARK, Palworld и десятки других — выбрал и запустил.",
    index: "03",
  },
];

const serverFocuses: Focus[] = [
  {
    x: 200,
    y: 76,
    w: 1518,
    h: 38,
    word: "Метрики\nв реальном времени.",
    caption:
      "ОЗУ, ЦПУ, диск и сеть всегда видны сверху. Держи руку на пульсе сервера.",
    index: "01",
  },
  {
    x: 453,
    y: 310,
    w: 616,
    h: 387,
    word: "Полная инфо\nо сервере.",
    caption:
      "Адрес подключения, IP, порты, нода, регион — всё, что нужно игрокам, в одной карточке.",
    index: "02",
  },
  {
    x: 1085,
    y: 310,
    w: 616,
    h: 387,
    word: "Графики\nнагрузки.",
    caption:
      "Производительность сервера в реальном времени без подключения к консоли.",
    index: "03",
  },
];

const SHOWCASE_MAIN_DUR = panelShowcaseDuration(mainFocuses.length);
const SHOWCASE_SERVER_DUR = panelShowcaseDuration(serverFocuses.length);

export const TOTAL_FRAMES =
  COLD_OPEN_DUR +
  LOGO_REVEAL_DUR +
  MANIFESTO_DUR +
  SHOWCASE_MAIN_DUR +
  SHOWCASE_SERVER_DUR +
  OUTRO_DUR;

let _from = 0;
const at = (dur: number) => {
  const start = _from;
  _from += dur;
  return start;
};

const COLD_OPEN_AT = at(COLD_OPEN_DUR);
const LOGO_REVEAL_AT = at(LOGO_REVEAL_DUR);
const MANIFESTO_AT = at(MANIFESTO_DUR);
const SHOWCASE_MAIN_AT = at(SHOWCASE_MAIN_DUR);
const SHOWCASE_SERVER_AT = at(SHOWCASE_SERVER_DUR);
const OUTRO_AT = at(OUTRO_DUR);

export const NodePlayKinetic: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: theme.bg, overflow: "hidden" }}>
      <Sequence from={COLD_OPEN_AT} durationInFrames={COLD_OPEN_DUR}>
        <ColdOpen />
      </Sequence>
      <Sequence from={LOGO_REVEAL_AT} durationInFrames={LOGO_REVEAL_DUR}>
        <LogoReveal />
      </Sequence>
      <Sequence from={MANIFESTO_AT} durationInFrames={MANIFESTO_DUR}>
        <Manifesto />
      </Sequence>
      <Sequence from={SHOWCASE_MAIN_AT} durationInFrames={SHOWCASE_MAIN_DUR}>
        <PanelShowcase
          which="main"
          sectionLabel="ГЛАВНАЯ ПАНЕЛЬ • 01"
          focuses={mainFocuses}
          introDir="ltr"
        />
      </Sequence>
      <Sequence from={SHOWCASE_SERVER_AT} durationInFrames={SHOWCASE_SERVER_DUR}>
        <PanelShowcase
          which="serverOverview"
          sectionLabel="УПРАВЛЕНИЕ СЕРВЕРОМ • 02"
          focuses={serverFocuses}
          introDir="rtl"
        />
      </Sequence>
      <Sequence from={OUTRO_AT} durationInFrames={OUTRO_DUR}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
