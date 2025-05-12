import useStore from "@/lib/state";
import React from "react";

export default function Sidebar() {
  const selectedFile = useStore((state) => state.selectedFile);
  const modifiedFiles = useStore((state) => state.modifiedFiles);
  const updateSelection = useStore((state) => state.updateSelection);
  const setSelectedFile = useStore((state) => state.setSelectedFile);
  const files = useStore((state) => state.files);

  const selectedIdx = useStore((state) => {
    const { selection, selectedFile } = state;
    if (!selectedFile || !files[selectedFile]) {
      return null;
    }
    const leadingIdx: number[] = files[selectedFile].content
      .split("\n")
      .reduce(
        (ids: number[], line: string, idx: number): number[] =>
          line.startsWith("#") || line.startsWith("##")
            ? ids.concat(idx + 1)
            : ids,
        []
      );
    return selection.startLine !== null && selection.endLine !== null
      ? Math.max(
          ...leadingIdx.filter(
            (idx: number) =>
              idx >= (selection.startLine || 0) &&
              idx <= (selection.endLine || 0)
          )
        )
      : null;
  });

  const handleClick = (path: string, lineNumber: number) => {
    const file = files[path];
    if (!file?.content) return;

    setSelectedFile(file);

    const lines = file.content.split("\n");
    if (lineNumber < 1 || lineNumber > lines.length) {
      console.error("Invalid line number provided to handleClick:", lineNumber);
      return;
    }

    let startCharIndex = 0;
    for (let i = 0; i < lineNumber - 1; i++) {
      startCharIndex += (lines[i]?.length || 0) + 1;
    }

    const targetLine = lines[lineNumber - 1];
    const endCharIndex = startCharIndex + (targetLine?.length || 0);

    updateSelection(startCharIndex, endCharIndex);
  };
  const handleFileClick = (path: string) => {
    setSelectedFile(files[path]);
  };

  return (
    <div className="select-none shrink-0 w-3/10 max-w-[300px] h-full">
      <div className="px-8 py-[0.5rem] h-full w-full">
        <div className="text-xs text-foreground flex flex-col justify-between leading-[1.5]">
          {Object.entries(files).map(([path, file]) => {
            if (!file || typeof file.content !== "string") {
              return null;
            }

            return (
              <React.Fragment key={path}>
                <div
                  className={`text-foreground flex flex-row justify-between cursor-pointer ${
                    selectedFile === path
                      ? "text-foreground"
                      : "text-muted-foreground"
                  } hover:text-foreground`}
                  onClick={() => handleFileClick(path)}
                >
                  {file.name || "Untitled"}
                  {modifiedFiles[path] && (
                    <div className="text-foreground" key={`${path}-modified`}>
                      *
                    </div>
                  )}
                </div>

                {file.content
                  .split("\n")
                  .reduce((acc: any, line: string, idx: number): any => {
                    const isSelected = selectedIdx === idx + 1;
                    const textColour = isSelected
                      ? "text-foreground"
                      : "text-muted-foreground";
                    if (line.startsWith("##")) {
                      return [
                        ...acc,
                        <div
                          key={`${path}-${idx}`}
                          className={`pl-4 ${textColour} cursor-pointer hover:text-foreground`}
                          onClick={() => handleClick(path, idx + 1)}
                        >
                          {isSelected && (
                            <div
                              className={`pl-[-1.5] absolute left-[2rem] hover:text-foreground`}
                              key={`${path}-${idx}-selected`}
                            >
                              •{" "}
                            </div>
                          )}
                          {line.slice(2)}
                        </div>,
                      ];
                    } else if (line.startsWith("#")) {
                      return [
                        ...acc,
                        <div
                          key={`${path}-${idx}`}
                          className={`cursor-pointer ${textColour} cursor-pointer hover:text-foreground`}
                          onClick={() => handleClick(path, idx + 1)}
                        >
                          {isSelected && (
                            <div
                              className={`pl-[-1.5] absolute left-[1rem] hover:text-foreground`}
                              key={`${path}-${idx}-selected`}
                            >
                              •{" "}
                            </div>
                          )}
                          {line.slice(1)}
                        </div>,
                      ];
                    }
                    return acc;
                  }, [])}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
