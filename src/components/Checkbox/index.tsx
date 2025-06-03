import { useId, type ChangeEvent, type ReactNode } from 'react';
import Icon from '@/components/Icon';
import FormMessage from '@/components/FormMessage';
import useColor from '@/hooks/useColor';

type Size = number | 'sm' | 'md' | 'lg';
type Props = {
    id?: string;
    name?: string;
    checked: boolean;
    value?: string;
    onChange?: (checked: boolean, value: string) => void;
    size?: Size;
    color?: string;
    readOnly?: boolean;
    disabled?: boolean;
    hideMessage?: boolean;
    error?: boolean;
    message?: string;
    children?: ReactNode;
    contentClassName?: string;
    className?: string;
};

export default function Checkbox({
    id,
    name,
    checked = false,
    value,
    onChange,
    size = 'md',
    color = 'primary',
    readOnly = false,
    disabled = false,
    hideMessage = false,
    error = false,
    message,
    children,
    contentClassName = '',
    className = ''
}: Props) {
    const parsedColor = useColor(color);
    const randomId = useId().replace(/\W/g, '').toLowerCase();
    const inputId = id || randomId;
    const getSize = () => {
        let s;
        switch (size) {
            case 'sm':
                s = 14;
                break;
            case 'md':
                s = 18;
                break;
            case 'lg':
                s = 22;
                break;
            default:
                s = size;
        }
        return s;
    };
    const checkboxSize = getSize();
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { checked, value } = e.target;
        onChange?.(checked, value || '');
    };

    return (
        <div className={`inline-block ${className}`}>
            <label
                htmlFor={inputId}
                className={`inline-flex cursor-pointer items-center gap-2 capitalize ${readOnly ? 'pointer-events-none' : ''} ${disabled ? 'pointer-events-none opacity-50' : ''} ${contentClassName}`}
            >
                <input
                    id={inputId}
                    name={name}
                    type='checkbox'
                    checked={checked}
                    value={value}
                    onChange={onChangeHandler}
                    readOnly={readOnly}
                    disabled={disabled}
                    className='hidden'
                />
                <span
                    className='flex items-center justify-center rounded-sm border border-solid transition-colors duration-300'
                    style={{
                        width: `${checkboxSize}px`,
                        height: `${checkboxSize}px`,
                        backgroundColor: checked ? parsedColor : 'transparent',
                        color: checked ? 'white' : 'transparent',
                        borderColor: checked ? 'transparent' : '#aaa'
                    }}
                >
                    <Icon icon='mdi:check' size='md' color='inherit' />
                </span>
                <span className='text-label-lg text-slate-700'>{children}</span>
            </label>
            {!hideMessage && (
                <FormMessage error={error} className='mt-1'>
                    {message}
                </FormMessage>
            )}
        </div>
    );
}

//? Usage:
//* #1: single boolean checkbox
// const [val, setVal] = useState(false);
// <Checkbox id='id' name='name' checked={val} onChange={(checked) => setVal(checked)}
//     readOnly={false} disabled={false} size='sm' color='sky-600'
// > label of checkbox </Checkbox>
//* #2: multiple array checkbox
// const [val, setVal] = useState<string[]>([]);
// <div className='flex flex-col gap-5'>
//     {['val1', 'val2', 'val3'].map((item) => (
//         <Checkbox key={item} checked={val.includes(item)} value={item}
//             onChange={(checked, value) => {
//                 if (checked) setVal((old) => [...old, value as string]);
//                 else setVal((old) => old.filter((o) => o !== value));
//             }}
//             color='purple-500' size='md' error message='This is a message'
//         >
//             <span className='text-body-lg font-bold text-orange-500'>{item}</span>
//         </Checkbox>
//     ))}
// </div>
