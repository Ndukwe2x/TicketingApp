import { useForm, SubmitHandler } from 'react-hook-form';
import { useEventFormData } from "@/hooks/useCustomContexts";
import { Api } from '@/lib/api';
import generateRandomString from '@/lib/random-string-generator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import DateTimeControls from '../../event-form-datetime-control';
import { DataPasserProvider } from '@/app/providers/data-passer-provider';
import styles from '../../../styles/styles.module.css';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useState, useRef, useEffect, FormEventHandler } from 'react';
import { getEmptyFormFields, parseFormFields } from '@/lib/utils';
import AddTicketCategory from '../../add-ticket-category';


const Step2: React.FC<MultistepFormWizardStepProps & { event?: SingleEvent }> = ({ prevStep, nextStep, event }) => {
    // const { register, formState: { errors } } = useForm<TicketCategories>();
    const { formData, updateFormData } = useEventFormData();
    const formId: string = 'event_form_' + generateRandomString(32, 'mixed_lower', false);
    // const isNew: boolean = event ? false : true;
    // const formAction = isNew
    //     ? Api.server + Api.endpoints.admin.events
    //     : Api.server + Api.endpoints.admin.event.replace(':id', event?._id as string);
    const pageBaseClass = styles.event_form_page;
    const pageActiveClass = styles.current;
    const form = useRef<HTMLFormElement>(null);
    const forwardButton = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!(form.current && forwardButton.current)) {
            return;
        }

        const frm = form.current;
        const btn = forwardButton.current;
        let emptyFields = getEmptyFormFields(frm, true);
        if (emptyFields.length) {
            btn.disabled = true;
        } else {
            btn.disabled = false;
        }
        const formElements = Array.from(frm.elements);
        formElements.forEach((element) => {
            element.addEventListener('change', (ev) => {
                emptyFields = getEmptyFormFields(frm, true);
                if (emptyFields.length) {
                    btn.disabled = true;
                } else {
                    btn.disabled = false;
                }
            });
        });
        return () => {

        }
    }, [form.current, forwardButton.current]);

    const handleSubmit: FormEventHandler<HTMLFormElement> = (ev) => {
        const data: { name: string, value: string | number }[] = [];
        Array.from(
            new FormData(ev.target as HTMLFormElement).entries()
        )
            .flatMap(entry => {
                const [name, value]: [name: string, value: any] = entry;
                data.push({ name, value });
            });

        const objectifiedFormData: Record<string, any> = parseFormFields(data);
        if (objectifiedFormData && updateFormData) {
            updateFormData(objectifiedFormData);
        }

        nextStep();
        ev.preventDefault();
    };

    return (
        <form id={formId}
            ref={form}
            onSubmit={handleSubmit}
            className={`flex-col gap-4 flex-1`}>
            <Text variant='h3' className='mb-4'>Add Ticket Categories</Text>
            <div id="event-form_page_b" className={`${pageBaseClass} ${pageActiveClass} flex-col gap-4 flex-1`}>
                <Text variant='h4'>Ticket Categories</Text>
                <AddTicketCategory categories={formData.ticketCategories ?? []} />
            </div>
            <div className="flex flex-row justify-content-between pt-5">
                <Button type="button" onClick={() => prevStep && prevStep()} className="max-w-max"><Icons.backward /> Back</Button>
                <Button ref={forwardButton} type='submit' disabled={true} className="max-w-max ml-auto">Next <Icons.forward /></Button>
            </div>
        </form>
    );
};

export default Step2;