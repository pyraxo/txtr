import Editor from "@/components/editor";
import Footer from "@/components/footer";
import Hotkeys from "@/components/hotkeys";
import Sidebar from "@/components/sidebar";
import { useEffect, useRef } from "react";
import useStore from "./lib/store";

export default function App() {
  const selection = useStore((state) => state.selection);

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

  useEffect(() => {
    if (selectionRef.current) {
      selectionRef.current.setSelectionRange(selection.start, selection.end);
    }
  }, [selection]);

  return (
    <main className="select-none h-[calc(100vh-30px)] w-screen flex dark bg-background ">
      <Hotkeys />
      <Sidebar />
      <div className="flex flex-col grow">
        <Editor selectionRef={selectionRef} />
        <Footer />
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
