export type ResponseType = {
  [num: number]: {
    text: string;
    start: number;
    end: number;
    color: string;
    volume: "large" | "small" | "regular";
  };
};
