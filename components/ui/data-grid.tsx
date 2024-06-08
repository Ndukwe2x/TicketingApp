'use client';

import React, { ReactNode } from "react";
import { Grid, GridColumn, GridContent, GridRow } from "./rix-ui/data-layouts/grid/grid";
import usePagination from "@/hooks/usePagination";

interface DataGridProps {
    Template: React.FC<any>;
    columnRule: {};
    data: unknown[];
    fallback: string;
    isFilteringEnabled?: boolean;
    filterFields?: string[];
}

export function DataGrid({ Template, columnRule, data, fallback = 'Loading, please wait...', isFilteringEnabled = false, filterFields }: DataGridProps) {
    
    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [filterField, setFilterField] = React.useState('');

    // Paginate the data
    const { currentPage, totalPages, paginatedData, goToPage } = usePagination(data);
    const pageData: unknown[] = paginatedData[currentPage - 1];

    return (
        <div className={ 'grid-container '}>
            <Grid>
                {pageData?.length ? (
                    <GridRow columnRule={ columnRule }>
                        {
                            pageData?.map((colData, colIndex) => (
                                <GridColumn key={ colIndex }>
                                    <Template data={colData} />
                                </GridColumn>
                            ))
                        }
                    </GridRow>
                ): (
                    <GridRow>
                        { fallback }
                    </GridRow>
                )}
            </Grid>
            <PaginationControls currentPage={currentPage} totalPages={totalPages} goToPage={goToPage} />
        </div>
    )
}


const PaginationControls: 
    React.FC<{currentPage: number; totalPages: number; goToPage: (pageNum: number) => void}> = (
    { currentPage, totalPages, goToPage }
) => {

  return (
    <div>
      <button type="button" onClick={() => goToPage(currentPage - 1)}>Previous</button>
      <span>{currentPage}/{totalPages}</span>
      <button type="button" onClick={() => goToPage(currentPage + 1)}>Next</button>
    </div>
  );
};

