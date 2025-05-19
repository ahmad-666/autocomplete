'use client';

import { type CSSProperties } from 'react';
import useColor from '@/hooks/useColor';

export type Size = 'sm' | 'md' | 'lg' | number;
type Props = {
    animate?: boolean;
    size?: Size;
    thickness?: number;
    color?: string;
    className?: string;
};

export default function CircularLoader({
    animate = true,
    size = 'md',
    thickness = 2,
    color = 'primary',
    className = ''
}: Props) {
    const parsedColor = useColor(color);
    const getSize = () => {
        let s = 0;
        switch (size) {
            case 'sm':
                s = 18;
                break;
            case 'md':
                s = 25;
                break;
            case 'lg':
                s = 32;
                break;
            default:
                s = size;
        }
        return s;
    };
    const loaderSize = getSize();

    return (
        <div
            className={`rounded-circle aspect-square border-(length:--thickness) border-solid border-t-(--color) border-r-transparent border-b-(--color) border-l-transparent bg-transparent ${animate ? 'animate-spin' : ''} ${className}`}
            style={
                {
                    '--color': parsedColor,
                    '--thickness': `${thickness}px`,
                    width: `${loaderSize}px`,
                    height: `${loaderSize}px`
                } as CSSProperties
            }
        ></div>
    );
}

//? Usage: <CircularLoader size={50} thickness={5} color='primary' />
