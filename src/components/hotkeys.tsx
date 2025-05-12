import { INSERTS } from "@/lib/inserts";
import useStore from "@/lib/store";
import { useEffect } from "react";

export default function Hotkeys() {
  const insertMode = useStore((state) => state.insertMode);
  const setInsertMode = useStore((state) => state.setInsertMode);
  const setInsertText = useStore((state) => state.setInsertText);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey && event.key === "i") {
        return setInsertMode(true);
      }

      if (event.metaKey && event.key === "[") {
      }

      if (insertMode) {
        if (event.key === "Escape") {
          return setInsertMode(false);
        }

        const insert = INSERTS.find((insert) => insert.key === event.key);
        if (event.metaKey && insert) {
          setInsertMode(false);
          return setInsertText(insert.action());
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [insertMode]);

  return <></>;
}
