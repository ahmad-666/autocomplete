import useColor from '@/hooks/useColor';
import { type ReactNode } from 'react';

type Props = {
    inputId: string;
    color?: string;
    children?: ReactNode;
    onClick?: () => void;
    className?: string;
};

export default function FormLabel({ inputId, color = 'slate-700', children, onClick, className }: Props) {
    const parsedColor = useColor(color);

    return (
        <div
            onClick={onClick}
            className={`text-label-lg inline-block font-semibold whitespace-nowrap ${className}`}
            style={{ color: parsedColor }}
        >
            <label htmlFor={inputId}>{children}</label>
        </div>
    );
}
