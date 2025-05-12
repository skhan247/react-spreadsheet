import * as React from "react";
import { moveCursorToEnd } from "./util";
import * as Types from "./types";

/** Component for editing column headers */
const ColumnIndicatorEditor: React.FC<Types.ColumnIndicatorEditorProps> = ({ 
  column, 
  value, 
  onChange,
  onBlur
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(column, event.target.value);
    },
    [onChange, column]
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === "Escape") {
        onBlur();
        event.preventDefault();
      }
    },
    [onBlur]
  );

  React.useEffect(() => {
    if (inputRef.current) {
      moveCursorToEnd(inputRef.current);
    }
  }, [inputRef]);

  return (
    <div className="Spreadsheet__header-editor">
      <input
        ref={inputRef}
        type="text"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={onBlur}
        value={value || ""}
        autoFocus
      />
    </div>
  );
};

export default ColumnIndicatorEditor;