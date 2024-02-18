import React, { useEffect, useState } from "react";
import FileInputRegion from "../../components/FileInputRegion";
import Button from "../../components/Button";
import { getResults } from "../../api";
import ResultRegion from "../../components/ResultRegion";
import LoadingScreen from "../../components/LoadingScreen";
import { useToast } from "@chakra-ui/react";

export default function AudioFileContainer() {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const [state, setState] = useState<{ files: any }>({
    files: null,
  });
  useEffect(() => {}, [isLoading]);
  const handleInputFile = async () => {
    if (!state.files) {
      toast({
        title: "Error",
        description: "Please verify your parameters.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setIsLoading(true);
  };
  return (
    <div>
      <div className="p-20">
        <div className="flex justify-center">
          <div className="text-2xl font-semibold">Input your file here!</div>
        </div>
        <FileInputRegion setParentState={setState} parentState={state} />
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
