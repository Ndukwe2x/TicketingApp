'use client';
import { 
    ColumnDef, 
    ColumnFiltersState, 
    SortingState, 
    VisibilityState 
} from "@tanstack/react-table";
import React, { ReactNode } from "react";

interface DataGridProps<TData, TValue> {
    children: ReactNode[];
    columns: ColumnDef<TData, TValue>[];
    columnCount: number;
    data: TData[];
    fallback: string;
    isFilteringEnabled?: boolean;
    filterFields?: string[];
}
export function DataGrid<TData, TValue>({ children, columns, columnCount, data, fallback, isFilteringEnabled = false, filterFields }: DataGridProps<TData, TValue>) {
    
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [filterField, setFilterField] = React.useState('');

    return (
        <div className={ 'grid '}>
            { children }
        </div>
    )
}