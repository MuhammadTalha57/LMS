"use client";

import { useState } from "react";

export default function LoginInput({
  labelText,
  type,
}: {
  labelText?: string;
  type?: string;
}) {
  const [value, setValue] = useState("");

  return (
    <div className="relative w-1/2 my-6">
      <input
        type={type}
        required
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="bg-transparent border-0 border-b-2 border-b-blue-800 focus:border-blue-400 text-black text-lg w-full py-3 focus:outline-none peer"
      />
      <label className="absolute top-3 left-0 pointer-events-none">
        {labelText?.split("").map((char, i) => (
          <span
            key={i}
            className={`inline-block text-black text-lg min-w-[5px] transition-transform duration-300 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]  ${
              value ? " -translate-y-[30px]" : ""
            }`}
            style={{ transitionDelay: `${i * 50}ms` }}
          >
            {char}
          </span>
        ))}
      </label>
    </div>
  );
}
