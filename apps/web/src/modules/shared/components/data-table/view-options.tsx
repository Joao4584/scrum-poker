'use client'

import { Table } from '@tanstack/react-table'

import { SlidersHorizontal } from 'lucide-react'

import { Button } from '@/modules/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/modules/shared/ui/dropdown-menu'
import { Skeleton } from '@/modules/shared/ui/skeleton'

type DataTableViewOptionsProps<TData> = {
  table: Table<TData>
  isLoading?: boolean
}

export function DataTableViewOptions<TData>({
  table,
  isLoading = false,
}: DataTableViewOptionsProps<TData>) {

  if (isLoading) {
    return <Skeleton className="h-8 w-36" />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex gap-2 border border-dashed text-sm"
          aria-label="toggle columns"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Visualizar
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-auto">
        <DropdownMenuLabel>Alterar colunas</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== 'undefined' && column.getCanHide(),
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(value)}
                onSelect={(e) => e.preventDefault()}
              >
                {column.columnDef.meta as string}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
