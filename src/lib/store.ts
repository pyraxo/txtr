import Store from "@/types/store";
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
}));

export default useStore;
