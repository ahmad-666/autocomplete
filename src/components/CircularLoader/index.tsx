'use client';

import { type CSSProperties } from 'react';
import useColor from '@/hooks/useColor';
import styles from './styles.module.css';

type Size = 'sm' | 'md' | 'lg' | number;
type Props = {
    /** set radius of circle */
    size?: Size;
    /** set thickness of circle */
    thickness?: number;
    color?: string;
    /** animation duration in milliseconds */
    duration?: number;
    className?: string;
};

export default function CircularLoader({
    size = 'md',
    thickness = 4,
    color = 'primary',
    duration = 1_000,
    className = ''
}: Props) {
    const parsedColor = useColor(color);
    const getSize = () => {
        let s = 0;
        switch (size) {
            case 'sm':
                s = 20;
                break;
            case 'md':
                s = 40;
                break;
            case 'lg':
                s = 60;
                break;
            default:
                s = size;
        }
        return s;
    };
    const calcSize = getSize();

    return (
        <div
            className={`inline-block ${styles.container} ${className}`}
            style={
                {
                    '--color': parsedColor,
                    '--radius': `${calcSize}px`,
                    '--thickness': `${thickness}px`,
                    '--duration': `${duration}ms`
                } as CSSProperties
            }
        >
            <div className={`${styles.loader}`} />
        </div>
    );
}

//? Usage:
{
    /* <CircularLoader size='md' thickness={2} color='sky-500' duration={1000} className='mt-20' /> */
}
