import { openFile } from "@/lib/filepicker";
import { INSERTS } from "@/lib/inserts";
import useStore from "@/lib/state";
import { addFile, removeFile } from "@/lib/store";
import { LocalFile } from "@/types/file";
import { useEffect } from "react";

export default function Hotkeys() {
  const insertMode = useStore((state) => state.insertMode);
  const setInsertMode = useStore((state) => state.setInsertMode);
  const setInsertText = useStore((state) => state.setInsertText);
  const setText = useStore((state) => state.setText);

  const selectedFile = useStore((state) => state.selectedFile);
  const resetSelectedFile = useStore((state) => state.resetSelectedFile);
  const setSelectedFile = useStore((state) => state.setSelectedFile);

  const includeFile = useStore((state) => state.includeFile);
  const dropFile = useStore((state) => state.dropFile);
  const files = useStore((state) => state.files);

  const handleFileAdd = async (fileInfo: LocalFile) => {
    console.log(fileInfo);
    await addFile(fileInfo.path, fileInfo);
    includeFile(fileInfo.path, fileInfo);
    setSelectedFile(fileInfo);
    setText(fileInfo.content);
    console.log("file added");
  };

  const handleFileRemove = async () => {
    console.log("im trying to remove");
    if (!selectedFile) {
      return;
    }
    console.log("im trying to remove2");
    if (Object.keys(files).length > 1) {
      const idx = Object.keys(files).indexOf(selectedFile);
      if (idx > 0) {
        setSelectedFile(files[Object.keys(files)[idx - 1]]);
      } else {
        setSelectedFile(files[0 - idx]);
      }
      await removeFile(selectedFile);
      dropFile(selectedFile);
    } else {
      resetSelectedFile();
      setText("");
      await removeFile(selectedFile);
      dropFile(selectedFile);
    }
  };

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (event.metaKey && event.key === "i") {
        return setInsertMode(true);
      }

      if (event.metaKey && event.key === "o") {
        const fileInfo: LocalFile | null = await openFile();
        if (fileInfo) {
          await handleFileAdd(fileInfo);
        }
      }

      if (event.metaKey && event.shiftKey && event.key === "c") {
        await handleFileRemove();
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
