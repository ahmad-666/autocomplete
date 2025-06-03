import { type RefObject, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';

export type Mode = 'select' | 'autocomplete' | 'combobox';
export type Variant = 'filled' | 'outline';
export type Size = number | 'sm' | 'md' | 'lg';
export type BlurReason = 'click-outside' | 'option-select';
export type SelectReason = 'option-click' | 'enter-key';
export type Option = {
    /** default value of each option for selection */
    value: number | string;
    /** default text of each option that we show in UI */
    label: string;
    disabled?: boolean;
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
    /** hover background color for options */
    hover?: string;
    /** selection background color for options */
    selection?: string;
};
export type ClassNames = {
    /** add css className to container */
    container?: string;
    /** add css className to label */
    label?: string;
    /** add css className to input */
    input?: string;
    /** add css className to menu */
    menu?: string;
    /** add css className to option */
    option?: string;
    /** add css className to loadingText */
    loadingText?: string;
    /** add css className to noDataText */
    noDataText?: string;
    /** add css className to value container */
    valueContainer?: string;
    /** add css className to value */
    value?: string;
    /** add css className to message */
    message?: string;
};
export type BaseAutoCompleteProps<Opt extends Option> = {
    /** 'select' | 'autocomplete' | 'combobox' */
    mode?: Mode;
    /** 'filled' | 'outline' */
    variant?: Variant;
    /** 'sm' | 'md' | 'lg' */
    size?: Size;
    /** options of menu */
    options: Opt[];
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
    /** ref of input element */
    inputRef?: RefObject<HTMLInputElement>;
    /** autoComplete of input element */
    autoComplete?: string;
    /** make component readOnly */
    readOnly?: boolean;
    /** make component disabled */
    disabled?: boolean;
    /** add clear icon */
    clearable?: boolean;
    /** add loading component */
    loading?: boolean;
    /** if true we filter those options that we select from menu */
    filterSelections?: boolean;
    /** custom function to filter options */
    filterFn?: (search: string, options: Opt[]) => Opt[];
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
    /** hide message section */
    hideMessage?: boolean;
    /** set error state */
    error?: boolean;
    /** error or hint message */
    message?: string;
    /** control search text */
    search?: string;
    /** get latest search value */
    onSearchChange?: (newSearch: string) => void;
    /** control menu open state */
    menu?: boolean;
    /** get latest menu open state value */
    onMenuChange?: (newSearch: boolean) => void;
    /** handle focus event */
    onFocus?: (containerRef: RefObject<HTMLDivElement>) => void;
    /** handle blur event */
    onBlur?: (containerRef: RefObject<HTMLDivElement>) => void;
    /** handle key down event */
    onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
    containerRef?: RefObject<HTMLDivElement>;
    /** theme for coloring */
    theme?: Theme;
    /** custom css class names for different sections of component */
    classNames?: ClassNames;
    /** css className of container */
    className?: string;
    /** css inline style of container */
    style?: CSSProperties;
};
export type SingleAutoCompleteProps<Opt extends Option> = {
    /** value of component ... for multiple:false value is null|Option else value is Option[]  */
    value: null | Opt;
    /** for set value prop */
    onChange?: (newValue: null | Opt) => void;
    /** if multiple:false then value is null|Option else value is Option[] */
    multiple?: false;
    /** render custom jsx for value section */
    valueRender?: (value: null | Opt) => ReactNode;
    /** render custom jsx for each option */
    optionRender?: (option: Opt, value: null | Opt, isSelected: boolean) => void;
};
export type MultipleAutoCompleteProps<Opt extends Option> = {
    /** value of component ... for multiple:false value is null|Option else value is Option[]  */
    value: Opt[];
    /** for set value prop */
    onChange?: (newValue: Opt[]) => void;
    /** if multiple:false then value is null|Option else value is Option[] */
    multiple: true;
    /** render custom jsx for value section */
    valueRender?: (value: Opt[]) => ReactNode;
    /** render custom jsx for each option */
    optionRender?: (option: Opt, value: Opt[], isSelected: boolean) => void;
};
export type AutoCompleteProps<Opt extends Option> = BaseAutoCompleteProps<Opt> &
    (SingleAutoCompleteProps<Opt> | MultipleAutoCompleteProps<Opt>);
//? We use union types to allow both single and multiple props with generic options type
//? If we used bellow type then it would be valid on each AutoComplete component usage but inside AutoComplete component definition we should used type assertion each time we use 'value','onChange',... props
// type AutoCompleteProps<Opt extends Option, Multiple extends undefined | boolean = false> = {
//     value: Multiple extends true ? Opt[] : null | Opt;
//     onChange?: (newValue: Multiple extends true ? Opt[] : null | Opt) => void;
//     options: Opt[];
//     multiple?: Multiple;
// };
