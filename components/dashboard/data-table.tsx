'use client'

import * as React from 'react'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type RowSelectionState,
} from '@tanstack/react-table'
import { ChevronDown, ChevronUp } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchable?: boolean
  searchPlaceholder?: string
  loading?: boolean
  /** Enable row selection; use with a select column */
  rowSelection?: RowSelectionState
  onRowSelectionChange?: (updater: (prev: RowSelectionState) => RowSelectionState) => void
  /** Row id accessor for selection (default: row.original.id) */
  getRowId?: (row: TData) => string
}

/**
 * DataTable component with sorting, filtering, and pagination
 * Uses TanStack Table for powerful table functionality
 */
export function DataTable<TData, TValue>({
  columns,
  data,
  searchable = false,
  searchPlaceholder = 'Search...',
  loading = false,
  rowSelection,
  onRowSelectionChange,
  getRowId,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState('')

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: onRowSelectionChange ?? (() => {}),
    getRowId: getRowId as any,
    enableRowSelection: !!onRowSelectionChange,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      ...(onRowSelectionChange && rowSelection !== undefined
        ? { rowSelection }
        : {}),
    },
  })

  if (loading) {
    return (
      <div className="space-y-4">
        {searchable && (
          <div className="h-10 w-full max-w-sm animate-pulse rounded-md bg-muted" />
        )}
        <div className="rounded-md border">
          <div className="h-96 animate-pulse bg-muted/50" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {searchable && (
        <Input
          placeholder={searchPlaceholder}
          value={globalFilter ?? ''}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {data.length} results
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

/**
 * Helper function to create sortable column header
 * @param title - Column header text
 * @param iconClassName - Optional class for the sort icon (e.g. "text-[#34C759]")
 */
export function createSortableHeader(title: string, iconClassName?: string) {
  const iconClass = iconClassName ? `ml-2 h-4 w-4 ${iconClassName}` : 'ml-2 h-4 w-4'
  return ({ column }: { column: any }) => {
    const sorted = column.getIsSorted()
    return (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(sorted === 'asc')}
        className="-ml-4 h-8"
      >
        {title}
        {sorted === 'asc' ? (
          <ChevronUp className={iconClass} />
        ) : (
          <ChevronDown className={iconClass} />
        )}
      </Button>
    )
  }
}
