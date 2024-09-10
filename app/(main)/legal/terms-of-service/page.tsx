"use client";

import { Text } from "@/components/ui/text";
import React, { useEffect } from "react"
import { useState } from "react";

export default function PrivacyPolicy() {
    const [terms, setTerms] = useState(<Text variant='h1'>Terms Of Service</Text>);

    useEffect(() => {

    }, []);

    return (
        <React.Fragment>
            {terms}
        </React.Fragment>
    )
}