import { cn } from "@/lib/utils";
import React, { HTMLAttributes, HtmlHTMLAttributes, Suspense } from "react";
import './grid.css';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const Grid: React.FC<HtmlHTMLAttributes<HTMLDivElement>> = (
    { children, className, ...props }
) => {

    return (
        <div className={cn(`rix-ui-grid-layout`, className)} {...props}>
            {children}
        </div>
    )
}
type GridColumnRules = {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    xxl?: number
};

interface GridRowProps extends HTMLAttributes<HTMLDivElement> {
    columnRule?: GridColumnRules
}

const GridRow = ({ children, className, columnRule, ...props }: GridRowProps) => {
    const defaultColumnRule: GridColumnRules = {
        xs: 1,
        sm: 2,
        md: 2,
        lg: 3,
        xl: 4,
        xxl: 4
    };
    columnRule = columnRule ? {
        ...defaultColumnRule,
        ...columnRule
    } : {};


    const columnDef = Array.from(Object.entries(columnRule)).map(([key, value]) => {
        return `${key}:grid-cols-${value}`;
    }).join(' ');

    return (
        <div className={cn(`rix-ui-grid-row grid`, columnDef, className)} {...props}>
            {children}
        </div>
    )
}


const GridColumn: React.FC<HtmlHTMLAttributes<HTMLDivElement> & {}> = (
    { children, className, ...props }
) => {

    return (
        <div className={cn('rix-ui-grid-column', className)} {...props}>
            {children}
        </div>
    )
}


const GridCard: React.FC<HtmlHTMLAttributes<HTMLDivElement> & {}> = (
    { children, className, ...props }
) => {

    return (
        <Card className={cn('rix-ui-grid-card', className)} {...props}>
            {children}
        </Card>
    )
}


const GridCardHeader: React.FC<HtmlHTMLAttributes<HTMLDivElement> & {}> = (
    { children, className, ...props }
) => {

    return (
        <CardHeader className={cn('rix-ui-grid-card-header', className)} {...props}>
            {children}
        </CardHeader>
    )
}
const GridCardBody: React.FC<HtmlHTMLAttributes<HTMLDivElement> & {}> = (
    { children, className, ...props }
) => {

    return (
        <CardContent className={cn('rix-ui-grid-card-body py-3 px-3', className)} {...props}>
            {children}
        </CardContent>
    )
}


const GridCardFooter: React.FC<HtmlHTMLAttributes<HTMLDivElement> & {}> = (
    { children, className, ...props }
) => {

    return (
        <CardFooter className={cn('rix-ui-grid-card-footer', className)} {...props}>
            {children}
        </CardFooter>
    )
}

const GridContent: React.FC<HtmlHTMLAttributes<HTMLDivElement>> = (
    { children, className, ...props }
) => {
    return (
        <div className={cn(className)} {...props}>
            {children}
        </div>
    )
}


export {
    Grid,
    GridRow,
    GridColumn,
    GridCard,
    GridCardHeader,
    GridCardBody,
    GridCardFooter,
    GridContent
}