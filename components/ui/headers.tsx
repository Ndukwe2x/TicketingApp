import { cn } from '@/lib/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import React from 'react';

const textVariants = cva('', {
    variants: {
        variant: {
            h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight',
            h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
            h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
            h4: 'scroll-m-20 font-semibold tracking-tight',
            h5: 'scroll-m-20 font-semibold tracking-tight',
            h6: 'scroll-m-20 font-semibold tracking-tight leading-7 [&:not(:first-child)]:mt-6'
        },
        asLabel: {
            true: 'text-sm text-muted-foreground',
        },
    },
});

export interface TextProps
    extends React.HTMLAttributes<HTMLParagraphElement>,
        VariantProps<typeof textVariants> {
    asChild?: boolean;
}

const Heading = React.forwardRef<HTMLParagraphElement, TextProps>(
    ({ className, variant, asLabel, asChild = false, ...props }, ref) => {
        const Comp = variant ? variant : 'p';

        return (
            <Comp
                className={cn(textVariants({ variant, asLabel, className }))}
                {...props}
                ref={ref}
            />
        );
    }
);

Heading.displayName = 'Heading';

export { Heading, textVariants };
