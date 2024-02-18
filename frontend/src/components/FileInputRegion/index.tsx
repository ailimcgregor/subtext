import React from "react";
import { useRef, useState } from "react";
import Button from "../../components/Button";
import { DeleteIcon } from "@chakra-ui/icons";

export default function FileInputRegion({ setParentState }: any) {
  const fileRef = useRef<any>();
  const [state, setState] = useState<{ files: any }>({
    files: null,
  });
  const handleClick = () => {
    fileRef?.current?.click();
  };
  const handleDelete = () => {
    setState({ ...state, files: null });
  };
  return (
    <>
      <div className="flex flex-col items-center">
        <div className="mt-10" onClick={handleClick}>
          <div className="cursor-pointer border-dotted w-96 h-40 border-2 rounded-lg border-rw-gray flex justify-center items-center">
            <div className="text-sm font-semibold">Input your file here</div>
          </div>
        </div>
      </div>
      <input
        className="mt-10"
        type="file"
        ref={fileRef}
        onChange={(event) => {
          console.log(event);
          setState({ ...state, files: event.target.files?.item(0) });
          setParentState({ ...state, files: event.target.files?.item(0) });
        }}
        accept="audio/*, flac, m4a, mp3, mp4, mpeg, mpga, oga, ogg, wav, webm"
        hidden
      />

      {state.files && (
        <div className="flex justify-center mt-5">
          <div className="w-96 py-2 px-4 font-semibold bg-rw-gray flex justify-between items-center">
            <div>{state.files.name}</div>
            <DeleteIcon
              color={"red"}
              className="cursor-pointer"
              onClick={handleDelete}
            />
          </div>
        </div>
      )}
    </>
  );
}
