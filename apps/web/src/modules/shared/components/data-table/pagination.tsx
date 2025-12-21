'use client'

import { useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { Table } from '@tanstack/react-table'

import { Button } from '@/modules/shared/ui/button'
import { Skeleton } from '@/modules/shared/ui/skeleton'


type DataTablePaginationProps<TData> = {
  table: Table<TData>
  isLoading?: boolean
}

export function DataTablePagination<TData>({
  table,
  isLoading,
}: DataTablePaginationProps<TData>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams],
  )

  function navigateToPage(pageIndex: number) {
    router.push(`${pathname}?${createQueryString('page', String(pageIndex))}`, {
      scroll: false,
    })
  }

  const page = table.getState().pagination.pageIndex + 1
  const pageCount = table.getPageCount()
  const rowCount = table.getRowCount()
  const perPage = table.getState().pagination.pageSize


  return isLoading ? (
    <div className="flex justify-between">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-6 w-40" />
    </div>
  ) : (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        Mostrando {perPage * page > rowCount ? rowCount : perPage * page} de {rowCount}
      </div>

      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex w-[105px] items-center justify-center text-sm font-medium">
        Página {page} de {pageCount}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              table.setPageIndex(0)
              navigateToPage(1)
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Ir para a primeira página</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              table.previousPage()
              navigateToPage(page - 1)
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Ir para a página anterior</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              table.nextPage()
              navigateToPage(page + 1)
            }}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Ir para a próxima página</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              table.setPageIndex(pageCount - 1)
              navigateToPage(pageCount)
            }}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Ir para a última página</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
