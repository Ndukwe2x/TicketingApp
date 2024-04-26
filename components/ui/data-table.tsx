'use client';

import * as React from 'react';
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Skeleton } from './skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import * as ChangeCase from "change-case";
import '../../app/globals.css';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    fallback: string;
    isFilteringEnabled?: boolean;
    filterFields?: string[];
}

export function DataTable<TData, TValue>({ columns, data, fallback, isFilteringEnabled = false, filterFields }: DataTableProps<TData, TValue>) {
    
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [filterField, setFilterField] = React.useState('');

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    // Event handler
    const changeFilterField = (ev) => {

    }

    return (
        <div className='w-full'>
            {
                isFilteringEnabled && 
                <div className='grid gap-3 sm:gap-5 md:grid-cols-3 pb-4 sm:grid-cols-2 sm:items-end lg:grid-cols-[2fr_3fr_4fr]'>
                    {
                        filterFields?.length &&
                        <div className="filter-field w">
                            <span>Filter by:</span>
                            <Select name="field" onValueChange={ (value) => setFilterField(value) }>
                                <SelectTrigger>
                                    <SelectValue placeholder='Filter field' />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        filterFields.map((field, index) => <SelectItem key={index} 
                                        value={field}>{ ChangeCase.capitalCase(ChangeCase.camelCase(field)) }</SelectItem>)
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                    }
                    <div className="filter-value">
                        <Input
                            placeholder='Filter...'
                            value={(table.getColumn(filterField)?.getFilterValue() as string) ?? ''}
                            onChange={(event) =>
                                table.getRow(filterField)?.setFilterValue(event.target.value)
                            }
                            // className='max-w-sm'
                        />
                    </div>
                </div>
            }
            <div className='overflow-auto'>
                <Table className='min-w-[50rem]'>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
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
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className='h-24 md:text-center'>
                                    { fallback }
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className='flex items-center justify-end space-x-2 py-4'>
                <div className='space-x-2'>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <span className='mx-2'>
                        {!!table.getPageCount() &&
                            `${table.getState().pagination.pageIndex + 1} of `}
                        {table.getPageCount()}
                    </span>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}

export function DataTableLoading({showHeader, columnCount}: {showHeader?: boolean, columnCount?: number}) {
    let columns = [];
    if (showHeader && columnCount) {
        for (let i = 0; i < columnCount; i++) {
            columns.push(i);      
        }
    }
    return (
        <div>
            {
                showHeader && columnCount && 
                <div className='flex gap-4'>
                    {columns.map((i) => (
                        <Skeleton key={i} className='w-full h-6' />
                    ))}
                </div>
            }
            <Skeleton className='mt-4 w-full h-4' />
            <Skeleton className='mt-4 w-full h-4' />
            <Skeleton className='mt-4 w-full h-4' />
        </div>
    );
}
