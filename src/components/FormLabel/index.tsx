import { type ReactNode } from 'react';

type Props = {
    inputId: string;
    children?: ReactNode;
    className?: string;
};

export default function FormLabel({ inputId, children, className }: Props) {
    return (
        <div className={`text-label-md text-slate-700 ${className}`}>
            <label htmlFor={inputId}>{children}</label>
        </div>
    );
}
