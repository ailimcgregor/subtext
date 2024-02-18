import React from "react";

type ButtonProps = {
  text: string;
  bgColor: string;
  onClick: () => void;
};

export default function Button({ text, bgColor, onClick }: ButtonProps) {
  return (
    <button
      className={`rounded-lg ${bgColor} w-full py-4 text-white`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
