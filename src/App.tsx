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
  const setText = useStore((state) => state.setText);
  if (!import.meta.env.DEV) {
    document.oncontextmenu = (event) => event.preventDefault();
  }
  const setFiles = useStore((state) => state.setFiles);

  useEffect(() => {
    const fetchFiles = async () => {
      const files = await getFiles();
      if (Object.keys(files).length > 0) {
        const firstFile = Object.keys(files)[0];
        setSelectedFile(files[firstFile]);
        setText(files[firstFile].content);
        setFiles(files);
        console.log("Set first file");
      }
    };
    fetchFiles();
  }, []);

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
