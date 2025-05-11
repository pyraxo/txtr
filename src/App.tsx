import Editor from "@/components/editor";
import Footer from "@/components/footer";
import Sidebar from "@/components/sidebar";
import { Selection } from "@/selection";
import { useEffect, useRef, useState } from "react";

export default function App() {
  const [text, setText] = useState("");
  const [selection, setSelection] = useState<Selection>({
    start: null,
    end: null,
    line: null,
  });
  const selectionRef = useRef<HTMLTextAreaElement>(null);
  // const [greetMsg, setGreetMsg] = useState("");
  // const [name, setName] = useState("");

  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  //   setGreetMsg(await invoke("greet", { name }));
  // }

  if (!import.meta.env.DEV) {
    document.oncontextmenu = (event) => event.preventDefault();
  }

  const [insertMode, setInsertMode] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey && event.key === "i") {
        setInsertMode(!insertMode);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [insertMode]);

  useEffect(() => {
    if (selectionRef.current) {
      selectionRef.current.setSelectionRange(selection.start, selection.end);
    }
  }, [selection]);

  return (
    <main className="select-none h-[calc(100vh-30px)] w-screen flex dark bg-background ">
      <Sidebar text={text} selection={selection} setSelection={setSelection} />
      <div className="flex flex-col grow">
        <Editor
          text={text}
          setText={setText}
          setSelection={setSelection}
          insertMode={insertMode}
          selectionRef={selectionRef}
        />
        <Footer text={text} selection={selection} insertMode={insertMode} />
      </div>
      {/* <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input=
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>
      <p>{greetMsg}</p> */}
    </main>
  );
}
