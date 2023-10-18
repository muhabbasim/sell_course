"use client"

import dynamic from "next/dynamic";
import 'react-quill/dist/quill.snow.css';
import { useMemo } from "react";

interface EditorProps {
  onChange: (value: string) => void;
  value: string;
}

// import ReactQuill from 'react-quill';

function Editor({ onChange, value }: EditorProps) {

  const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false }), []);

  return (
    <div className="bg-white">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

export default Editor