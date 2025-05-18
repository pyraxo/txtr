import type { LocalFile } from "@/types/file";
import { load } from "@tauri-apps/plugin-store";
const store = await load("store.json");

export async function getFilesStore(): Promise<Record<string, LocalFile>> {
  if (!(await store.has("files"))) {
    await store.set("files", {});
  }

  return (await store.get("files")) as Record<string, LocalFile>;
}

export async function addFileStore(path: string, file: LocalFile): Promise<void> {
  const files = await getFilesStore();
  await store.set("files", { ...files, [path]: file });
}

export async function removeFileStore(path: string): Promise<void> {
  const files = await getFilesStore();
  delete files[path];
  await store.set("files", files);
}

export async function getFileStore(path: string): Promise<LocalFile | null> {
  const files = await getFilesStore();
  return files[path] || null;
}

export async function clearFilesStore(): Promise<void> {
  await store.set("files", {});
}

export async function setFileStore(path: string, file: LocalFile, oldPath: string | null = null): Promise<void> {
  const files = await getFilesStore();
  if (oldPath) {
    delete files[oldPath];
  }
  await store.set("files", { ...files, [path]: file });
}

export default store;
