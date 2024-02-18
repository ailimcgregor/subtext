import React from "react";

import Images from "../../assets/images";
import { useCases } from "../../utils/constants";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center">
        <div className="h-screen bg-black w-full">
          <div className="flex justify-center">
            <img src={Images.Logo} className="" />
          </div>
          <div className="text-5xl mt-[-100px] font-semibold text-center flex justify-center text-white">
            read the mood.
          </div>
        </div>
        <div className="flex bg-gradient-to-r from-rw-blue to-rw-purple py-10 items-center justify-center">
          <div className="bg-white rounded-lg p-10 w-3/4 h-fit">
            <div className=" text-center text-2xl font-sfBold">
              Experience audio like never before with Subtext, where we say,
              "Read the Mood". Our application transforms your audio files into
              emotive transcripts, where font sizes reflect audio levels and
              text colors reveal the emotions behind the words. Perfect for any
              spoken word content, Subtext ensures you not only read the
              transcript but also feel the underlying mood. Dive into a
              multisensory reading experience that brings your audio to life in
              a way that’s visually engaging and emotionally resonant.
            </div>
          </div>
        </div>
      </div>
      <div className="my-10 px-20 flex flex-col items-center">
        <div className="mt-10 flex justify-center">
          <div
            className="bg-gradient-to-r from-rw-blue to-rw-purple py-4 w-[450px] h-[450px] flex flex-col items-center justify-center m-4 rounded-lg cursor-pointer px-8"
            onClick={() => {
              window.location.href = "/entertainment";
            }}
          >
            <div className="text-4xl text-white text-center">Entertainment</div>
            <div className="flex flex-wrap justify-center gap-2">
              <img src={Images.Television} className="w-20 mt-4" />
            </div>
          </div>
        </div>
        <div className="font-semibold text-2xl my-5">Other Use Cases:</div>
        <div className="flex flex-wrap justify-center">
          {useCases.map((el) => {
            return (
              <div
                className="bg-gradient-to-r from-rw-blue to-rw-purple py-4 w-[450px] flex flex-col items-center justify-center mx-4 rounded-lg cursor-pointer px-8"
                onClick={() => {
                  window.location.href = el.url;
                }}
              >
                <div className="text-4xl text-white text-center">{el.name}</div>
                <div className="flex flex-wrap justify-center gap-2">
                  {el.imgSrc.map((src) => {
                    return <img src={src} className="w-20 mt-4" />;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
