import { useId, useRef, useState, useEffect, useMemo } from 'react';
import Icon from '@/components/Icon';
import FormLabel from '../FormLabel';
import FormMessage from '../FormMessage';
import useColor from '@/hooks/useColor';
import colors from './colors';
import type { AutoCompleteProps, Option } from './types';

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
    filterSelects = false,
    prependOuterIcon,
    prependOuterRender,
    prependInnerIcon,
    prependInnerRender,
    appendInnerIcon,
    appendInnerRender,
    appendOuterIcon,
    appendOuterRender,
    search,
    onSearchChange,
    menu,
    onMenuChange,
    hideMessage = false,
    error,
    message,
    theme = colors,
    className = '',
    style
}: AutoCompleteProps<Opt, Multiple>) => {
    const randomId = useId().replace(/:/g, '').toLowerCase();
    const finalId = inputId || randomId;
    const [searchLocal, setSearchLocal] = useState(search || '');
    const [menuLocal, setMenuLocal] = useState(menu || false);
    const [isFocus, setIsFocus] = useState(false);
    const isError = !!error;
    const parsedPrimaryColor = useColor(theme.primary || colors.primary!);
    const parsedOutlineColor = useColor(theme.outline || colors.outline!);
    const parsedFillColor = useColor(theme.fill || colors.fill!);
    const parsedTextColor = useColor(theme.text || colors.text!);
    const parsedErrorColor = useColor(theme.error || colors.error!);
    const accentColor = isError ? theme.error : isFocus ? theme.primary : theme.text;
    const onClearHandler = () => {
        //@ts-expect-error 'we manually handle it'
        onChange?.(!multiple ? null : []);
    };
    useEffect(() => {
        setSearchLocal(search || '');
    }, [search]);
    useEffect(() => {
        setMenuLocal(menu || false);
    }, [menu]);

    return (
        <div className={`${className}`} style={{ ...style }}>
            {!!label && (
                <FormLabel inputId={finalId} className='mb-3'>
                    {label}
                </FormLabel>
            )}
            <div className='flex items-center gap-2'>
                {!!(prependOuterRender || prependOuterIcon) && (
                    <div className='flex items-center gap-2'>
                        {prependOuterRender?.({ isFocus, isError })}
                        {!!prependOuterIcon && <Icon icon={prependOuterIcon} size='md' color={accentColor} />}
                    </div>
                )}
                <div>
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
                            readOnly={readOnly}
                            disabled={disabled}
                            placeholder={placeholder}
                        />
                        {!!(loading || clearable) && (
                            <div className='flex items-center gap-2'>
                                {loading && <></>}
                                {clearable && (
                                    <button onClick={onClearHandler}>
                                        <Icon icon='mdi:close' size='md' color={accentColor} />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                    {!!(appendInnerIcon || appendInnerRender) && (
                        <div className='flex items-center gap-2'>
                            {!!appendInnerIcon && <Icon icon={appendInnerIcon} size='md' color={accentColor} />}
                            {appendInnerRender?.({ isFocus, isError })}
                        </div>
                    )}
                </div>
                {!!(appendOuterIcon || appendOuterRender) && (
                    <div className='flex items-center gap-2'>
                        {!!appendOuterIcon && <Icon icon={appendOuterIcon} size='md' color={accentColor} />}
                        {appendOuterRender?.({ isFocus, isError })}
                    </div>
                )}
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
