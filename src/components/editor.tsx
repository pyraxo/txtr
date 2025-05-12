import useStore from "@/lib/store";

export default function Editor({
  selectionRef,
}: {
  selectionRef: React.RefObject<HTMLTextAreaElement>;
}) {
  const text = useStore((state) => state.text);
  const setText = useStore((state) => state.setText);
  const updateSelection = useStore((state) => state.updateSelection);
  const resetSelection = useStore((state) => state.resetSelection);
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
            updateSelection(target.selectionStart, target.selectionEnd);
          }}
          onBlur={resetSelection}
        />
      </div>
    </div>
  );
}
