'use client';

import { useSearchParams } from 'next/navigation';
import Link, { type LinkProps } from 'next/link'; //? for routing in nextjs we must only use 'next/Link' and '@mui/material/Button','@mui/material/Link' will cause re-rendering
import MuiButton, { type ButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme, alpha } from '@mui/material/styles';
import useUTM from '@/hooks/useUTM';
import { type UTM } from '@/types/UTM';

type Props = Omit<ButtonProps, 'href'> & {
    /** same as next/link 'href' prop ... can be string or {pathname,query:{},hash,...} */
    href?: LinkProps['href']; //we don't use MuiButton 'href' props and instead use next/link 'href' prop ... we could manually use: string|{pathname:string;query?:Record<string,string>,hash?:string} too
    /** if set to true then we keep current url queries */
    preserveUrlQueries?: boolean;
    /** for generate utm queries */
    utms?: UTM;
    /** can be '_self' | '_blank' */
    target?: '_self' | '_blank';
    /** only use if 'color' prop is not enough e.g if we want to use lighten/darken colors ... css colors or mui colors with variants e.g 'white','neutral.light4',... */
    bgColor?: string;
    /** only use if 'color' prop is not enough e.g if we want to use lighten/darken colors ... css colors or mui colors with variants e.g 'white','neutral.light4',... */
    textColor?: string;
    /** only use if 'color' prop is not enough e.g if we want to use lighten/darken colors ... css colors or mui colors with variants e.g 'white','neutral.light4',... */
    borderColor?: string;
    /** only use if 'color' prop is not enough e.g if we want to use lighten/darken colors ... only will be used for :hover,:active state */
    outlineColor?: string;
    loading?: boolean;
    loadingColor?: string;
};

