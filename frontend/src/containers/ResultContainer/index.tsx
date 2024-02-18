import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactPlayer from "react-player";
import ReactAudioPlayer from "react-audio-player";
import { ResponseType } from "../../types";
import { delay } from "../../utils/common";
import "./index.css";

export default function ResultContainer() {
  const location = useLocation();
  const audioFile: any = location.state?.file;
  const url: any = location.state?.url;
  const data: ResponseType = location.state?.data;
  const [state, setState] = useState<{
    currIndex: number;
    videoPaused: boolean;
    text: string;
    color: string;
    data: any;
  }>({
    currIndex: 0,
    videoPaused: true,
    text: data[0].text,
    color: data[0].color,
    data: location?.state?.data,
  });
  const [timer, setTimer] = useState<number>(0);

  useEffect(() => {
    if (!state.videoPaused) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1); // Increment the timer by 1 second

        // Find the appropriate data element based on the timer value
      }, 1000);
      if (!state.videoPaused) {
        const element = Object.keys(data).find((key) => {
          const { start, end } = data[key];
          return end * 1000 > timer * 1000 && start * 1000 <= timer * 1000;
        });

        if (element) {
          setState({
            ...state,
            text: data[element].text,
            color: data[element].color,
            currIndex: Number(element),
          });
        }
      }

      // Cleanup function to clear the interval when the component unmounts
      return () => clearInterval(interval);
    }
  }, [data, timer, state.videoPaused]); // Run this effect whenever data or timer changes

  return (
    <div className="w-full h-screen flex justify-center items-center">
      {url && (
        <div className="flex justify-center">
          <div className="w-[650px]">
            <ReactPlayer
              url={url}
              onPlay={() => {
                setState({ ...state, videoPaused: false });
              }}
              onPause={() => {
                setState({ ...state, videoPaused: true });
              }}
            />
            <div
              style={{ color: state.color }}
              className={`mt-10 px-10 rounded-lg border-2 border-rw-gray py-8 text-3xl outlined-text w-[650px]`}
            >
              {state.text}
            </div>
          </div>
        </div>
      )}
      {audioFile && (
        <div>
          <audio controls className="w-[650px]">
            <source
              src={URL.createObjectURL(audioFile)}
              type={audioFile.type}
            />
            Your browser does not support the audio element.
          </audio>
          <div
            style={{ color: state.color }}
            className={`mt-10 px-10 rounded-lg border-2 border-rw-gray py-8 text-3xl outlined-text w-[650px]`}
          >
            {state.text}
          </div>
        </div>
      )}
    </div>
  );
}
