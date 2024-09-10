"use client";

import { Text } from "@/components/ui/text";
import React, { useEffect } from "react"
import { useState } from "react";

export default function PrivacyPolicy() {
    const [policy, setPolicy] = useState(<Text variant='h1'>Privacy Policy</Text>);

    useEffect(() => {

    }, []);

    return (
        <React.Fragment>
            {policy}
        </React.Fragment>
    )
}