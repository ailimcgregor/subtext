import React, { useEffect, useRef, useState } from "react";
import Button from "../../components/Button";
import FileInputRegion from "../../components/FileInputRegion";
import LoadingScreen from "../../components/LoadingScreen";
import { getResultsForYT } from "../../api";
import { useToast } from "@chakra-ui/react";
import { validateUrl } from "../../utils/validate";
import { useNavigate, useNavigation } from "react-router-dom";
import { ResponseType } from "../../types";

export default function TelevisionContainer() {
  const fileRef = useRef<any>();
  const toast = useToast();
  const navigate = useNavigate();

  const [state, setState] = useState<{ files?: any; url?: string }>({
    files: null,
    url: "",
  });
  const handleClick = () => {
    fileRef?.current?.click();
  };

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {}, [isLoading]);

  const handleInputFile = async () => {
    if (!state.files && !state.url) {
      toast({
        title: "Error",
        description: "Please verify your parameters.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    } else if ((state.files && !state.url) || (!state.files && state.url)) {
      if (!state.files) {
        if (!validateUrl(state.url!)) {
          toast({
            title: "Error",
            description: "Please verify your url",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return;
        } else {
          setIsLoading(true);
          const response = await getResultsForYT({
            url: state.url,
          });
          setIsLoading(false);
          navigate("/results", { state: { url: state.url, data: response } });
        }
      } else if (!state.url) {
        console.log(state.files);
        setIsLoading(true);
        const response = await getResultsForYT({ file: state.files });
        setIsLoading(false);
        navigate("/results", { state: { file: state.files, data: response } });
      }
    }
  };
  return (
    <div className="w-full h-screen flex flex-col items-center ">
      <div className="p-10 flex flex-col items-center ">
        <div className="text-3xl">Input your YT url here:</div>
        <input
          type="text"
          placeholder="Youtube URL"
          className="py-4 px-6 rounded-lg border-2 border-rw-gray w-96 mt-10"
          onChange={(event) => {
            setState({ ...state, url: event?.target?.value });
          }}
        />
        <div className="text-3xl mt-10">OR</div>
        <div className="" onClick={handleClick}>
          <FileInputRegion setParentState={setState} parentState={state} />
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
