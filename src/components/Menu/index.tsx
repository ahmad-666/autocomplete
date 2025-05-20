import { type CSSProperties, type ReactNode } from 'react';
import styles from './animations.module.css';

type Horizontal = 'left' | 'center' | 'right';
type Vertical = 'top' | 'center' | 'bottom';
type Animation = 'fade-in';
type Props = {
    open: boolean;
    position?: `${Horizontal}-${Vertical}`;
    animation?: false | Animation;
    zIndex?: number;
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    style?: CSSProperties;
};

const Menu = ({
    open = false,
    position = 'left-bottom',
    animation = 'fade-in',
    zIndex = 2,
    children,
    onClick,
    className,
    style
}: Props) => {
    const getPosition = () => {
        let left;
        let top;
        let translateX;
        let translateY;
        const posSplit = position.split('-');
        const horizontal = posSplit[0] as Horizontal;
        const vertical = posSplit[1] as Vertical;
        if (horizontal === 'left') {
            left = '0';
            translateX = '0';
        } else if (horizontal === 'center') {
            left = '50%';
            translateX = '-50%';
        } else if (horizontal === 'right') {
            left = '100%';
            translateX = '0';
        }
        if (vertical === 'top') {
            top = '0';
            translateY = '0';
        } else if (vertical === 'center') {
            top = '50%';
            translateY = '-50%';
        } else if (vertical === 'bottom') {
            top = '100%';
            translateY = '0';
        }
        return {
            left,
            top,
            translateX,
            translateY
        };
    };
    const { left, top, translateX, translateY } = getPosition();
    if (!open) return null;

    return (
        <div
            onClick={onClick}
            className={`absolute max-h-40 max-w-full overflow-auto p-4 shadow-sm ${animation === 'fade-in' ? styles['fade-in'] : ''} ${className}`}
            style={{
                zIndex,
                left,
                top,
                transform: `translate(${translateX},${translateY})`,
                ...style
            }}
        >
            {children}
        </div>
    );
};

export default Menu;

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
//     <Menu open={true} position='left-bottom' zIndex={5} animation='fade-in'
//         onClick={() => {
//             setOpen(false); //? act as closeOnContentClick
//         }}
//     > ... </Menu>
// </div>
