import type { LocalFile } from "@/types/file";
import { open as openDialog, save as saveDialog } from "@tauri-apps/plugin-dialog";
import { open, writeTextFile } from "@tauri-apps/plugin-fs";

export async function openFile(): Promise<LocalFile | null> {
  const filepath = await openDialog({
    multiple: false,
    directory: false,
    title: "Open File"
  });

  if (!filepath) {
    return null;
  }

  const file = await open(filepath, {
    read: true,
  });

  const stat = await file.stat();
  const buf = new Uint8Array(stat.size);
  await file.read(buf);
  const textContents = new TextDecoder().decode(buf);
  await file.close();

  return {
    path: filepath,
    content: textContents,
    name: filepath.split("/").pop() || "untitled",
    isNewFile: false,
  };
}

export async function saveFile(
  content: string,
  filepath: string
): Promise<void> {
  return await writeTextFile(filepath, content);
}

export async function openNewFile(defaultName: string | null): Promise<string | null> {
  const filepath = await saveDialog({
    title: "Save File",
    filters: [{
      name: "Text Files",
      extensions: ["txt", "md", "mdx"]
    }],
    defaultPath: defaultName ? `${defaultName}.md` : undefined
  });

  return filepath || null;
}
