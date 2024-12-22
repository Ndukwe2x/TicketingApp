import { useEventFormData } from "@/hooks/useCustomContexts";
import generateRandomString from '@/lib/random-string-generator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import styles from '../../../styles/styles.module.css';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import React, { useRef, useEffect, FormEventHandler } from 'react';
import { cn, formatDate, getEmptyFormFields } from '@/lib/utils';
import { MdInfo } from 'react-icons/md';
import { Checkbox } from "@/components/ui/checkbox";

const Step5: React.FC<MultistepFormWizardStepProps> = ({ prevStep, nextStep }) => {
    const { formData, updateFormData } = useEventFormData();
    const formId: string = 'event_form_' + generateRandomString(32, 'mixed_lower', false);
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
    }, []);

    const handleSubmit: FormEventHandler<HTMLFormElement> = (ev) => {
        const data = Array.from(
            new FormData(ev.target as HTMLFormElement).entries()
        );
        for (const [name, value] of data) {
            updateFormData && updateFormData({ [name]: value.toString() });
        }
        nextStep();
        ev.preventDefault();
    };


    return (
        <form id={formId}
            ref={form}
            onSubmit={handleSubmit}
            className={`${pageBaseClass} ${pageActiveClass} flex-col gap-4 flex-1`}>
            <div className='flex flex-col gap-2'>
                <Text variant='h4'>Ticket Duration</Text>
                <Label htmlFor='ticket-closing-date'>Ticket Sales Closes:</Label>
                <Input type="date" name="ticketClosingDate"
                    required
                    aria-required="true"
                    defaultValue={formData && formData.ticketClosingDate ? formatDate(new Date(formData.ticketClosingDate), 'YYYY-MM-DD') : ''} />
            </div>
            <div className='flex flex-col gap-2'>
                <Text variant='h4'>Event Featuring</Text>
                <Input type="hidden" name="featured" value="false" className="invisible" />
                <Label htmlFor='featured' className="flex items-center gap-2 font-normal text-md">
                    <Checkbox id='featured' name="featured" value={formData && formData.featured ? 'true' : 'false'}
                        defaultChecked={formData && formData.featured ? true : false} />Feature this event</Label>
                <p className="text-xs flex items-center gap-2">
                    <MdInfo size={16} className="text-muted-foreground" />
                    Featuring an event puts it in the spotlight and is a great way to make your event reach more people.
                </p>
            </div>
            <div className="flex flex-row justify-content-between pt-5">
                <Button type="button" onClick={() => prevStep && prevStep()}
                    className="max-w-max"><Icons.backward /> Back</Button>
                <Button ref={forwardButton} type='submit' disabled={true}
                    className="max-w-max ml-auto">Next <Icons.forward /></Button>
            </div>
        </form>
    );
};

export default Step5;
