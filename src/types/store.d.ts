type State = {
  text: string;
  selection: TextSelection;
  insertText: string;
  insertMode: boolean;
}

type Actions = {
  setText: (text: string) => void;
  updateSelection: (start: number, end: number) => void;
  setInsertText: (text: string) => void;
  setInsertMode: (mode: boolean) => void;
  resetSelection: () => void;
}

interface Store extends State, Actions { }

export default Store;
