import { Selection } from "@/selection";

export default function Sidebar({
  text,
  selection,
}: {
  text: string;
  selection: Selection;
}) {
  return (
    <div className="select-none shrink-0 w-3/10 max-w-[300px] h-full">
      <div className="px-8 py-[0.5rem] h-full w-full">
        <div className="text-xs text-foreground flex flex-col justify-between leading-[1.5]">
          <div className="text-foreground flex flex-row justify-between">
            building-textus.mdx
            <div className="text-foreground">*</div>
          </div>

          {text.split("\n").reduce((acc, line, idx): any => {
            const isSelected =
              selection.line !== null && selection.line - 1 === idx;
            const textColour = isSelected
              ? "text-foreground"
              : "text-muted-foreground";
            if (line.startsWith("##")) {
              return [
                ...acc,
                <div key={idx} className={`pl-4 ${textColour}`}>
                  {isSelected && (
                    <div className="text-foreground pl-[-1.5] absolute left-[2rem]">
                      •{" "}
                    </div>
                  )}
                  {line.slice(2)}
                </div>,
              ];
            } else if (line.startsWith("#")) {
              return [
                ...acc,
                <div key={idx} className={textColour}>
                  {isSelected && (
                    <div className="text-foreground pl-[-1.5] absolute left-[1rem]">
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
