"use client";

import { Text } from "@/components/ui/text";
import { usePageHeader } from "@/hooks/usePageHeaderContext";
import React, { useEffect } from "react"
import { useState } from "react";

export default function PrivacyPolicy() {
    const [policy, setPolicy] = useState(null);
    const { setPageTitle } = usePageHeader();

    useEffect(() => {
        setPageTitle(`Privacy Policy`);
    }, [setPageTitle]);

    return (
        <React.Fragment>
            {policy}
        </React.Fragment>
    )
}