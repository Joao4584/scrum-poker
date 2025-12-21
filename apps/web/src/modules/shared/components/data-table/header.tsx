import { memo, useCallback } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { Column } from '@tanstack/react-table'

import { Button } from '@/modules/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/modules/shared/ui/dropdown-menu'


interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>
  title: string
  canSort?: boolean
}

function Component<TData, TValue>({
  column,
  title,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (params: { [key: string]: string }) => {
      const newParams = new URLSearchParams(searchParams.toString())

      Object.keys(params).forEach((key) => {
        const value = params[key] || ''
        newParams.set(key, value)
      })

      return newParams.toString()
    },
    [searchParams],
  )

  function handleOrder(order: 'ASC' | 'DESC') {
    router.push(
      `${pathname}?${createQueryString({
        sortField: column.id,
        sortOrder: order,
      })}`,
      {
        scroll: false,
      },
    )
  }


  if (!column.getCanSort()) {
    return <div>{title}</div>
  }

  return (
    <div className="flex items-center space-x-2">
     <span>{title}</span>
    </div>
  )
}

export const DataTableColumnHeader = memo(Component) as typeof Component
