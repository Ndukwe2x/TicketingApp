"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { ReadonlyURLSearchParams, useParams, usePathname, useRouter } from "next/navigation";
import { ButtonIcon } from "@radix-ui/react-icons";
import { MdGridView, MdTableView, MdViewList } from "react-icons/md";

export default function LayoutToggle(
    {callback, layout}: 
    {callback: (layout: string) => void; layout: string}
    ) {
    // const [currentLayout, setCurrentLayout] = useState(null);
    
    // const route = useRouter();
    // const path = usePathname();
    // const query = useParams();
    const table = 'table', grid = 'grid';

    

    const toggleLayout = (layout: string) => {
        // route.push(path + '?layout=' + layout);
        // sessionStorage.setItem('events_layout', layout);
        callback(layout);
    }

    useEffect(() => {
        const currentLayout = sessionStorage.getItem('events_layout') ?? 'table';

        layout = layout || currentLayout;
        callback(layout);
    })

    return (
        <div className="button-group flex gap-3">
            <Button type="button" variant='outline' className={ (layout === table ? 'active' : '') + ' px-2'} onClick={ () => { toggleLayout(table)} }>
                <span className="sr-only">Table</span>
                <MdViewList size='20' />
            </Button>
            <Button type="button" variant='outline' className={ (layout === grid ? 'active' : '') + ' px-2'} onClick={ () => {toggleLayout(grid)} }>
                <span className="sr-only">Grid</span>
                <MdGridView size='20' />
            </Button>
        </div>
    )
}