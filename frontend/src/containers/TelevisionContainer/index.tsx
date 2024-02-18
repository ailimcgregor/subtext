import React, { useEffect, useRef, useState } from "react";
import Button from "../../components/Button";
import FileInputRegion from "../../components/FileInputRegion";
import LoadingScreen from "../../components/LoadingScreen";
import { getResults } from "../../api";

export default function TelevisionContainer() {
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

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {}, [isLoading]);
  const handleInputFile = async () => {
    setIsLoading(true);
    await getResults(state.files);
    setIsLoading(false);
  };
  return (
    <div className="w-full h-screen flex flex-col items-center ">
      <div className="p-10 flex flex-col items-center ">
        <div className="text-3xl">Input your YT url here:</div>
        <input
          type="text"
          placeholder="Youtube URL"
          className="py-4 px-6 rounded-lg border-2 border-rw-gray w-96 mt-10"
        />
        <div className="text-3xl mt-10">OR</div>
        <div className="" onClick={handleClick}>
          <FileInputRegion setParentState={setState} />
        </div>
        <div className="flex justify-center mt-10">
          <div className="w-96">
            <Button
              text={"Input"}
              bgColor={"bg-blue-500"}
              onClick={handleInputFile}
            />
          </div>
        </div>
      </div>
      {isLoading ? <LoadingScreen /> : null}
    </div>
  );
}
