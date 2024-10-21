import React, { FormEvent, FormEventHandler, useEffect, useRef, useState } from "react";
import { Api } from "@/lib/api";
import Step1 from "./step1";
import Step2 from "./step2";
import { EventFormDataProvider } from "@/app/providers/event-form-data-provider";
import Step3 from "./step3";
import Step4 from "./step4";
import Step5 from "./step5";
import Summary from "./summary";
import { DataPasserProvider } from "@/app/providers/data-passer-provider";

const RenderPage: React.FC<MultistepFormWizardStepProps & {
    pageId: number;
    event?: SingleEvent;
}> = ({ prevStep, nextStep, pageId, event }) => {

    switch (pageId) {
        case 1:
            return <Step1 nextStep={() => nextStep()} />
        case 2:
            return <Step2 prevStep={prevStep} nextStep={nextStep} />
        case 3:
            return <Step3 prevStep={prevStep} nextStep={nextStep} />
        case 4:
            return <Step4 prevStep={prevStep} nextStep={nextStep} />
        case 5:
            return <Step5 prevStep={prevStep} nextStep={nextStep} />
        case 6:
            return <Summary prevStep={prevStep} />

        default:
            return <Step1 nextStep={() => nextStep()} />
    }
}

const EventForm = (
    { actor, onSuccess, onFailure, event }:
        {
            actor: AppUser;
            onSuccess: (data: Record<string, any>) => any;
            onFailure?: (error?: any) => void;
            event?: SingleEvent;
        }
) => {
    const isNew: boolean = event ? false : true;
    const formAction = isNew
        ? Api.server + Api.endpoints.admin.events
        : Api.server + Api.endpoints.admin.event.replace(':id', event?._id as string);
    const [pageNumber, setPageNumber] = useState<number>(1);

    const minSteps = 1;
    const maxSteps = 6;
    const prevStep = () => {
        const targetPage = pageNumber <= minSteps ? minSteps : pageNumber - 1;
        if (targetPage < minSteps) {
            return;
        }
        setPageNumber(targetPage);
    }
    const nextStep = () => {
        let targetPage = pageNumber >= maxSteps ? maxSteps : pageNumber + 1;
        if (targetPage > maxSteps) {
            return;
        }
        setPageNumber(targetPage);
    }

    return (
        <EventFormDataProvider defaultData={event}>
            <DataPasserProvider data={{ onFailure, onSuccess }}>
                <RenderPage
                    pageId={pageNumber}
                    event={event}
                    prevStep={() => prevStep()}
                    nextStep={() => nextStep()} />
            </DataPasserProvider>
        </EventFormDataProvider>
    )
}

export default EventForm;
