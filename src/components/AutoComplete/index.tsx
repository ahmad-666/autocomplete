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
    classNames = {
        container: '',
        label: '',
        input: '',
        menu: '',
        option: '',
        loadingText: '',
        noDataText: '',
        valueContainer: '',
        value: '',
        message: ''
    },
    className = '',
    style
}: AutoCompleteProps<Opt, Multiple>) => {
    const containerRef = useRef<HTMLDivElement>(null!);
    const inputRef = useRef<HTMLInputElement>(null!);
    const randomId = useId().replace(/\W/g, '').toLowerCase();
    const finalId = inputId || randomId;
    const [isFocus, setIsFocus] = useState(false);
    const [searchLocal, setSearchLocal] = useState(search || '');
    const [menuLocal, setMenuLocal] = useState(menu || false);
    const isClickedOutside = useClickOutside(containerRef);
    const parsedPrimaryColor = useColor(theme.primary || colors.primary!);
    const parsedOutlineColor = useColor(theme.outline || colors.outline!);
    const parsedFillColor = useColor(theme.fill || colors.fill!);
    const parsedTextColor = useColor(theme.text || colors.text!);
    const parsedHoverColor = useColor(theme.hover || colors.hover!);
    const parsedSelectionColor = useColor(theme.selection || colors.selection!);
    const parsedErrorColor = useColor(theme.error || colors.error!);
    const isError = !!error;
    const accentColor = isError ? theme.error : isFocus ? theme.primary : theme.text;
    const parseAccentColor = useColor(accentColor!);
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
        inputRef.current.focus();
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
    const onContainerClickHandler = () => {
        const newVal = !menuLocal;
        setMenuLocal(newVal);
        onMenuChange?.(newVal);
    };
    const onSearchChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const newVal = e.target.value;
        setSearchLocal(newVal);
        onSearchChange?.(newVal);
    };
    const onOptionClickHandler = (option: Opt) => {
        let newValue: Opt | Opt[];
        if (!multiple) {
            newValue = option;
            setMenuLocal(false);
            onMenuChange?.(false);
        } else {
            const isChecked = !!(value as Opt[]).find((val) => val.value === option.value);
            if (!isChecked) newValue = [...(value as Opt[]), option];
            else newValue = (value as Opt[]).filter((val) => val.value !== option.value);
        }
        //@ts-expect-error 'we manually handle it'
        onChange?.(newValue);
    };
    const onChipCloseHandler = (chipOption: Opt) => {
        let newValue: null | Opt[];
        if (!multiple) {
            newValue = null;
        } else {
            newValue = (value as Opt[]).filter((val) => val.value !== chipOption.value);
        }
        //@ts-expect-error 'we manually handle it'
        onChange?.(newValue);
    };
    const onClearHandler = () => {
        //@ts-expect-error 'we manually handle it'
        onChange?.(!multiple ? null : []);
    };
    useEffect(() => {
        //close menu if user clicks outside of container element
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
            <div
                ref={containerRef}
                onFocus={onFocusHandler}
                onBlur={onBlurHandler}
                onClick={onContainerClickHandler}
                className={`${classNames.container}`}
            >
                {!!label && (
                    <FormLabel inputId={finalId} className={`mb-3 ${classNames.label}`}>
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
                        className={`relative flex items-center gap-2 overflow-hidden rounded-sm border border-solid`}
                        style={{
                            minHeight: multiple ? `${textfieldHeight}px` : 'initial',
                            height: !multiple ? `${textfieldHeight}px` : 'auto',
                            backgroundColor: variant === 'filled' ? parsedFillColor : 'transparent',
                            borderColor:
                                variant === 'outline'
                                    ? isFocus || isError
                                        ? parseAccentColor
                                        : parsedOutlineColor
                                    : 'transparent'
                        }}
                    >
                        {!!(prependInnerRender || prependInnerIcon) && (
                            <div className='flex items-center gap-2'>
                                {prependInnerRender?.({ isFocus, isError })}
                                {!!prependInnerIcon && <Icon icon={prependInnerIcon} size='md' color={accentColor} />}
                            </div>
                        )}
                        <div className='flex grow items-center justify-between gap-2'>
                            <div
                                className={`flex flex-wrap gap-2 ${!isFocus || multiple ? 'block' : 'hidden'} ${classNames.valueContainer}`}
                            >
                                {valueRender?.(value) ||
                                    (!multiple ? (
                                        <p
                                            className={`text-body-md ${classNames.value}`}
                                            style={{
                                                color: parsedTextColor
                                            }}
                                        >
                                            {(value as Opt)?.label}
                                        </p>
                                    ) : (
                                        (value as Opt[]).map((val) => (
                                            <div
                                                key={val.value}
                                                className={`text-body-md rounded-sm text-white ${classNames.value}`}
                                                style={{
                                                    backgroundColor: parsedPrimaryColor
                                                }}
                                            >
                                                {val.label}
                                                <button onClick={() => onChipCloseHandler(val)} className='ml-2'>
                                                    <Icon icon='mdi:close' size='sm' color='white' />
                                                </button>
                                            </div>
                                        ))
                                    ))}
                            </div>
                            <input
                                ref={inputRef}
                                type='text'
                                id={finalId}
                                name={inputName}
                                value={searchLocal}
                                onChange={onSearchChangeHandler}
                                onKeyDown={onKeyDownHandler}
                                readOnly={readOnly || mode === 'select'}
                                disabled={disabled}
                                placeholder={placeholder}
                                className={`text-body-md placeholder:text-label-md placeholder:text-slate-300 ${isFocus ? 'inline-block' : 'hidden'} ${classNames.input}`}
                                style={{
                                    color: parsedTextColor
                                }}
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
                                {!!appendInnerIcon && <Icon icon={appendInnerIcon} size='md' color={accentColor} />}
                                {appendInnerRender?.({ isFocus, isError })}
                            </div>
                        </div>
                        <Menu
                            open={menuLocal}
                            position='left-bottom'
                            zIndex={2}
                            animation='fade-in'
                            className={`max-h-40 w-full rounded-md bg-white px-4 py-0 shadow-sm ${classNames.menu}`}
                        >
                            {loading && (
                                <p
                                    className={`text-title-md text-center ${classNames.loadingText}`}
                                    style={{
                                        color: parsedTextColor
                                    }}
                                >
                                    {loadingText}
                                </p>
                            )}
                            {!filteredOptions.length && (
                                <p
                                    className={`text-title-md text-center ${classNames.noDataText}`}
                                    style={{
                                        color: parsedTextColor
                                    }}
                                >
                                    {noDataText}
                                </p>
                            )}
                            {!!(!loading && filteredOptions.length) && (
                                <ul>
                                    {filteredOptions.map((option) => {
                                        const isSelected = isOptionSelected(option);
                                        return (
                                            <li
                                                key={option.value}
                                                role={!option.disabled ? 'button' : undefined}
                                                onClick={() => onOptionClickHandler(option)}
                                                className={`cursor-pointer bg-transparent py-4 transition-colors duration-300 first:pt-0 last:pb-0 ${option.disabled ? 'pointer-events-none opacity-50' : ''} ${styles['option']} ${classNames.option}`}
                                                style={{
                                                    backgroundColor: isSelected ? parsedSelectionColor : 'transparent'
                                                }}
                                            >
                                                {optionRender?.(option, value, isSelected) ||
                                                    (!multiple ? (
                                                        <span
                                                            className='text-body-md'
                                                            style={{
                                                                color: parsedTextColor
                                                            }}
                                                        >
                                                            {option.label}
                                                        </span>
                                                    ) : (
                                                        <Checkbox
                                                            checked={isSelected}
                                                            value={`${option.value}`}
                                                            // onChange={()=>{}} // we don't need it because we handle it in the onOptionClickHandler
                                                            color={theme.primary}
                                                            size='md'
                                                            hideMessage
                                                        >
                                                            <span
                                                                className='text-body-md'
                                                                style={{
                                                                    color: parsedTextColor
                                                                }}
                                                            >
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
                <FormMessage error={error} className={`mt-3 ${classNames.message}`}>
                    {message}
                </FormMessage>
            )}
        </div>
    );
};

export default AutoComplete;
