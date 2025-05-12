import { LocalFile } from "@/types/file";
import Store from "@/types/state";
import { create } from "zustand";

const getLineNumber = (text: string, index: number) => {
  return text.slice(0, index).split("\n").length;
};

const initialSelectionState = {
  start: null,
  end: null,
  startLine: null,
  endLine: null,
};

const useStore = create<Store>()((set) => ({
  text: "",
  setText: (text: string) => set({ text }),
  setFileText: (path: string, text: string) => set(state => ({ files: { ...state.files, [path]: { ...state.files[path], content: text } } })),
  selection: initialSelectionState,
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
  setInsertText: (toInsert: string) => set((state) => {
    if (!state.selectedFile) {
      return state;
    }
    return {
      files: {
        ...state.files,
        [state.selectedFile]: {
          ...state.files[state.selectedFile],
          content: state.files[state.selectedFile].content.slice(0, state.selection.start ?? 0) + toInsert + state.files[state.selectedFile].content.slice(state.selection.end ?? 0)
        }
      },
    };
  }),
  insertMode: false,
  setInsertMode: (mode: boolean) => set({ insertMode: mode }),
  resetSelection: () => {
    set(() => ({
      selection: initialSelectionState,
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
