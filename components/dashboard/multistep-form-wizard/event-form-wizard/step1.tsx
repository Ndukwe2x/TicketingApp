import { useForm, SubmitHandler } from 'react-hook-form';
import { useEventFormData } from "@/hooks/useCustomContexts";
import { Api } from '@/lib/api';
import generateRandomString from '@/lib/random-string-generator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import DateTimeControls from '../../event-form-datetime-control';
import styles from '../../../styles/styles.module.css';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { formDataToObjects, getEmptyFormFields } from '@/lib/utils';
import { FormEventHandler, useRef, useEffect } from 'react';


const Step1: React.FC<Omit<MultistepFormWizardStepProps, 'prevStep'> & { event?: SingleEvent }> = ({ nextStep, event }) => {
    const formId: string = 'event_form_' + generateRandomString(32, 'mixed_lower', false);
    const isNew: boolean = event ? false : true;
    const pageBaseClass = styles.event_form_page;
    const pageActiveClass = styles.current;
    const form = useRef<HTMLFormElement>(null);
    const forwardButton = useRef<HTMLButtonElement>(null);
    const { formData, updateFormData } = useEventFormData();

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
            <Text variant='h3'>Basic Info</Text>
            <div className='flex flex-col gap-2'>
                <Label htmlFor='title'>Title:</Label>
                <Input id='title' name='title'
                    type='text' className="input h-14 text-lg"
                    placeholder='The Big Friday Nights Party'
                    defaultValue={formData.title ?? ''} required aria-required={true} />
            </div>
            <div className="flex flex-col gap-4">
                <DateTimeControls datetime={formData.eventDate ?? ''} />
                <div className="flex flex-col flex-1 gap-4">
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='state'>State/Region:</Label>
                        <Input id='state' name='state' placeholder="State/Region:"
                            defaultValue={formData.state ?? ''} required aria-required={true} />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='city'>Town/City:</Label>
                        <Input id='city' name='city' placeholder="Town/City:"
                            defaultValue={formData.city ?? ''} required aria-required={true} />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='address'>Address:</Label>
                        <Input id='address' name='address' placeholder="Street address:"
                            defaultValue={formData.address ?? ''} required aria-required={true} />
                    </div>
                </div>
            </div>
            <div className="flex flex-row justify-content-between pt-5">
                <Button ref={forwardButton} type='submit' disabled={true} className="max-w-max ml-auto">Next <Icons.forward /></Button>
            </div>
        </form>
    );
};

export default Step1;