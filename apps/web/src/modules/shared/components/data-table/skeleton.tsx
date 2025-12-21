import { Skeleton } from '@/modules/shared/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/modules/shared/ui/table'

type SkeletonTableProps = {
  rows?: number
  columns: number
}

export function SkeletonTableBody({ rows = 15, columns }: SkeletonTableProps) {
  return (
    <TableBody>
      {Array.from({ length: rows }).map((_, row) => {
        return (
          <TableRow key={row}>
            {Array.from({ length: columns }).map((_, column) => {
              return (
                <TableCell key={column}>
                  <Skeleton className="h-6 w-full" />
                </TableCell>
              )
            })}
          </TableRow>
        )
      })}
    </TableBody>
  )
}

export function SkeletonTableHeader({ columns }: SkeletonTableProps) {
  return (
    <TableHeader>
      <TableRow>
        {Array.from({ length: columns }).map((_, column) => {
          return (
            <TableHead key={column}>
              <div className="flex ">
                <Skeleton className="mr-4 h-6 w-[20%]" />
                <Skeleton className="mr-2 h-6 w-[80%]" />
              </div>
            </TableHead>
          )
        })}
      </TableRow>
    </TableHeader>
  )
}

export function SkeletonTable() {
  return (
    <Table>
      <SkeletonTableHeader columns={5} />
      <SkeletonTableBody columns={5} />
    </Table>
  )
}
