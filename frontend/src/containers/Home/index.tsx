import React from "react";

import Images from "../../assets/images";
import { useCases } from "../../utils/constants";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center">
        <div className=" h-screen">
          <div className="flex justify-center">
            <img src={Images.Logo} className=" scale-125" />
          </div>
          <div className="text-5xl mt-[-120px] font-semibold text-center flex justify-center">
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
      <div className="my-4 px-20 flex flex-col items-center">
        <div className="font-semibold text-2xl">What can we use it for?</div>
        <div className="mt-10  flex flex-wrap justify-center">
          {useCases.map((el) => {
            return (
              <div className="bg-gradient-to-r from-rw-blue to-rw-purple py-4 w-[450px] flex flex-col items-center justify-center m-4">
                <div className="text-4xl text-white text-center">{el.name}</div>
                <img src={el.imgSrc} className="w-28 mt-4" />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
