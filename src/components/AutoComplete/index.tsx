'use client';

import {
    useId,
    useRef,
    useState,
    useEffect,
    useMemo,
    useCallback,
    type ChangeEvent,
    type FocusEvent,
    type KeyboardEvent,
    type CSSProperties
} from 'react';
import Icon from '@/components/Icon';
import FormLabel from '@/components/FormLabel';
import FormMessage from '@/components/FormMessage';
import CircularLoader from '@/components/CircularLoader';
import Menu from '@/components/Menu';
import Checkbox from '@/components/Checkbox';
import useColor from '@/hooks/useColor';
import useClickOutside from '@/hooks/useClickOutside';
import colors from './colors';
import type { AutoCompleteProps, Option } from './types';
import styles from './styles.module.css';

const AutoComplete = <Opt extends Option, Multiple extends undefined | boolean = false>({
    mode = 'autocomplete',
    variant = 'outline',
    size = 'md',
    value,
    onChange,
    options = [],
    multiple = false,
    valueRender,
    optionRender,
    placeholder,
    label,
    loadingText = 'Loading ...',
    noDataText = 'No data found !',
    inputName,
    inputId,
    readOnly = false,
    disabled = false,
    clearable = false,
    loading = false,
    filterSelections = false,
    filterFn,
    prependOuterIcon,
    prependOuterRender,
    prependInnerIcon,
    prependInnerRender,
    appendInnerIcon,
    appendInnerRender,
    appendOuterIcon,
    appendOuterRender,
    hideMessage = false,
    error,
    message,
    search,
    onSearchChange,
    menu,
    onMenuChange,
    onFocus,
    onBlur,
    onKeyDown,
    theme = colors,
    className = '',
    style
}: AutoCompleteProps<Opt, Multiple>) => {
    const randomId = useId().replace(/\W/g, '').toLowerCase();
    const finalId = inputId || randomId;
    const activatorRef = useRef<HTMLDivElement>(null!);
    const [isFocus, setIsFocus] = useState(false);
    const [searchLocal, setSearchLocal] = useState(search || '');
    const [menuLocal, setMenuLocal] = useState(menu || false);
    const isClickedOutside = useClickOutside(activatorRef);
    const parsedPrimaryColor = useColor(theme.primary || colors.primary!);
    const parsedOutlineColor = useColor(theme.outline || colors.outline!);
    const parsedFillColor = useColor(theme.fill || colors.fill!);
    const parsedTextColor = useColor(theme.text || colors.text!);
    const parsedHoverColor = useColor(theme.hover || colors.hover!);
    const parsedSelectionColor = useColor(theme.selection || colors.selection!);
    const parsedErrorColor = useColor(theme.error || colors.error!);
    const isError = !!error;
    const accentColor = isError ? theme.error : isFocus ? theme.primary : theme.text;
    const textfieldHeight = size === 'sm' ? 32 : size === 'md' ? 40 : size === 'lg' ? 48 : size;
    const isOptionSelected = useCallback(
        (option: Opt) => {
            if (!multiple) return (value as Opt)?.value === option.value;
            return !!(value as Opt[])?.find((val) => val.value === option.value);
        },
        [value, multiple]
    );
    const filteredOptions = useMemo(() => {
        let result: Opt[] = [];
        if (filterFn) result = filterFn(searchLocal, options);
        else
            result = options.filter((option) => {
                const isMatch = option.label.toLowerCase().includes(searchLocal.toLowerCase());
                const isSelected = isOptionSelected(option);
                return !filterSelections ? isMatch : isMatch && !isSelected;
            });
        return result;
    }, [options, searchLocal, filterSelections, isOptionSelected, filterFn]);

    const onFocusHandler = (e: FocusEvent<HTMLInputElement>) => {
        setIsFocus(true);
        onFocus?.(e);
    };
    const onBlurHandler = (e: FocusEvent<HTMLInputElement>) => {
        setIsFocus(false);
        onBlur?.(e);
    };
    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(e);
    };
    const onActivatorClickHandler = () => {
        const newVal = !menuLocal;
        setMenuLocal(newVal);
        onMenuChange?.(newVal);
    };
    const onSearchChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const newVal = e.target.value;
        setSearchLocal(newVal);
        onSearchChange?.(newVal);
    };
    const onCheckboxChangeHandler = (checked: boolean, checkboxValue: string) => {
        //here we know that we have multiple:true and value:Opt[]
        if (multiple) {
            let newValue: Opt[] = [];
            const targetOption = options.find((option) => option.value === checkboxValue);
            if (checked && targetOption) newValue = [...(value as Opt[]), targetOption];
            else newValue = (value as Opt[]).filter((val) => val.value !== checkboxValue);
            //@ts-expect-error 'we manually handle it'
            onChange?.(newValue);
        }
    };
    const onClearHandler = () => {
        //@ts-expect-error 'we manually handle it'
        onChange?.(!multiple ? null : []);
    };
    useEffect(() => {
        //close menu if user clicks outside of activator element
        if (isClickedOutside) {
            setMenuLocal(false);
            onMenuChange?.(false);
        }
    }, [isClickedOutside, onMenuChange]);
    useEffect(() => {
        //update local state for search every time 'search' prop changes
        setSearchLocal(search || '');
    }, [search]);
    useEffect(() => {
        //update local state for menu every time 'menu' prop changes
        setMenuLocal(menu || false);
    }, [menu]);

    return (
        <div
            className={`${disabled ? 'pointer-events-none opacity-50' : ''} ${styles.container} ${className}`}
            style={
                {
                    '--primary-color': parsedPrimaryColor,
                    '--outline-color': parsedOutlineColor,
                    '--fill-color': parsedFillColor,
                    '--text-color': parsedTextColor,
                    '--hover-color': parsedHoverColor,
                    '--selection-color': parsedSelectionColor,
                    '--error-color': parsedErrorColor,
                    ...style
                } as CSSProperties
            }
        >
            <div ref={activatorRef} onFocus={onFocusHandler} onBlur={onBlurHandler} onClick={onActivatorClickHandler}>
                {!!label && (
                    <FormLabel inputId={finalId} className='mb-3'>
                        {label}
                    </FormLabel>
                )}
                <div className={`flex items-center gap-2 ${readOnly ? 'pointer-events-none' : ''}`}>
                    {!!(prependOuterRender || prependOuterIcon) && (
                        <div className='flex items-center gap-2'>
                            {prependOuterRender?.({ isFocus, isError })}
                            {!!prependOuterIcon && <Icon icon={prependOuterIcon} size='md' color={accentColor} />}
                        </div>
                    )}
                    <div
                        className={`text-body-md relative flex items-center gap-2 overflow-hidden rounded-sm border border-solid`}
                        style={{
                            minHeight: multiple ? `${textfieldHeight}px` : 'initial',
                            height: !multiple ? `${textfieldHeight}px` : 'auto',
                            color: parsedTextColor,
                            backgroundColor: variant === 'filled' ? parsedFillColor : 'transparent',
                            borderColor: variant === 'outline' ? parsedOutlineColor : 'transparent'
                        }}
                    >
                        {!!(prependInnerRender || prependInnerIcon) && (
                            <div className='flex items-center gap-2'>
                                {prependInnerRender?.({ isFocus, isError })}
                                {!!prependInnerIcon && <Icon icon={prependInnerIcon} size='md' color={accentColor} />}
                            </div>
                        )}
                        <div className='flex grow items-center justify-between gap-2'>
                            <input
                                type='text'
                                id={finalId}
                                name={inputName}
                                value={searchLocal}
                                onChange={onSearchChangeHandler}
                                onKeyDown={onKeyDownHandler}
                                readOnly={readOnly || mode === 'select'}
                                disabled={disabled}
                                placeholder={placeholder}
                                className='text-inherit'
                            />
                            <div className='flex items-center gap-2'>
                                <Icon
                                    icon='mdi:chevron-down'
                                    size='md'
                                    color={accentColor}
                                    className={`transition-transform duration-300 ${menuLocal ? '-rotate-180' : ''}`}
                                />
                                {loading && (
                                    <CircularLoader size='sm' thickness={3} color={theme.primary} duration={1000} />
                                )}
                                {clearable && (
                                    <button onClick={onClearHandler}>
                                        <Icon icon='mdi:close' size='md' color={accentColor} />
                                    </button>
                                )}
                            </div>
                        </div>
                        {!!(appendInnerIcon || appendInnerRender) && (
                            <div className='flex items-center gap-2'>
                                {!!appendInnerIcon && <Icon icon={appendInnerIcon} size='md' color={accentColor} />}
                                {appendInnerRender?.({ isFocus, isError })}
                            </div>
                        )}
                        <Menu
                            open={menuLocal}
                            position='left-bottom'
                            zIndex={2}
                            animation='fade-in'
                            className='max-h-40 w-full rounded-md bg-white px-4 py-0 shadow-sm'
                        >
                            {loading && <p className='text-title-md text-center text-slate-600'>{loadingText}</p>}
                            {!filteredOptions.length && (
                                <p className='text-title-md text-center text-slate-600'>{noDataText}</p>
                            )}
                            {!!(!loading && filteredOptions.length) && (
                                <ul>
                                    {filteredOptions.map((option) => {
                                        const isSelected = isOptionSelected(option);
                                        return (
                                            <li
                                                key={option.value}
                                                role='button'
                                                className={`cursor-pointer bg-transparent py-4 transition-colors duration-300 first:pt-0 last:pb-0 ${styles['option-list-item']}`}
                                                style={{
                                                    backgroundColor: isSelected ? parsedSelectionColor : 'transparent'
                                                }}
                                            >
                                                {optionRender?.(option, value, isSelected) ||
                                                    (!multiple ? (
                                                        <span className='text-body-md text-slate-700'>
                                                            {option.label}
                                                        </span>
                                                    ) : (
                                                        <Checkbox
                                                            checked={isSelected}
                                                            value={`${option.value}`}
                                                            onChange={onCheckboxChangeHandler}
                                                            color={theme.primary}
                                                            size='md'
                                                            hideMessage
                                                        >
                                                            <span className='text-body-md text-slate-700'>
                                                                {option.label}
                                                            </span>
                                                        </Checkbox>
                                                    ))}
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </Menu>
                    </div>
                    {!!(appendOuterIcon || appendOuterRender) && (
                        <div className='flex items-center gap-2'>
                            {!!appendOuterIcon && <Icon icon={appendOuterIcon} size='md' color={accentColor} />}
                            {appendOuterRender?.({ isFocus, isError })}
                        </div>
                    )}
                </div>
            </div>
            {!hideMessage && (
                <FormMessage error={error} className='mt-3'>
                    {message}
                </FormMessage>
            )}
        </div>
    );
};

export default AutoComplete;
