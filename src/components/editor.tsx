import useStore from "@/lib/state";

export default function Editor({
  selectionRef,
}: {
  selectionRef: React.RefObject<HTMLTextAreaElement>;
}) {
  const text = useStore((state) => state.text);
  const setText = useStore((state) => state.setText);
  const updateSelection = useStore((state) => state.updateSelection);
  const resetSelection = useStore((state) => state.resetSelection);
  const selectedFile = useStore((state) => state.selectedFile);
  const addModifiedFile = useStore((state) => state.addModifiedFile);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (selectedFile) {
      const newText = e.target.value;
      setText(newText);
      addModifiedFile(selectedFile);
    }
  };
  return (
    <div className="grow overflow-y-auto">
      <div className="pl-2 pr-4 py-[6px] cursor-text overflow-hidden">
        <textarea
          ref={selectionRef}
          className="editor-area text-foreground text-sm w-full h-[calc(100vh-110px)] outline-none shadow-none resize-none focus:outline-none focus:ring-0 focus:ring-offset-0 leading-[1.5]"
          value={text}
          onChange={handleTextChange}
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
