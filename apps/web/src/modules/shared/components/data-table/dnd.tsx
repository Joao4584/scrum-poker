import { CSSProperties } from "react";

import { Cell, Header, flexRender } from "@tanstack/react-table";

import { TableCell, TableHead } from "@/modules/shared/ui/table";

import { DataTableColumnHeader } from "./header";

type DraggableTableHeaderProps<T> = {
  header: Header<T, unknown>;
};

export const DraggableTableHeader = <T,>({ header }: DraggableTableHeaderProps<T>) => {
  const style: CSSProperties = {
    whiteSpace: "nowrap",
    width: header.column.getSize(),
  };

  return (
    <TableHead colSpan={header.colSpan} style={style}>
      {header.isPlaceholder ? null : (
        <DataTableColumnHeader column={header.column} title={header.column.columnDef.meta as string} />
      )}
    </TableHead>
  );
};

export const DragAlongCell = <T,>({ cell }: { cell: Cell<T, unknown> }) => {
  const style: CSSProperties = {
    width: cell.column.getSize(),
  };

  return <TableCell style={style}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>;
};
