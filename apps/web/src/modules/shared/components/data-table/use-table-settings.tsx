'use client'

import { useState, useCallback, useEffect, type SetStateAction } from 'react'

import { useLocalStorage } from '@/modules/shared/hooks/use-local-storage'
import { storageKey } from '@/modules/shared/config/storage-key'
import { ColumnOrderState } from '@tanstack/react-table'

type ColumnVisibility = { [key: string]: boolean }

export function useTableSettings(
  name: string,
  columns: Array<{ accessorKey: string }>,
) {

  const orderStorage = useLocalStorage<string[]>(
    `${storageKey}table-order-${name}`,
    [],
  )

  const getInitialColumnOrder = () => {
    if (orderStorage.value?.length) {
      return orderStorage.value
    }

    return columns.map((c) => c.accessorKey!) as string[]
  }

  const [columnOrder, setColumnOrder] = useState<string[]>(
    getInitialColumnOrder(),
  )

  const handleColumnOrderChange = useCallback(
    (newOrder: SetStateAction<ColumnOrderState>) => {
      setColumnOrder(newOrder)
    },
    [],
  )

  const visibilityStorage = useLocalStorage<ColumnVisibility>(
    `${storageKey}table-visibility-${name}`
  )

  
  const getInitialColumnVisibility = () => {
    if (visibilityStorage.value) {
      return visibilityStorage.value
    }

    return {}
  }

  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(
    getInitialColumnVisibility(),
  )

  const handleColumnVisibilityChange = useCallback(
    (newVisibility: SetStateAction<ColumnVisibility>) => {
      setColumnVisibility(newVisibility)
    },
    [],
  )

  useEffect(() => {
    visibilityStorage.setValue(columnVisibility)
  }, [columnVisibility, visibilityStorage])

  useEffect(() => {
    orderStorage.setValue(columnOrder)
  }, [columnOrder, orderStorage])

  return {
    columnOrder,
    handleColumnOrderChange,
    columnVisibility,
    handleColumnVisibilityChange,
  }
}
