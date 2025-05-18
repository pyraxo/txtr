import { openFile, openNewFile, saveFile } from "@/lib/filepicker";
import { INSERTS } from "@/lib/inserts";
import useStore from "@/lib/state";
import { addFile, clearFiles, removeFile } from "@/lib/store";
import { LocalFile } from "@/types/file";
import { useEffect } from "react";

export default function Hotkeys() {
  const insertMode = useStore((state) => state.insertMode);
  const setInsertMode = useStore((state) => state.setInsertMode);
  const setInsertText = useStore((state) => state.setInsertText);
  // const setText = useStore((state) => state.setText);
  const setFileText = useStore((state) => state.setFileText);

  const selectedFile = useStore((state) => state.selectedFile);
  const resetSelectedFile = useStore((state) => state.resetSelectedFile);
  const setSelectedFile = useStore((state) => state.setSelectedFile);

  const includeFile = useStore((state) => state.includeFile);
  const dropFile = useStore((state) => state.dropFile);
  const files = useStore((state) => state.files);
  const setFiles = useStore((state) => state.setFiles);
  const removeModifiedFile = useStore((state) => state.removeModifiedFile);
  const updateFile = useStore((state) => state.updateFile);

  const handleFileAdd = async (fileInfo: LocalFile) => {
    console.log(fileInfo);
    await addFile(fileInfo.path, fileInfo);
    includeFile(fileInfo.path, fileInfo);
    setSelectedFile(fileInfo);
    // setFileText(fileInfo.path, fileInfo.content);
  };

  const handleFileRemove = async () => {
    if (!selectedFile) {
      return;
    }
    console.log("im trying to remove2");
    if (Object.keys(files).length > 1) {
      const idx = Object.keys(files).indexOf(selectedFile);
      await removeFile(selectedFile);
      dropFile(selectedFile);
      if (idx > 0) {
        setSelectedFile(files[Object.keys(files)[idx - 1]]);
      } else {
        setSelectedFile(files[0 - idx]);
      }
    } else {
      resetSelectedFile();
      setFileText(selectedFile, "");
      await removeFile(selectedFile);
      dropFile(selectedFile);
    }
  };

  const handleFileSave = async () => {
    console.log(
      "handleFileSave: Triggered. Current selectedFile:",
      selectedFile
    );
    console.log(
      "handleFileSave: Current files state:",
      typeof structuredClone === "function" ? structuredClone(files) : files
    );

    if (!selectedFile) {
      console.log("handleFileSave: No file selected, returning.");
      return;
    }

    const currentFileObject = files[selectedFile];
    console.log(
      "handleFileSave: currentFileObject from files[selectedFile]:",
      currentFileObject
    );

    if (!currentFileObject) {
      console.error(
        "handleFileSave: selectedFile path does not exist as a key in the files object. selectedFile:",
        selectedFile
      );
      return;
    }

    console.log("handleFileSave: File path to check:", currentFileObject.path);
    if (!currentFileObject.isNewFile) {
      try {
        await saveFile(currentFileObject.content, currentFileObject.path);
        console.log("handleFileSave: File saved successfully.");
        removeModifiedFile(selectedFile);
      } catch (error) {
        console.error(
          "handleFileSave: Error during saveFile operation:",
          error
        );
      }
    } else {
      const filepath = await openNewFile(currentFileObject.name);
      if (filepath) {
        console.log("handleFileSave: New file path:", filepath);
        const toSave: LocalFile = {
          path: filepath,
          content: currentFileObject.content,
          name: filepath.split("/").pop() || currentFileObject.name,
          isNewFile: false,
        };
        await saveFile(toSave.content, toSave.path);
        updateFile(currentFileObject.path, toSave.path, toSave);
        setSelectedFile(toSave);
      }
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

      if (event.metaKey && event.key === "n") {
        // New file
        const newFileName = new Date().toISOString().split("T")[0];
        const newFile: LocalFile = {
          path: `local-${newFileName}`,
          content: "",
          name: newFileName,
          isNewFile: true,
        };
        includeFile(`local-${newFileName}`, newFile);
        setSelectedFile(newFile);
      }

      if (event.metaKey && event.key === "s") {
        event.preventDefault();
        await handleFileSave();
      }

      if (event.metaKey && event.shiftKey && event.key === "c") {
        await handleFileRemove();
      }

      if (event.metaKey && event.shiftKey && event.key === "x") {
        await clearFiles();
        resetSelectedFile();
        // setText("");
        setFiles({});
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
  }, [
    insertMode,
    setInsertMode,
    setInsertText,
    setFileText,
    selectedFile,
    resetSelectedFile,
    setSelectedFile,
    includeFile,
    dropFile,
    files,
    setFiles,
    removeModifiedFile,
    handleFileAdd,
    handleFileRemove,
    handleFileSave,
  ]);

  return <></>;
}
