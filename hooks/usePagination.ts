"use client";

import { useState } from "react";


type PaginationOptions = {
    itemsPerPage?: number;
};

type PaginationResult<T> = {
    currentPage: number;
    totalPages: number;
    paginatedData: T[][];
    goToPage: (page: number) => void;
};

function usePagination<T>(data: T[], options: PaginationOptions = {}): PaginationResult<T> {
    const { itemsPerPage = 12 } = options;
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the total number of pages
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const paginatedData: T[][] = [];
    for (let i = 0; i < totalPages; i++) {
        const startIdx = i * itemsPerPage;
        const endIdx = startIdx + itemsPerPage;
        paginatedData.push(data.slice(startIdx, endIdx));
    }

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return {
        currentPage,
        totalPages,
        paginatedData,
        goToPage,
    };
}


export default usePagination;
