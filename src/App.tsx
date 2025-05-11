import Editor from "@/components/editor";
import Footer from "@/components/footer";
import Sidebar from "@/components/sidebar";
import { Selection } from "@/selection";
import { useState } from "react";

export default function App() {
  const [text, setText] = useState("");
  const [selection, setSelection] = useState<Selection>({
    start: null,
    end: null,
    line: null,
  });
  // const [greetMsg, setGreetMsg] = useState("");
  // const [name, setName] = useState("");

  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  //   setGreetMsg(await invoke("greet", { name }));
  // }

  if (!import.meta.env.DEV) {
    document.oncontextmenu = (event) => event.preventDefault();
  }

  return (
    <main className="select-none h-[calc(100vh-30px)] w-screen flex dark bg-background ">
      <Sidebar text={text} selection={selection} />
      <div className="flex flex-col grow">
        <Editor text={text} setText={setText} setSelection={setSelection} />
        <Footer text={text} selection={selection} />
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
