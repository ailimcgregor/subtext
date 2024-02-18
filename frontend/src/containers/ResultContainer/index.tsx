import React from "react";
import { useSearchParams } from "react-router-dom";

export default function ResultContainer() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  return <div>{type === ""}</div>;
}
