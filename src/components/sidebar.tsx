import useStore from "@/lib/store";
import { useState } from "react";

export default function Sidebar() {
  const text = useStore((state) => state.text);
  const updateSelection = useStore((state) => state.updateSelection);

  const selectedIdx = useStore((state) => {
    const { text, selection } = state;
    const leadingIdx = text
      .split("\n")
      .reduce(
        (ids, line, idx): number[] =>
          line.startsWith("#") || line.startsWith("##")
            ? ids.concat(idx + 1)
            : ids,
        []
      );
    return selection.startLine !== null && selection.endLine !== null
      ? Math.max(
          ...leadingIdx.filter(
            (idx) =>
              idx >= (selection.startLine || 0) &&
              idx <= (selection.endLine || 0)
          )
        )
      : null;
  });

  const handleMouseOver = (idx: number) => {
    setMouseOver(idx);
  };
  const handleMouseOut = () => {
    setMouseOver(null);
  };
  const handleClick = (line: string, idx: number) => {
    const startingIdx = text.indexOf(line);
    const endingIdx = startingIdx + line.length;
    updateSelection(startingIdx, endingIdx);
  };

  const [mouseOver, setMouseOver] = useState<number | null>(null);
  return (
    <div className="select-none shrink-0 w-3/10 max-w-[300px] h-full">
      <div className="px-8 py-[0.5rem] h-full w-full">
        <div className="text-xs text-foreground flex flex-col justify-between leading-[1.5]">
          <div className="text-foreground flex flex-row justify-between">
            new-file.md
            <div className="text-foreground">*</div>
          </div>

          {text.split("\n").reduce((acc, line, idx): any => {
            const isSelected = selectedIdx === idx + 1;
            const textColour = isSelected
              ? "text-foreground"
              : "text-muted-foreground";
            const isHovered = mouseOver === idx;
            if (line.startsWith("##")) {
              return [
                ...acc,
                <div
                  key={idx}
                  className={`pl-4 ${textColour} cursor-pointer`}
                  onMouseOver={() => handleMouseOver(idx)}
                  onMouseOut={() => handleMouseOut()}
                  onClick={() => handleClick(line, idx + 1)}
                >
                  {isSelected && (
                    <div
                      className={`${
                        isHovered ? "text-foreground" : "text-muted-foreground"
                      } pl-[-1.5] absolute left-[2rem]`}
                    >
                      •{" "}
                    </div>
                  )}
                  {line.slice(2)}
                </div>,
              ];
            } else if (line.startsWith("#")) {
              return [
                ...acc,
                <div
                  key={idx}
                  className={`cursor-pointer ${textColour}`}
                  onMouseOver={() => handleMouseOver(idx)}
                  onMouseOut={() => handleMouseOut()}
                  onClick={() => handleClick(line, idx + 1)}
                >
                  {isSelected && (
                    <div
                      className={`${
                        isHovered ? "text-foreground" : "text-muted-foreground"
                      } pl-[-1.5] absolute left-[1rem]`}
                    >
                      •{" "}
                    </div>
                  )}
                  {line.slice(1)}
                </div>,
              ];
            }
            return acc;
          }, [])}
        </div>
      </div>
    </div>
  );
}
