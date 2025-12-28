"use client";

import React, { useCallback, useState } from "react";
import { parseAsInteger, useQueryState } from "nuqs";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Send, Users } from "lucide-react";

import {
  DataTableViewOptions,
  DataTableEmptyState,
  useTableSettings,
  RenderTable,
} from "@/modules/shared/components/data-table";
import { useColumns } from "./use-columns";
import { useListFriends } from "../../hooks/use-friends";

export function FriendListTable() {
  const columns: any = useColumns();

  const { columnOrder, columnVisibility, handleColumnOrderChange, handleColumnVisibilityChange } = useTableSettings(
    "service-panel-administrative",
    columns,
  );

  const [filters, setFilters] = useState<any>({} as any);

  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const handleFilters = useCallback(
    (filters: any) => {
      setFilters(filters);
      setPage(null);
    },
    [setPage],
  );

  const { data: services, isLoading } = useListFriends({
    page,
    filters,
  });

  const table = useReactTable({
    data: services?.data || [],
    columns,
    manualPagination: true,
    rowCount: services?.meta.total || 0,
    state: {
      columnVisibility,
      pagination: { pageIndex: page - 1, pageSize: 10 },
    },
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: handleColumnVisibilityChange,
  });

  const renderTable = () => {
    if (services?.meta?.total === 0) {
      return (
        <DataTableEmptyState title={`Nenhum Serviço Encontrado`} description={""} icon={Users}></DataTableEmptyState>
      );
    }

    return (
      <RenderTable
        columns={columns}
        columnOrder={columnOrder}
        onColumnOrderChange={handleColumnOrderChange}
        table={table}
        isLoading={isLoading}
      />
    );
  };

  return (
    <React.Fragment>
      <div className="mb-3 flex w-full justify-between">
        <div className="flex items-end gap-2">
          <DataTableViewOptions table={table} />
        </div>
      </div>
      {renderTable()}
    </React.Fragment>
  );
}
