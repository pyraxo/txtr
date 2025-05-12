import { Selection } from "@/selection";

const getLineNumber = (text: string, index: number) => {
  return text.slice(0, index).split("\n").length;
};

export default function Editor({
  text,
  setText,
  setSelection,
  insertMode,
  selectionRef,
}: {
  text: string;
  setText: (text: string) => void;
  setSelection: (selection: Selection) => void;
  insertMode: boolean;
  selectionRef: React.RefObject<HTMLTextAreaElement>;
}) {
  return (
    <div className="grow overflow-y-auto">
      <div className="pl-2 pr-4 py-[6px] cursor-text overflow-hidden">
        <textarea
          ref={selectionRef}
          className="text-foreground text-sm h-[calc(100vh-1rem)] w-full border-none outline-none shadow-none resize-none focus:outline-none focus:ring-0 focus:ring-offset-0 leading-[1.5]"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onSelect={(e) => {
            const target = e.target as HTMLTextAreaElement;
            setSelection({
              start: target.selectionStart,
              end: target.selectionEnd,
              startLine: getLineNumber(target.value, target.selectionStart),
              endLine: getLineNumber(target.value, target.selectionEnd),
            });
          }}
          onBlur={() => {
            setSelection({
              start: null,
              end: null,
              startLine: null,
              endLine: null,
            });
          }}
        />
      </div>
    </div>
  );
}
