import Editor from "@/components/editor";
import Footer from "@/components/footer";
import Hotkeys from "@/components/hotkeys";
import Sidebar from "@/components/sidebar";
import { getFiles } from "@/lib/store";
import { useEffect, useRef } from "react";
import useStore from "./lib/state";

export default function App() {
  const selection = useStore((state) => state.selection);
  const selectionRef = useRef<HTMLTextAreaElement>(null);
  const setSelectedFile = useStore((state) => state.setSelectedFile);
  const selectedFile = useStore((state) => state.selectedFile);

  if (!import.meta.env.DEV) {
    document.oncontextmenu = (event) => event.preventDefault();
  }
  const setFiles = useStore((state) => state.setFiles);

  useEffect(() => {
    const fetchFiles = async () => {
      console.log("App.tsx: Fetching files from store...");
      const loadedFiles = await getFiles();
      console.log("App.tsx: Loaded files:", loadedFiles);
      setFiles(loadedFiles);

      const filePaths = Object.keys(loadedFiles);
      if (filePaths.length > 0) {
        const firstFilePath = filePaths[0];
        const firstFileObject = loadedFiles[firstFilePath];
        if (firstFileObject) {
          console.log(
            "App.tsx: Attempting to set selected file:",
            firstFileObject
          );
          setSelectedFile(firstFileObject);
        } else {
          console.error(
            "App.tsx: First file object is missing for path:",
            firstFilePath
          );
        }
      } else {
        console.log("App.tsx: No files found in store.");
      }
    };
    fetchFiles();
  }, [setFiles, setSelectedFile]);

  useEffect(() => {
    console.log("App.tsx: selectedFile state changed to:", selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    if (selectionRef.current) {
      selectionRef.current.setSelectionRange(selection.start, selection.end);
      selectionRef.current.focus();
    }
  }, [selection]);

  return (
    <main className="select-none h-[calc(100vh-30px)] w-screen flex dark bg-background">
      <Hotkeys />
      <Sidebar />
      <div className="flex flex-col grow">
        <Editor selectionRef={selectionRef} />
        <Footer />
      </div>
    </main>
  );
}
