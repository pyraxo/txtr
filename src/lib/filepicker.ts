import type { LocalFile } from "@/types/file";
import { open as openDialog } from "@tauri-apps/plugin-dialog";
import { open } from "@tauri-apps/plugin-fs";

export async function openFile(): Promise<LocalFile | null> {
  const filepath = await openDialog({
    multiple: false,
    directory: false,
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
  };
}

export async function saveFile(
  content: string,
  filepath: string
): Promise<string | null> {
  const file = await open(filepath, {
    write: true,
    create: true,
  });

  await file.write(new TextEncoder().encode(content));
  await file.close();

  return filepath;
}
