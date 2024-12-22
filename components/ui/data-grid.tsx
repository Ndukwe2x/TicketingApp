'use client';

import React, { ReactNode } from "react";
import { Grid, GridColumn, GridContent, GridRow } from "./rix-ui/data-layouts/grid/grid";
import usePagination from "@/hooks/usePagination";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

interface DataGridProps {
    Template: React.FC<any>;
    columnRule: {};
    data: unknown[];
    fallback: string;
    paginationOptions?: { itemsPerPage: number };
    isFilteringEnabled?: boolean;
    filterFields?: string[];
}

export function DataGrid({
    Template,
    columnRule,
    data,
    fallback = 'Loading, please wait...',
    paginationOptions = { itemsPerPage: 12 },
    isFilteringEnabled = false,
    filterFields = []
}: DataGridProps) {

    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [filterField, setFilterField] = React.useState('');

    // Paginate the data
    const { currentPage, totalPages, paginatedData, goToPage } = usePagination(data, paginationOptions);
    const pageData: unknown[] = paginatedData[currentPage - 1];

    return (
        <div className={'grid-container '}>
            <Grid>
                {pageData?.length ? (
                    <GridRow columnRule={columnRule}>
                        {
                            pageData?.map((colData, colIndex) => (
                                <GridColumn key={colIndex}>
                                    <Template data={colData} />
                                </GridColumn>
                            ))
                        }
                    </GridRow>
                ) : (
                    <GridRow>
                        {fallback}
                    </GridRow>
                )}
            </Grid>
            <PaginationControls currentPage={currentPage} totalPages={totalPages} goToPage={goToPage} />
        </div>
    )
}


const PaginationControls:
    React.FC<{ currentPage: number; totalPages: number; goToPage: (pageNum: number) => void }> = (
        { currentPage, totalPages, goToPage }
    ) => {
        const btnClassName = 'border disabled:opacity-50 disabled:pointer-events-none flex focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring gap-2 hover:bg-accent items-center justify-between px-2 py-1 rounded-md shadow text-foreground text-sm transition-colors whitespace-nowrap';

        return (
            <div className="flex gap-4 items-center justify-end mt-6">
                <button type="button" className={btnClassName} onClick={() => goToPage(currentPage - 1)} disabled={currentPage == 1}><FaChevronLeft size={14} />Previous</button>
                <span>{currentPage} of {totalPages}</span>
                <button type="button" className={btnClassName} onClick={() => goToPage(currentPage + 1)} disabled={currentPage == totalPages}>Next <FaChevronRight size={14} /></button>
            </div>
        );
    };

