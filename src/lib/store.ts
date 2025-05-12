import type { LocalFile } from "@/types/file";
import { load } from "@tauri-apps/plugin-store";
const store = await load("store.json");

export async function getFiles(): Promise<Record<string, LocalFile>> {
  if (!(await store.has("files"))) {
    await store.set("files", {});
  }

  return (await store.get("files")) as Record<string, LocalFile>;
}

export async function addFile(path: string, file: LocalFile): Promise<void> {
  const files = await getFiles();
  await store.set("files", { ...files, [path]: file });
}

export async function removeFile(path: string): Promise<void> {
  const files = await getFiles();
  delete files[path];
  await store.set("files", files);
}

export async function getFile(path: string): Promise<LocalFile | null> {
  const files = await getFiles();
  return files[path] || null;
}

export async function clearFiles(): Promise<void> {
  await store.set("files", {});
}

export default store;
