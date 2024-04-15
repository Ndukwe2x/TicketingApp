import React from "react";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { ReadonlyURLSearchParams, useParams, usePathname, useRouter } from "next/navigation";

export default function LayoutToggle({layout, callback}) {
    const currentLayout: string|null = sessionStorage.getItem('events_layout') ?? 'stack';
    // const [layout, setLayout] = React.useState(currentLayout);
    const route = useRouter();
    const path = usePathname();
    const query = useParams();
    // console.log(query);
    const toggleLayout = () => {
        if (layout === 'stack') setLayout('grid');
        else setLayout('stack');
        // route.push(path + '?layout=' + layout);
        sessionStorage.setItem('events_layout', layout);
        
    }

    return (
        <Button onClick={ () => {toggleLayout(callback, layout)} }>
            <span className="sr-only">Toggle Layout</span>
            {layout === 'grid' && <Icons.layoutStack className='mr-2 h-4 w-4 animate-spin' />}
            {layout === 'stack' && <Icons.layoutGrid className='mr-2 h-4 w-4 text-white' />}
        </Button>
    )
}