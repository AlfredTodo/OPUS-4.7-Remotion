import { Composition } from "remotion";
import { HelloWorld } from "./HelloWorld";
import {
  NodePlayPromo,
  NODE_PLAY_TOTAL_FRAMES,
} from "./promo/NodePlayPromo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="NodePlayPromo"
        component={NodePlayPromo}
        durationInFrames={NODE_PLAY_TOTAL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
