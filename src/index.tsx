import { Component, createSignal, createUniqueId } from "solid-js";
import { getProgress, makeFrameHandler } from "@/core";
import { roundTo } from "./utils";

type Option = {
  immediate?: boolean;
};

export const createRaf = (fn: FrameRequestCallback, options: Option = {}) => {
  const [isReverse, setReversed] = createSignal(false);

  const [isRunning, setIsRunning] = createSignal(false);

  const frame = makeFrameHandler();

  const cb = () => {
    fn(frame.currentTime());
  };

  if (options?.immediate) {
    frame.effect(cb);
    setIsRunning(true);
  }

  const start = () => {
    if (!isRunning()) {
      frame.effect(cb);
      setIsRunning(true);
    }
  };

  const resume = () => {
    if (!isRunning()) {
      frame.resume();
      setIsRunning(true);
    }
  };

  const pause = () => {
    if (isRunning()) {
      frame.pause();
      setIsRunning(false);
    }
  };

  const restart = () => {
    frame.restart();
    setIsRunning(true);
  };

  return { isRunning, start, pause, resume, restart };
};

const Controls = () => {
  const [val, setVal] = createSignal(0);
  const [c, setC] = createSignal(0);

  const { start, resume, restart, pause, isRunning } = createRaf(
    (time) => {
      setC(c() + 1);
      console.log(20000 - time);
      setVal(roundTo(getProgress(time, 20000), 2));
    },
    { immediate: false },
  );

  return (
    <>
      <div>{val()}</div>
      <div>{c()}</div>
      <button onClick={start}>Start</button>
      <button onClick={restart}>restart</button>
      <button onClick={resume}>resume</button>
      <button onClick={pause}>pause</button>
    </>
  );
};

export const Hello: Component<{ to?: string }> = (props) => {
  return (
    <>
      <Controls />
      <Controls />
    </>
  );
};
