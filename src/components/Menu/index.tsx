import { forwardRef, type RefObject, type ForwardedRef, type CSSProperties, type ReactNode } from 'react';
import styles from './animations.module.css';

type Horizontal = 'left' | 'center' | 'right';
type Vertical = 'top' | 'center' | 'bottom';
type Animation = 'fade-in';
type Props = {
    open: boolean;
    position?: `${Horizontal}-${Vertical}`;
    offset?: { x?: number; y?: number };
    animation?: false | Animation;
    zIndex?: number;
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    style?: CSSProperties;
};

const Menu = (
    {
        open = false,
        position = 'left-bottom',
        offset,
        animation = 'fade-in',
        zIndex = 2,
        children,
        onClick,
        className,
        style
    }: Props,
    ref?: ForwardedRef<HTMLDivElement>
) => {
    const getPosition = () => {
        let left;
        let top;
        let translateX;
        let translateY;
        const posSplit = position.split('-');
        const horizontal = posSplit[0] as Horizontal;
        const vertical = posSplit[1] as Vertical;
        if (horizontal === 'left') {
            left = '0px';
            translateX = '0px';
        } else if (horizontal === 'center') {
            left = '50%';
            translateX = '-50%';
        } else if (horizontal === 'right') {
            left = '100%';
            translateX = '0px';
        }
        if (vertical === 'top') {
            top = '0px';
            translateY = '0px';
        } else if (vertical === 'center') {
            top = '50%';
            translateY = '-50%';
        } else if (vertical === 'bottom') {
            top = '100%';
            translateY = '0px';
        }
        return {
            left,
            top,
            transform: `translate(calc(${translateX} + ${offset?.x || 0}px),calc(${translateY} + ${offset?.y || 0}px))`
        };
    };
    const { left, top, transform } = getPosition();
    if (!open) return null;

    return (
        <div
            ref={(node: null | HTMLDivElement) => {
                if (node && ref) (ref as RefObject<HTMLDivElement>).current = node;
            }}
            onClick={onClick}
            className={`shadow-full-md absolute max-h-40 max-w-full overflow-auto p-4 ${animation === 'fade-in' ? styles['fade-in'] : ''} ${className}`}
            style={{
                zIndex,
                left,
                top,
                transform,
                ...style
            }}
        >
            {children}
        </div>
    );
};

export default forwardRef(Menu);

//? Usage:
// const containerRef = useRef<HTMLDivElement>(null!);
// const activatorRef = useRef<HTMLButtonElement>(null!);
// const [open, setOpen] = useState(false);
// const isHover = useHover({ ref: activatorRef });
// const isClickOutside = useClickOutside(containerRef);
// useEffect(() => {
//     if (isHover) setOpen(true); //? act as openOnHover
//     else setOpen(false); //? act as openOnHover
//     if (isClickOutside) setOpen(false); //? act as closeOnClickOutside
// }, [isHover, isClickOutside]);
// <div ref={containerRef} className='relative inline-block'>
//     <button ref={activatorRef}
//         onClick={() => {
//             setOpen((old) => !old); //? act as openOnClick,closeOnActivatorClick
//         }}
//     > click me </button>
//     <Menu open={true} position='left-bottom' offset={{ x:0,y:10 }} zIndex={5} animation='fade-in'
//         onClick={() => {
//             setOpen(false); //? act as closeOnContentClick
//         }}
//     > ... </Menu>
// </div>
