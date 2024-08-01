// 'use client';
// // import useRixUiGrid from "@/hooks/useRixUiGrid";
// import { 
//     ColumnDef, 
//     ColumnFiltersState, 
//     SortingState, 
//     VisibilityState, 
//     useReactTable
// } from "@tanstack/react-table";
// import React, { ReactNode } from "react";
// import { Grid, GridColumn, GridRow } from "./rix-ui/data-layouts/grid/grid";

// interface DataGridProps<TData> {
//     columnDef: GridColumnDef<TData>;
//     columnCount: number;
//     data: TData[] | TData[][] | {};
//     fallback: string;
//     isFilteringEnabled?: boolean;
//     filterFields?: string[];
// }

// export function DataGridLayouts<TData>({ columnDef, columnCount, data, fallback, isFilteringEnabled = false, filterFields }: DataGridProps<TData>) {
    
//     const [sorting, setSorting] = React.useState<SortingState>([]);
//     const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
//     const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
//     const [rowSelection, setRowSelection] = React.useState({});
//     const [filterField, setFilterField] = React.useState('');

//     const grid = useRixUiGrid({
//         data,
//         columnDef,
//         onSortingChange: setSorting,
//         onColumnFiltersChange: setColumnFilters,
//         onColumnVisibilityChange: setColumnVisibility,
//         onRowSelectionChange: setRowSelection,
//     });

//     return (
//         <div className={ 'grid-container '}>
//             <Grid columnCount={ columnCount }>
//                 {grid.getRowModel().rows?.length ? (
//                     grid.getRowModel().rows?.map((row) => (
//                         <GridRow key={ row.id }>
//                             {row.getColumns().map((column) => (
//                                 <GridColumn key={ column.id }>
//                                     { column.getContent() }
//                                 </GridColumn>
//                             ))}
//                         </GridRow>
//                     ))
//                 ): (
//                     <GridRow>
//                         { fallback }
//                     </GridRow>
//                 )}
//             </Grid>
//         </div>
//     )
// }