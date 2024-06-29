// ToggleViewComponent.tsx

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { MdGridView, MdViewList } from "react-icons/md";


const ToggleView: React.FC<ToggleViewProps> = ({ dataSetId, setExternalViewType }) => {
    const [viewType, setInternalViewType] = useState<ViewType>('grid');
    setExternalViewType(viewType);

    useEffect(() => {
        const storedViewType = localStorage.getItem(`viewType_${dataSetId}`);
        if (storedViewType) {
            setInternalViewType(storedViewType as ViewType);
            setExternalViewType(storedViewType as ViewType);
        }
    }, [dataSetId, setExternalViewType]);

    const toggleView = (newViewType: ViewType) => {
        setInternalViewType(newViewType);
        setExternalViewType(newViewType);
        localStorage.setItem(`viewType_${dataSetId}`, newViewType);
    };

    return (
        <div className="button-group flex gap-3">
            <Button type="button" variant='outline' className={(viewType === 'list' ? 'active' : '') + ' px-2'}
                onClick={() => { toggleView('list') }}>
                <span className="sr-only">List View</span>
                <MdViewList size='20' />
            </Button>
            <Button type="button" variant='outline' className={(viewType === 'grid' ? 'active' : '') + ' px-2'}
                onClick={() => { toggleView('grid') }}>
                <span className="sr-only">Grid View</span>
                <MdGridView size='20' />
            </Button>
        </div>
    );
};

export default ToggleView;
