import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactPlayer from "react-player";
import ReactAudioPlayer from "react-audio-player";
import { ResponseType } from "../../types";
import { delay } from "../../utils/common";

export default function ResultContainer() {
  const location = useLocation();
  const audioFile: any = location.state?.file;
  const url: any = location.state?.url;
  const data: ResponseType = location.state?.data;
  const [readyToUpdate, setReadyToUpdate] = useState<boolean>(false);
  const [state, setState] = useState<{ text: string; currIndex: number }>({
    text: data[0].text,
    currIndex: 0,
  });
  const renderText = (data: ResponseType) => {};
  useEffect(() => {
    const init = async () => {
      if (setReadyToUpdate) {
        setReadyToUpdate(false);
        await delay(5000);
        setState({
          currIndex: state.currIndex + 1,
          text: data[state.currIndex + 1].text,
        });
        setReadyToUpdate(true);
      }
    };
    init();
  }, [readyToUpdate]);
  return (
    <div className="w-full h-screen flex justify-center items-center">
      {url && (
        <div className="grid grid-cols-2 gap-x-4">
          <ReactPlayer
            url={url}
            config={{
              youtube: {
                playerVars: {
                  cc_load_policy: 1,
                },
              },
            }}
            controls={true}
          />
          <div>
            <ReactPlayer url={url} />
            <div
              className={`mt-10 rounded-lg border-2 border-rw-gray py-8 text-[${
                data[state.currIndex].color
              }]`}
            >
              {state.text}
            </div>
          </div>
        </div>
      )}
      {audioFile && (
        <audio controls className="w-1/2">
          <source src={URL.createObjectURL(audioFile)} type={audioFile.type} />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}