//? Mui has Button,IconButton,Fab,ButtonGroup,ToggleButton,ToggleButtonGroup,... and here we only have wrapper for Button variant
export default function Button({
    component = 'button',
    variant = 'contained',
    size = 'medium',
    color = 'primary', //only accepts main colors(not light/dark/... variants) e.g 'primary','success',...
    bgColor,
    textColor,
    borderColor,
    outlineColor,
    loadingColor,
    loading = false,
    disabled = false,
    disableRipple = false,
    disableElevation = false, //'contained' buttons by default has some box-shadow but 'outlined','text' buttons does not have any shadow ... we can use disableElevation to remove shadow of 'contained' buttons
    href,
    preserveUrlQueries = false,
    utms, //no need for creating extra wrapper components for UTMs and CTAs and simply we pass utms props
    target = '_self',
    children,
    sx,
    ...rest
}: Props) {
    //? for links we simply use next/link without any style as wrapper of MuiButton

    const theme = useTheme();
    const searchParams = useSearchParams();
    //@ts-expect-error 'manually set palette keys'
    const fadeColor = alpha(theme.palette[color]['main'], 0.2);
    const greyFadeColor = alpha(theme.palette.neutral.main, 0.2);
    const { utms: generatedUTMs } = useUTM({ initialUTMs: utms || {} });
    const hrefMode = /(http:|https:)/.test(href as string) ? 'external' : 'internal';

    const generateHref = () => {
        if (!preserveUrlQueries && !utms) return href;
        const queries = new URLSearchParams();
        if (preserveUrlQueries) searchParams.forEach((val, key) => queries.set(key, val));
        if (utms) generatedUTMs.forEach((val, key) => queries.set(key, val));
        if (typeof href === 'string') {
            //if href is string e.g '/' , '/login?key=val' , ...
            const [pathname, currentQueries] = href.split('?');
            new URLSearchParams(currentQueries).forEach((val, key) => queries.set(key, val));
            return `${pathname}${queries.size ? `?${queries.toString()}` : ''}`;
        } else {
            //if href is object like {pathname:'/',query:{key:'val'}}
            const { query, ...rest } = href as { query?: Record<string, string>; [key: string]: unknown };
            new URLSearchParams(query).forEach((val, key) => queries.set(key, val));
            return {
                query: Object.fromEntries(queries.entries()),
                ...rest
            };
        }
    };
    const finalHref = generateHref() as LinkProps['href'];

    const buttonRenderer = () => {
        return (
            <MuiButton
                component={component}
                variant={variant}
                color={color}
                size={size}
                // loading={loading} //in new version of mui Button has loading prop but we don't use it here
                disabled={disabled}
                disableRipple={disableRipple}
                disableElevation={disableElevation}
                sx={{
                    display: 'inline-flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    pointerEvents: loading || disabled ? 'none' : 'auto',
                    typography: 'labelLg',
                    textTransform: 'initial',
                    minHeight: size === 'small' ? 28 : size === 'medium' ? 32 : 48, //use min-height and not height so button will be responsive but we can use sx={{height:32}} on parent for special cases
                    px: size === 'small' ? 3 : size === 'medium' ? 4 : 5,
                    py: size === 'small' ? 0.5 : size === 'medium' ? 1 : 2,
                    borderRadius: 2,
                    transition: theme.transitions.create(['color', 'background-color'], {
                        duration: theme.transitions.duration.standard,
                        easing: 'linear'
                    }),
                    bgcolor: bgColor,
                    color: textColor,
                    borderColor,
                    // for :hover,:focus,:active its better that we use 'outline' instead of 'border' because 'outline' will not change element sizing so we don't get any layout shift
                    ...(variant === 'contained' && {
                        '&:active': {
                            outline: '2px solid',
                            outlineColor: outlineColor || fadeColor
                        }
                    }),
                    ...(variant === 'outlined' && {
                        '&:hover': {
                            bgcolor: greyFadeColor
                        },
                        '&:active': {
                            borderColor: 'transparent', //in outlined we already have border so we make it invisible without changing border-width
                            outline: '2px solid', //already has 1px border
                            outlineColor: outlineColor || `${color}.main`
                        }
                    }),
                    ...(variant === 'text' && {
                        '&:hover': {
                            bgcolor: fadeColor
                        },
                        '&:active': {
                            outline: '2px solid',
                            outlineColor: outlineColor || fadeColor
                        }
                    }),
                    opacity: disabled ? 0.5 : 1,
                    ...sx
                }}
                {...rest}
            >
                {!loading ? (
                    children
                ) : (
                    <CircularProgress
                        variant='indeterminate'
                        size={20}
                        sx={{
                            color: loadingColor || (variant === 'contained' ? 'white' : color)
                        }}
                    />
                )}
            </MuiButton>
        );
    }; //normal function that return jsx and we simply call it ... we should not use const ButtonRender = () => jsx and use it like <ButtonRenderer />

    if (href && hrefMode === 'internal') {
        //nextjs link
        return (
            <Link href={finalHref!} target={target}>
                {buttonRenderer()}
            </Link>
        );
    } else if (href && hrefMode === 'external') {
        //normal anchor tag link
        return (
            <a href={finalHref! as string} target={target}>
                {buttonRenderer()}
            </a>
        );
    } else {
        //simple button
        return buttonRenderer();
    }
    // or instead of above code we could remove href,utms props and simply wrap <Link> on parent:
    // <Link target="_blank" href={{pathname:'...',query:{source_widget:''}}}> <Button> Link </Button> </Link>
}

//? Usage:
{
    /* <Button variant='contained' size='medium' color='pastelPink'
    loading={false}disabled={false} disableElevation={false} disableRipple={false}
    href='/' target='_blank' onClick={() => {}} sx={{bgcolor: 'primary.light2'}}
>
    <Icon icon='mdi:user' size='md' color='white' className='mr-2' />
    content
    <Icon icon='mdi:close' size='md' color='white' className='ml-1' />
</Button> */
}
{
    /* <Button href={{ pathname: '/', query: { key: 'val' } }} utms={{ source_widget: 'name' }}></Button>; */
}
