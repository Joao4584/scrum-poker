import { Table, TableHeader, TableBody, TableRow } from "@/modules/shared/ui/table";

import { AccessorKeyColumnDef, Table as TanstackTable } from "@tanstack/react-table";

import { DraggableTableHeader, DragAlongCell } from "./dnd";
import { DataTablePagination } from "./pagination";
import { SkeletonTableBody, SkeletonTableHeader } from "./skeleton";

type RenderTableProps<TData, TValue> = {
  columns: AccessorKeyColumnDef<TData, TValue>[];
  columnOrder: string[];
  onColumnOrderChange: (order: string[]) => void;
  table: TanstackTable<TData>;
  isLoading: boolean;
  onRowClick?: (row: TData) => void;
};

export function RenderTable<TData, TValue>({
  columns,
  columnOrder,
  onColumnOrderChange,
  table,
  isLoading,
  onRowClick,
}: RenderTableProps<TData, TValue>) {
  const tableRows = table.getState().pagination.pageSize;

  return (
    <div className="flex flex-col gap-3">
      <Table style={{ width: table.getCenterTotalSize(), minWidth: "100%" }}>
        {isLoading ? (
          <SkeletonTableHeader rows={tableRows} columns={columns.length} />
        ) : (
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <DraggableTableHeader key={header.id} header={header} />
                ))}
              </TableRow>
            ))}
          </TableHeader>
        )}

        {isLoading ? (
          <SkeletonTableBody rows={tableRows} columns={columns.length} />
        ) : (
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className={onRowClick ? "cursor-pointer" : ""}
                onClick={() => onRowClick && onRowClick(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <DragAlongCell key={cell.id} cell={cell} />
                ))}
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>

      <DataTablePagination table={table} isLoading={isLoading} />
    </div>
  );
}
