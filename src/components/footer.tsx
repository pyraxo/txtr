import { INSERTS } from "@/lib/inserts";
import useStore from "@/lib/state";

export default function Footer() {
  const text = useStore((state) => state.text);
  const selection = useStore((state) => state.selection);
  const insertMode = useStore((state) => state.insertMode);

  const lines = text?.split("\n");
  const wordCount = lines
    ?.map((line) => line.split(" ").length)
    .reduce((a, b) => a + b, 0);

  const verbCount = text?.match(/[aeiou]/gi)?.length || 0;
  const consonantCount = (text?.match(/[a-zA-Z]/gi)?.length || 0) - verbCount;

  return (
    <div className="shrink-0 h-[50px] pt-4 pr-4 flex flex-row justify-between w-full">
      {insertMode && lines && (
        <div className="px-2 text-xs text-muted-foreground flex flex-row gap-2">
          <span className="text-foreground">Insert Mode</span>
          {INSERTS.map((insert) => (
            <>
              <span key={insert.key} className="text-muted-foreground">
                c-{insert.key.toUpperCase()}
              </span>
              <span className="text-muted-foreground-secondary underline">
                {insert.name}
              </span>
            </>
          ))}
          <span className="text-muted-foreground">Esc</span>
          <span>
            <span className="text-muted-foreground underline">Exit</span>
            <span className="text-muted-foreground-secondary">.</span>
          </span>
        </div>
      )}
      {!insertMode && lines && (
        <>
          <h4 className="px-2 text-xs text-muted-foreground">
            {selection.start !== null &&
              selection.end !== null &&
              selection.start !== selection.end && (
                <span className="text-foreground">
                  [{selection.start},{selection.end}]{" "}
                </span>
              )}
            {lines.length}L {wordCount}W {verbCount}V {consonantCount}C
          </h4>
          <h4 className="px-4 text-xs text-muted-foreground">
            {new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </h4>
        </>
      )}
    </div>
  );
}
