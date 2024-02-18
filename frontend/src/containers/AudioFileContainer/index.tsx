import React, { useEffect, useState } from "react";
import FileInputRegion from "../../components/FileInputRegion";
import Button from "../../components/Button";
import { getResults } from "../../api";
import ResultRegion from "../../components/ResultRegion";
import LoadingScreen from "../../components/LoadingScreen";

export default function AudioFileContainer() {
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState<{ page: number; files: any }>({
    page: 1,
    files: null,
  });
  useEffect(() => {}, [isLoading]);
  const handleInputFile = async () => {
    await getResults(state.files);
    setIsLoading(true);
  };
  return (
    <div>
      <div className="p-20">
        <FileInputRegion setParentState={setState} />
        <div className="flex justify-center mt-10">
          <div className="w-96">
            <Button
              text={"Input"}
              bgColor={"bg-blue-500"}
              onClick={handleInputFile}
            />
          </div>
        </div>
        <div className="mt-10">
          <ResultRegion />
        </div>
      </div>
      {isLoading ? <LoadingScreen /> : null}
    </div>
  );
}
