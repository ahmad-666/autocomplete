import { type CSSProperties, type ReactNode } from 'react';

export type Mode = 'select' | 'autocomplete' | 'combobox';
export type Variant = 'filled' | 'outline';
export type Size = 'sm' | 'md' | 'lg';
export type Option = {
    value: number | string;
    label: string;
    [key: string]: unknown;
};
export type Theme = {
    /** color for active,focus,... states */
    primary?: string;
    /** border color for variant="outline" */
    outline?: string;
    /** bg color for variant="filled" */
    fill?: string;
    /** base text color */
    text?: string;
    /** color for error state */
    error?: string;
};
export type AutoCompleteProps<Opt extends Option, Multiple extends undefined | boolean = false> = {
    /** 'select' | 'autocomplete' | 'combobox' */
    mode?: Mode;
    /** 'filled' | 'outline' */
    variant?: Variant;
    /** 'sm' | 'md' | 'lg' */
    size?: Size;
    /** value of component ... for multiple:false value is null|Option else value is Option[]  */
    value: Multiple extends true ? Opt[] : null | Opt;
    /** for set value prop */
    onChange?: (newValue: Multiple extends true ? Opt[] : null | Opt) => void;
    /** options of menu */
    options: Opt[];
    /** if multiple:false then value is null|Option else value is Option[] */
    multiple?: Multiple;
    /** render custom jsx for value section */
    valueRender?: (value: Multiple extends true ? Opt[] : null | Opt) => ReactNode;
    /** render custom jsx for each option */
    optionRender?: (option: Opt, value: Multiple extends true ? Opt[] : null | Opt, isSelected: boolean) => void;
    /** placeholder */
    placeholder?: string;
    /** label */
    label?: string;
    /** text for loading:true state */
    loadingText?: string;
    /** text if no options are available */
    noDataText?: string;
    /** name of input element */
    inputName?: string;
    /** id of input element */
    inputId?: string;
    /** make component readOnly */
    readOnly?: boolean;
    /** make component disabled */
    disabled?: boolean;
    /** add clear icon */
    clearable?: boolean;
    /** add loading component */
    loading?: boolean;
    /** if true we filter those options that we select from menu */
    filterSelects?: boolean;
    /** icon for prependOuterIcon */
    prependOuterIcon?: string;
    /** render custom jsx for prependOuterIcon */
    prependOuterRender?: ({ isFocus, isError }: { isFocus: boolean; isError: boolean }) => ReactNode;
    /** icon for prependInnerIcon */
    prependInnerIcon?: string;
    /** render custom jsx for prependInnerIcon */
    prependInnerRender?: ({ isFocus, isError }: { isFocus: boolean; isError: boolean }) => ReactNode;
    /** icon for appendInnerIcon */
    appendInnerIcon?: string;
    /** render custom jsx for appendInnerIcon */
    appendInnerRender?: ({ isFocus, isError }: { isFocus: boolean; isError: boolean }) => ReactNode;
    /** icon for appendOuterIcon */
    appendOuterIcon?: string;
    /** render custom jsx for appendOuterIcon */
    appendOuterRender?: ({ isFocus, isError }: { isFocus: boolean; isError: boolean }) => ReactNode;
    /** control search text */
    search?: string;
    /** get latest search value */
    onSearchChange?: (newSearch: string) => void;
    /** control menu open state */
    menu?: boolean;
    /** get latest menu open state value */
    onMenuChange?: (newSearch: boolean) => void;
    /** hide message section */
    hideMessage?: boolean;
    /** set error state */
    error?: boolean;
    /** error or hint message */
    message?: string;
    /** theme for coloring */
    theme?: Theme;
    /** css className of container */
    className?: string;
    /** css inline style of container */
    style?: CSSProperties;
};
