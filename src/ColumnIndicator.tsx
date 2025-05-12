import * as React from "react";
import classNames from "classnames";
import * as Types from "./types";
import * as Actions from "./actions";
import useDispatch from "./use-dispatch";
import useSelector from "./use-selector";
import ColumnIndicatorEditor from "./ColumnIndicatorEditor";

const ColumnIndicator: Types.ColumnIndicatorComponent = ({
  column,
  label,
  selected,
  onSelect,
  editMode,
  onEdit,
  editorValue,
  onEditorValueChange,
  onEditorBlur
}) => {
  const handleClick = React.useCallback(
    (event: React.MouseEvent) => {
      if (event.detail === 2 && onEdit) {
        // Double click - activate edit mode
        onEdit(column);
      } else {
        // Single click - select column
        onSelect(column, event.shiftKey);
      }
    },
    [onSelect, onEdit, column]
  );

  return (
    <th
      className={classNames("Spreadsheet__header", {
        "Spreadsheet__header--selected": selected,
        "Spreadsheet__header--editing": editMode
      })}
      onClick={handleClick}
      tabIndex={0}
    >
      {editMode && onEditorValueChange && onEditorBlur ? (
        <ColumnIndicatorEditor
          column={column}
          value={editorValue}
          onChange={onEditorValueChange}
          onBlur={onEditorBlur}
        />
      ) : (
        label !== undefined ? label : columnIndexToLabel(column)
      )}
    </th>
  );
};

export default ColumnIndicator;

export const enhance = (
  ColumnIndicatorComponent: Types.ColumnIndicatorComponent
): React.FC<Omit<Types.ColumnIndicatorProps, "selected" | "onSelect" | "editMode" | "onEdit" | "editorValue" | "onEditorValueChange" | "onEditorBlur">> => {
  return function ColumnIndicatorWrapper(props) {
    const dispatch = useDispatch();
    const selectEntireColumn = React.useCallback(
      (column: number, extend: boolean) =>
        dispatch(Actions.selectEntireColumn(column, extend)),
      [dispatch]
    );
    
    const editColumnHeader = React.useCallback(
      (column: number) => 
        dispatch(Actions.editColumnHeader(column)),
      [dispatch]
    );

    const selected = useSelector((state) =>
      state.selected.hasEntireColumn(props.column)
    );
    
    const editingHeader = useSelector((state) => 
      state.editingHeader && state.editingHeader.type === 'column' && state.editingHeader.index === props.column
    );

    const columnLabels = useSelector((state) => state.columnLabels);
    const editorValue = editingHeader ? 
      (columnLabels ? columnLabels[props.column] : columnIndexToLabel(props.column)) : 
      undefined;
    
    const handleEditorValueChange = React.useCallback(
      (column: number, value: string) =>
        dispatch(Actions.setColumnHeaderValue(column, value)),
      [dispatch]
    );
    
    const handleEditorBlur = React.useCallback(
      () => dispatch(Actions.commitColumnHeader()),
      [dispatch]
    );

    return (
      <ColumnIndicatorComponent
        {...props}
        selected={selected}
        onSelect={selectEntireColumn}
        editMode={editingHeader}
        onEdit={editColumnHeader}
        editorValue={editorValue}
        onEditorValueChange={handleEditorValueChange}
        onEditorBlur={handleEditorBlur}
      />
    );
  };
};

function columnIndexToLabel(column: number): string {
  let label = "";
  let index = column;
  while (index >= 0) {
    label = String.fromCharCode(65 + (index % 26)) + label;
    index = Math.floor(index / 26) - 1;
  }
  return label;
}