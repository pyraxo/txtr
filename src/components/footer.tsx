import { Selection } from "@/selection";

export default function Footer({
  text,
  selection,
}: {
  text: string;
  selection: Selection;
}) {
  const lines = text.split("\n");
  const wordCount = lines
    .map((line) => line.split(" ").length)
    .reduce((a, b) => a + b, 0);

  const verbCount = text.match(/[aeiou]/gi)?.length || 0;
  const consonantCount = (text.match(/[a-zA-Z]/gi)?.length || 0) - verbCount;

  return (
    <div className="shrink-0 h-[50px] pt-4 pr-4 flex flex-row justify-between">
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
      <h4 className="px-2 text-xs text-muted-foreground">
        {new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </h4>
    </div>
  );
}
