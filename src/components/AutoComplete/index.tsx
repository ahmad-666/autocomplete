'use client';

import {
    useId,
    useRef,
    useState,
    useEffect,
    useMemo,
    useCallback,
    type ChangeEvent,
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
export { type Option } from './types';
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
    autoComplete = 'off',
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
    search = '',
    onSearchChange,
    menu = false,
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
    const focusedOptionRef = useRef<HTMLLIElement>(null!);
    const isClickedOutside = useClickOutside(containerRef);
    const randomId = useId().replace(/\W/g, '').toLowerCase();
    const finalId = inputId || randomId;
    const [isFocus, setIsFocus] = useState(false); //control focus state of container
    const [searchLocal, setSearchLocal] = useState(search || ''); //control value of <input type="text" />
    const [menuLocal, setMenuLocal] = useState(menu || false); //control options menu visibility
    const [applyFilter, setApplyFilter] = useState(false); //control whether to apply filter or not ... e.g if user select an option on multiple:false we don't want to apply filter on options
    const [hoveredOptionIdx, setHoveredOptionIdx] = useState(-1); //for store hovered option in menu
    const [focusedOptionIdx, setFocusedOptionIdx] = useState(-1); //for store focused option in menu
    const parsedPrimaryColor = useColor(theme.primary || colors.primary!);
    const parsedOutlineColor = useColor(theme.outline || colors.outline!);
    const parsedFillColor = useColor(theme.fill || colors.fill!);
    const parsedTextColor = useColor(theme.text || colors.text!);
    const parsedHoverColor = useColor(theme.hover || colors.hover!);
    const parsedSelectionColor = useColor(theme.selection || colors.selection!);
    const hasValue = !!(multiple ? value?.length : value);
    const isError = !!error;
    const accentColor = isError ? 'red-600' : isFocus ? theme.primary : theme.text;
    const parseAccentColor = useColor(accentColor!);
    const iconSize = size === 'lg' ? 'md' : 'sm'; //size of all icons except chevron and chip close
    const textfieldHeight = size === 'sm' ? 32 : size === 'md' ? 40 : size === 'lg' ? 48 : 40; //height of wrapper for multiple:false and min-height of wrapper for multiple:true
    const isOptionSelected = useCallback(
        (option: Opt) => {
            if (!multiple) return (value as Opt)?.value === option.value;
            return !!(value as Opt[])?.find((val) => val.value === option.value);
        },
        [value, multiple]
    );
    const filteredOptions = useMemo(() => {
        const filteredOptions: Opt[] = options.filter((option) =>
            !filterSelections ? true : !isOptionSelected(option)
        );
        if (!applyFilter) return filteredOptions;
        else {
            if (filterFn) return filterFn(searchLocal, options);
            else {
                return filteredOptions.filter((option) =>
                    option.label.toLowerCase().includes(searchLocal.toLowerCase())
                );
            }
        }
    }, [applyFilter, options, searchLocal, filterSelections, isOptionSelected, filterFn]);
    const onSearchChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const newVal = e.target.value;
        setSearchLocal(newVal);
        onSearchChange?.(newVal);
        setApplyFilter(true);
    };
    const onOptionClickHandler = (option: Opt) => {
        if (!option) return null;
        let newValue: Opt | Opt[];
        if (!multiple) {
            newValue = option;
            setMenuLocal(false);
            onMenuChange?.(false);
            setSearchLocal(option.label);
            onSearchChange?.(option.label);
            setApplyFilter(false);
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
        setSearchLocal('');
        onSearchChange?.('');
        setApplyFilter(false);
        //@ts-expect-error 'we manually handle it'
        onChange?.(!multiple ? null : []);
    };
    const focusHandler = useCallback(() => {
        const selectedOptionIdx = filteredOptions.findIndex(
            (option) => option.value === (!multiple ? (value as Opt)?.value : (value as Opt[])[0]?.value)
        );
        inputRef.current.focus();
        setIsFocus(true);
        setMenuLocal(true);
        onMenuChange?.(true);
        onFocus?.(containerRef);
        setFocusedOptionIdx(selectedOptionIdx);
    }, [value, multiple, filteredOptions, onFocus, onMenuChange]);
    const blurHandler = useCallback(() => {
        let newSearch = '';
        inputRef.current.blur();
        setIsFocus(false);
        setMenuLocal(false);
        onMenuChange?.(false);
        if (!multiple) newSearch = (value as Opt)?.label || '';
        else newSearch = '';
        setSearchLocal(newSearch);
        onSearchChange?.(newSearch);
        setApplyFilter(false);
        setHoveredOptionIdx(-1);
        setFocusedOptionIdx(-1);
        onBlur?.(containerRef);
    }, [value, multiple, onMenuChange, onSearchChange, onBlur]);
    const onContainerClickHandler = () => {
        //always open menu on container click
        if (!isFocus) focusHandler();
        else if (!multiple) blurHandler();
    };
    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const key = e.key.toLowerCase();
        if (key === 'arrowup') {
            setHoveredOptionIdx(-1);
            setFocusedOptionIdx((old) => (old - 1 >= 0 ? old - 1 : filteredOptions.length - 1));
        } else if (key === 'arrowdown') {
            setHoveredOptionIdx(-1);
            setFocusedOptionIdx((old) => (old + 1) % filteredOptions.length);
        } else if (key === 'enter') {
            onOptionClickHandler(filteredOptions[focusedOptionIdx || hoveredOptionIdx || -1]);
        }
        onKeyDown?.(e);
    };
    useEffect(() => {
        //close menu if user clicks outside of container
        if (isClickedOutside) blurHandler();
    }, [isClickedOutside, blurHandler]);
    useEffect(() => {
        //update local state for search every time 'search' prop changes
        setSearchLocal(search || '');
        setApplyFilter(true);
    }, [search]);
    useEffect(() => {
        //update local state for menu every time 'menu' prop changes
        if (menu) {
            setMenuLocal(true);
            focusHandler();
        } else {
            setMenuLocal(false);
            blurHandler();
        }
    }, [menu, focusHandler, blurHandler]);
    useEffect(() => {
        //we need to use 'instant' version instead of 'smooth' to prevent any conflicts
        focusedOptionRef.current?.scrollIntoView({ behavior: 'instant', inline: 'nearest', block: 'nearest' });
    }, [focusedOptionIdx]);

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
                    ...style
                } as CSSProperties
            }
        >
            <div
                ref={containerRef}
                onClick={onContainerClickHandler}
                onKeyDown={onKeyDownHandler}
                className={`outline-none ${classNames.container}`}
            >
                {!!label && (
                    <FormLabel
                        inputId={finalId}
                        color={accentColor}
                        onClick={() => {
                            setTimeout(() => {
                                //add timeout to ensure that the bellow code is called after 'onContainerClickHandler' is finished
                                focusHandler();
                            }, 0);
                        }}
                        className={`mb-3 ${classNames.label}`}
                    >
                        {label}
                    </FormLabel>
                )}
                <div className={`flex items-center gap-2 ${readOnly ? 'pointer-events-none' : ''}`}>
                    {!!(prependOuterRender || prependOuterIcon) && (
                        <div className='flex shrink-0 items-center gap-2'>
                            {prependOuterRender?.({ isFocus, isError })}
                            {!!prependOuterIcon && <Icon icon={prependOuterIcon} size={iconSize} color={accentColor} />}
                        </div>
                    )}
                    <div
                        className={`relative flex grow cursor-text items-center gap-2 overflow-visible rounded-md px-2 outline-solid ${isFocus ? 'outline-2' : 'outline'}`}
                        style={{
                            minHeight: multiple ? `${textfieldHeight}px` : 'initial',
                            height: !multiple ? `${textfieldHeight}px` : 'auto',
                            backgroundColor: variant === 'filled' ? parsedFillColor : 'transparent',
                            outlineColor:
                                variant === 'outline'
                                    ? isFocus || isError
                                        ? parseAccentColor
                                        : parsedOutlineColor
                                    : 'transparent'
                        }}
                    >
                        {!!(prependInnerRender || prependInnerIcon) && (
                            <div className='flex shrink-0 items-center gap-2'>
                                {prependInnerRender?.({ isFocus, isError })}
                                {!!prependInnerIcon && (
                                    <Icon icon={prependInnerIcon} size={iconSize} color={accentColor} />
                                )}
                            </div>
                        )}
                        <div className='flex grow items-center justify-between gap-2'>
                            {!!(multiple || valueRender) && (
                                <div className={`flex flex-wrap gap-2 ${classNames.valueContainer}`}>
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
                                                    className={`text-body-md rounded-md text-white ${classNames.value}`}
                                                    style={{
                                                        backgroundColor: parsedPrimaryColor
                                                    }}
                                                >
                                                    {val.label}
                                                    <button
                                                        type='button'
                                                        onClick={() => onChipCloseHandler(val)}
                                                        className='ml-2'
                                                    >
                                                        <Icon icon='mdi:close' size='sm' color='white' />
                                                    </button>
                                                </div>
                                            ))
                                        ))}
                                </div>
                            )}
                            <input
                                ref={inputRef}
                                autoComplete={autoComplete}
                                type='text'
                                id={finalId}
                                name={inputName}
                                value={searchLocal}
                                onChange={onSearchChangeHandler}
                                readOnly={readOnly || mode === 'select'}
                                disabled={disabled}
                                placeholder={placeholder}
                                className={`text-body-md placeholder:text-label-md inline-block w-0 appearance-none border-none outline-none placeholder:text-slate-300 ${!multiple && !isFocus && valueRender ? 'pointer-events-none opacity-0' : 'grow'} ${classNames.input}`}
                                style={{
                                    color: parsedTextColor
                                }}
                            />
                        </div>
                        <div className='flex shrink-0 items-center gap-2'>
                            <Icon
                                icon='mdi:chevron-down'
                                size='md'
                                color={accentColor}
                                className={`transition-transform duration-300 ${menuLocal ? '-rotate-180' : ''}`}
                            />
                            {loading && (
                                <CircularLoader size={22} thickness={2} color={theme.primary} duration={1000} />
                            )}
                            {clearable && hasValue && (
                                <button type='button' onClick={onClearHandler} className='inline-flex cursor-pointer'>
                                    <Icon icon='mdi:close' size={iconSize} color={accentColor} />
                                </button>
                            )}
                            {!!appendInnerIcon && <Icon icon={appendInnerIcon} size={iconSize} color={accentColor} />}
                            {appendInnerRender?.({ isFocus, isError })}
                        </div>
                        <Menu
                            open={menuLocal}
                            position='left-bottom'
                            zIndex={2}
                            animation='fade-in'
                            offset={{ y: 5 }}
                            className={`shadow-full-md max-h-56 w-full overflow-auto rounded-md bg-white !p-0 ${styles.menu} ${classNames.menu}`}
                        >
                            {loading && (
                                <p
                                    className={`text-title-md p-4 text-center ${classNames.loadingText}`}
                                    style={{
                                        color: parsedTextColor
                                    }}
                                >
                                    {loadingText}
                                </p>
                            )}
                            {!loading && !filteredOptions.length && (
                                <p
                                    className={`text-title-md p-4 text-center ${classNames.noDataText}`}
                                    style={{
                                        color: parsedTextColor
                                    }}
                                >
                                    {noDataText}
                                </p>
                            )}
                            {!!(!loading && filteredOptions.length) && (
                                <ul>
                                    {filteredOptions.map((option, idx) => {
                                        const isSelected = isOptionSelected(option);
                                        const isHovered = hoveredOptionIdx === idx;
                                        const isFocused = focusedOptionIdx === idx;
                                        return (
                                            <li
                                                key={option.value}
                                                ref={(node: null | HTMLLIElement) => {
                                                    if (node && isFocused) {
                                                        focusedOptionRef.current = node;
                                                    }
                                                }}
                                                role={!option.disabled ? 'button' : undefined}
                                                onMouseEnter={() => {
                                                    setHoveredOptionIdx(idx);
                                                    setFocusedOptionIdx(idx);
                                                }}
                                                onMouseLeave={() => {
                                                    setHoveredOptionIdx(-1);
                                                    setFocusedOptionIdx(-1);
                                                }}
                                                onClick={() => onOptionClickHandler(option)}
                                                className={`cursor-pointer p-2 transition-colors duration-300 ${option.disabled ? 'pointer-events-none opacity-50' : ''} ${styles.option} ${classNames.option}`}
                                                style={{
                                                    backgroundColor: isSelected
                                                        ? parsedSelectionColor
                                                        : isHovered || isFocused
                                                          ? parsedHoverColor
                                                          : 'transparent'
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
                        <div className='flex shrink-0 items-center gap-2'>
                            {!!appendOuterIcon && <Icon icon={appendOuterIcon} size={iconSize} color={accentColor} />}
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
