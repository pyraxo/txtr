import { LocalFile } from "@/types/file";
import Store from "@/types/state";
import { create } from "zustand";

const getLineNumber = (text: string, index: number) => {
  return text.slice(0, index).split("\n").length;
};

const useStore = create<Store>()((set) => ({
  text: "",
  setText: (text: string) => set({ text }),
  selection: {
    start: null,
    end: null,
    startLine: null,
    endLine: null,
  },
  updateSelection: (start: number, end: number) => {
    set((state) => ({
      selection: {
        start,
        end,
        startLine: getLineNumber(state.text, start),
        endLine: getLineNumber(state.text, end),
      },
    }));
  },
  insertText: "",
  setInsertText: (toInsert: string) => {
    set((state) => ({
      text: state.text.slice(0, state.selection.start ?? 0) + toInsert + state.text.slice(state.selection.end ?? 0),
      insertText: "",
    }));
  },
  insertMode: false,
  setInsertMode: (mode: boolean) => set({ insertMode: mode }),
  resetSelection: () => {
    set(() => ({
      selection: {
        start: null,
        end: null,
        startLine: null,
        endLine: null,
      },
    }));
  },
  selectedFile: null,
  setSelectedFile: (file: LocalFile) => set({ selectedFile: file.path, text: file.content }),
  resetSelectedFile: () => set({ selectedFile: null }),
  modifiedFiles: {},
  addModifiedFile: (path: string) => set(state => ({ modifiedFiles: { ...state.modifiedFiles, [path]: true } })),
  removeModifiedFile: (path: string) => set(state => ({ modifiedFiles: { ...state.modifiedFiles, [path]: false } })),
  clearModifiedFiles: () => set({ modifiedFiles: {} }),
  files: {},
  setFiles: (files: Record<string, LocalFile>) => set({ files }),
  includeFile: (path: string, file: LocalFile) => set(state => ({
    files: { ...state.files, [path]: file }
  })),
  dropFile: (path: string) => set(state => {
    const { [path]: _, ...rest } = state.files;
    return { files: rest };
  }),
}));

export default useStore;
