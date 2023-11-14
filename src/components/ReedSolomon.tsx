import { useRef } from "react";
import { rs } from "../utils/reed-solomon";

declare const window: any;

export default function ReedSolomon() {

  const fileInput = useRef<HTMLInputElement>(null)

  const handleReedSolomon = async () => {
    if (fileInput.current?.files) {
      const file = fileInput.current?.files[0]
      await rs(file)
    }
  }

  return (
    <>
      <div>
        <h3>Reed Solomon Testing</h3>
        <input ref={fileInput} type="file" />
        <button
          onClick={handleReedSolomon}>
          Reed-Solomon Test
        </button>
      </div>
    </>
  );
};