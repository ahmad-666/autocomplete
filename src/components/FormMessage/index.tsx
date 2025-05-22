import { type ReactNode } from 'react';

type Props = {
    error?: boolean;
    children?: ReactNode;
    className?: string;
};

export default function FormMessage({ error = false, children, className }: Props) {
    return (
        <div className={`text-label-md inline-block ${error ? 'text-red-600' : 'text-slate-400'} ${className}`}>
            <p>{children}</p>
        </div>
    );
}
