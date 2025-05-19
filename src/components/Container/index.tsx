import { type ReactNode } from 'react';
import styles from './styles.module.scss';

export type Size = 'sm' | 'md' | 'lg';
type Props = {
    size?: Size;
    leftStick?: boolean;
    rightStick?: boolean;
    children?: ReactNode;
    className?: string;
};

export default function Container({
    size = 'md',
    leftStick = false,
    rightStick = false,
    children,
    className = ''
}: Props) {
    return (
        <div
            className={`overflow-hidden ${styles.container} ${styles[size]} ${leftStick ? styles['left-stick'] : rightStick ? styles['right-stick'] : ''} ${className}`}
        >
            {children}
        </div>
    );
}
