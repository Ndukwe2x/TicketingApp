import React from "react";

const createRowModel = <TData> (data: TData[], columnDef: GridColumnDef<TData>) => {
    return <RowModel<TData>> {
        rows: [{
            id: 0,
            getColumns: () => {
                return <GridColumn<typeof item1>[]> [...data].map((column, colIndex) => (
                    <GridColumn<typeof item1>> {
                        id: colIndex,
                        getContent() {
                            return columnDef.content(column as TData)
                        },
                    }
                ));
            },
        }]
    }
}

const getCoreRowModel = <TData> (data: TData[] | TData[][], columnDef: GridColumnDef<TData>): RowModel<TData> => {
    if ( !data.length ) {
        return <RowModel<TData>> {
            rows: []
        }
    }
    
    if ( data[0] instanceof Array ) {
        
    } else {
        return createRowModel(data as TData[], columnDef);
    }

    // if (possibleColumn) {
    //     return [{
    //         rows: 
    //     }]
    // }
    

}

const useRixUiGrid = <TData> (options: GridComponentOptions<TData>): GridLayout<TData> => {
    const {
        data, 
        columnDef, 
        onSortingChange, 
        onColumnFiltersChange, 
        onColumnVisibilityChange, 
        onRowSelectionChange
    } = options;

    let dataArr: TData[] | TData[][];
    if ( data instanceof Object ) {
        dataArr = Object.entries(data);
    } else if ( data instanceof Array ) {
        dataArr = [...data];
    } else {
        throw new TypeError('Data contains invalid data type! Only arrays and object literals are allowed.');
    }

    const rowModel = getCoreRowModel<TData>(dataArr, columnDef);

    const grid: GridLayout<TData> = {
        data: dataArr,
        getRowModel: () => rowModel,
        getColumn: (columnId: number | string, rowId?: number | string) => {
            rowId = rowId || 0;
            const row = rowModel.rows.find(row => row.id == rowId);
            if ( !row ) {
                return null;
            }
            const column = row.getColumns().find(col => col.id == columnId);

            return column;
        }
    }

    return grid;
}

export default useRixUiGrid;