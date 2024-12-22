"use client";

import { Text } from "@/components/ui/text";
import { usePageHeader } from "@/hooks/usePageHeaderContext";
import React, { useEffect } from "react"
import { useState } from "react";

export default function PrivacyPolicy() {
    const [terms, setTerms] = useState(null);
    const { setPageTitle } = usePageHeader();

    useEffect(() => {
        setPageTitle(`Terms Of Service`);
    }, [setPageTitle]);

    return (
        <React.Fragment>
            {terms}
        </React.Fragment>
    )
}