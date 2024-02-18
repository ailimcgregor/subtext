import React, { useEffect, useRef, useState } from "react";
import Button from "../../components/Button";
import { ArrowDownIcon, ArrowUpIcon, DeleteIcon } from "@chakra-ui/icons";
import FileInputRegion from "../../components/FileInputRegion";
import Images from "../../assets/images";
import ResultRegion from "../../components/ResultRegion";

export default function Home() {
  const [state, setState] = useState<any>({ page: 1 });
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [prevScrollPosition, setPrevScrollPosition] = useState(0);
  const section2Ref = useRef<any>();
  const section1Ref = useRef<any>();
  const section3Ref = useRef<any>();

  const handleScrollDown = (page: number) => {
    if (page === 3) {
      return;
    } else if (page === 2) {
      section3Ref.current.scrollIntoView({ behavior: "smooth" });
    } else if (page === 1) {
      section2Ref.current.scrollIntoView({ behavior: "smooth" });
    }
    setState({ ...state, page: state.page + 1 });
  };

  const handleScrollUp = (page: number) => {
    if (page === 3) {
      section2Ref.current.scrollIntoView({ behavior: "smooth" });
    } else if (page === 2) {
      section1Ref.current.scrollIntoView({ behavior: "smooth" });
    } else if (page === 1) {
      return;
    }
    setState({ ...state, page: state.page - 1 });
  };

  useEffect(() => {
    const handleScroll = (currentScrollPosition: any) => {
      if (!isScrolling) {
        return;
      }
      // Calculate 50% and 150% of the viewport height inside the event handler

      // going down
      if (currentScrollPosition > prevScrollPosition) {
        const halfViewportHeight = window.innerHeight * 0.5;
        const oneAndHalfViewportHeight = window.innerHeight * 1.5;
        if (currentScrollPosition > oneAndHalfViewportHeight) {
          setState({ ...state, page: 3 });
          section3Ref.current.scrollIntoView({ behavior: "smooth" });
        } else if (currentScrollPosition > halfViewportHeight) {
          setState({ ...state, page: 2 });
          section2Ref.current.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // going up
        const halfViewportHeight = window.innerHeight * 0.9;
        const oneAndHalfViewportHeight = window.innerHeight * 1.95;
        console.log("" + halfViewportHeight + " " + prevScrollPosition);

        if (currentScrollPosition < halfViewportHeight) {
          setState({ ...state, page: 1 });
          section1Ref.current.scrollIntoView({ behavior: "smooth" });
        } else if (currentScrollPosition < oneAndHalfViewportHeight) {
          setState({ ...state, page: 2 });
          section2Ref.current.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    // window.addEventListener("scroll", handleScroll);
    var isScrolling;

    // Listen for scroll events
    window.addEventListener(
      "scroll",
      function (event) {
        // Clear our timeout throughout the scroll
        window.clearTimeout(isScrolling);
        setIsScrolling(true);
        // Set a timeout to run after scrolling ends
        isScrolling = setTimeout(function () {
          // Run the callback
          handleScroll(window.scrollY);

          console.log("Scrolling has stopped.");
        }, 66);
        setPrevScrollPosition(window.scrollY);
        setIsScrolling(false);
      },
      false
    );

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isScrolling]);

  return (
    <div className="">
      <div className="h-[100vh]" ref={section1Ref}>
        <div className="flex justify-center">
          <img src={Images.Logo} className=" scale-125" />
        </div>
        <div className="text-5xl mt-[-120px] font-semibold text-center flex justify-center">
          read the mood.
        </div>
      </div>
      <div
        className="h-[100vh] p-20 flex flex-col justify-center items-center bg-gradient-to-r from-rw-blue to-rw-purple"
        ref={section2Ref}
      >
        <div className="bg-white rounded-lg p-10 w-3/4">
          <div className="w- text-center text-xl font-sfBold">
            Experience audio like never before with Subtext, where we say, "Read
            the Mood". Our application transforms your audio files into emotive
            transcripts, where font sizes reflect audio levels and text colors
            reveal the emotions behind the words. Perfect for any spoken word
            content, Subtext ensures you not only read the transcript but also
            feel the underlying mood. Dive into a multisensory reading
            experience that brings your audio to life in a way that’s visually
            engaging and emotionally resonant.
          </div>
        </div>
      </div>
      <div className="h-[100vh] p-20" ref={section3Ref}>
        <FileInputRegion />
        <div className="mt-10">
          <ResultRegion />
        </div>
      </div>
      <div className="flex justify-center">
        {state.page !== 3 && (
          <ArrowDownIcon
            className="fixed bottom-10 animate-bounce cursor-pointer"
            onClick={() => handleScrollDown(state.page)}
          />
        )}
        {state.page !== 1 && (
          <ArrowUpIcon
            className="fixed top-10 animate-bounce cursor-pointer"
            onClick={() => handleScrollUp(state.page)}
          />
        )}
      </div>
    </div>
  );
}
