"use client";

import { Button } from "@/components/ui/button";

type ButtonProps = {
  text: string;
  handleClick: () => void;
};

export default function CardHolder({ buttons }: { buttons: ButtonProps[] }) {
  return (
    <div className="w-11/12 h-1/2 flex justify-center items-center gap-5">
      {buttons.map((btn, index) => (
        <Button key={index} onClick={btn.handleClick}>
          {btn.text}
        </Button>
      ))}
    </div>
  );
}
