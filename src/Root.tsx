import { Composition } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { NodePlayKinetic, TOTAL_FRAMES } from "./kinetic/NodePlayKinetic";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="NodePlayKinetic"
        component={NodePlayKinetic}
        durationInFrames={TOTAL_FRAMES}
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
