import { MutableRefObject, useRef, useState } from "react";
import Navbar from "../../components/Navbar";

export default function Home() {
  const fileRef = useRef<any>();
  const [files, setFiles] = useState<any>();
  const handleClick = () => {
    fileRef?.current?.click();
  };
  return (
    <div className="p-10">
      {/* <Navbar /> */}
      <div className="flex flex-col items-center">
        <div className="text-2xl font-semibold">Input your file here!</div>
        <div className="mt-20" onClick={handleClick}>
          <div className="cursor-pointer border-dotted w-80 h-40 border-2 rounded-lg border-input-field-gray flex justify-center items-center">
            <div className="text-sm font-semibold">Input your file here</div>
          </div>
        </div>
      </div>
      <input type="file" ref={fileRef} hidden />
    </div>
  );
}
