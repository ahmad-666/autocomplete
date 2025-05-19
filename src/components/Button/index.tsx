'use client';

import { type ReactNode, type ComponentProps, type CSSProperties } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import CircularLoader from '@/components/CircularLoader';
import useColor from '@/hooks/useColor';
import { type QueryParams } from '@/types/QueryParams';

//* Types -----------------------------
export type Variant = 'fill' | 'outline' | 'text';
export type Size = 'sm' | 'md' | 'lg';
export type Href = string | { pathname: string; query?: Record<string, string> };

type Props = ComponentProps<'button'> & {
    variant?: Variant;
    size?: Size;
    color?: string;
    circular?: boolean;
    href?: Href;
    target?: '_self' | '_blank';
    /** can be noopener,noreferrer,nofollow,prev,next */
    rel?: string;
    hover?: boolean;
    press?: boolean;
    elevation?: boolean;
    loading?: boolean;
    queryParams?: QueryParams;
    children: ReactNode;
};

//* Component -----------------------------
const Button = ({
    variant = 'fill',
    size = 'md',
    color = 'primary',
    circular = false,
    href,
    target = '_self',
    rel,
    //noopener: browser not providing context access to the webpage that opened the link ... use on external links with target="_blank"
    //noreferrer: browser not send info about our site(referrer) to target website ... use on external links with target="_blank" except those links that are still own by us e.g dashboard,other landings,blogs,... else google analytics cannot track link.
    //nofollow: don't endorse target website so we don't pass any link juice ...  use for ads,paid links,... not use for social links
    //prev | next: set url of prev,next page for paginated sections
    hover = true,
    press = false,
    elevation = true,
    disabled = false,
    loading = false,
    queryParams,
    children,
    style,
    className = '',
    ...rest
}: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const defaultSourceName = pathname === '/' ? 'main' : (pathname.split('/').filter(Boolean).at(-1) ?? 'main');

    const isLink = !!href;
    const Component = isLink ? Link : 'button';
    const parsedColor = useColor(color);
    const parsedPaleColor = useColor('neutral-light4');

    const cssClasses = {
        textVariant: `bg-transparent text-(--color) border-none ${hover ? 'hover:bg-(--color-pale)' : ''} ${press ? 'active:bg-transparent active:border-2 active:border-solid active:border-(--color-pale)' : ''}`,
        outlineVariant: `bg-transparent text-(--color) border-1 border-solid border-(--color) ${hover ? 'hover:bg-(--color-pale)' : ''} ${press ? 'active:border-2' : ''}`,
        fillVariant: `bg-(--color) text-white border-none ${hover ? 'hover:bg-(--color-dark)' : ''} ${press ? 'active:border-2 active:border-solid active:border-(--color-pale)' : ''}`,
        roundedSize: `rounded-md py-1 ${size === 'sm' ? `px-3 min-h-7 ${press ? 'active:min-h-8' : ''}` : ''} ${size === 'md' ? `px-4 min-h-8 ${press ? 'active:min-h-9' : ''}` : ''} ${size === 'lg' ? `px-5 min-h-10 ${press ? 'active:min-h-11' : ''}` : ''}`,
        circularSize: `rounded-circle aspect-square p-0 ${size === 'sm' ? `w-10 h-10 ${press ? 'active:min-w-11 active:min-h-11' : ''}` : ''} ${size === 'md' ? `w-12 h-12 ${press ? 'active:min-w-13 active:min-h-13' : ''}` : ''} ${size === 'lg' ? `w-14 h-14 ${press ? 'active:min-w-15 active:min-h-15' : ''}` : ''}`,
        shadow:
            elevation && (variant === 'outline' || variant === 'fill')
                ? 'shadow-sm shadow-(color:--color-pale)'
                : 'shadow-none'
    };

    // click handler for link buttons with query params
    const handleClick = (e: React.MouseEvent) => {
        if (loading || disabled) return;

        if (isLink && queryParams) {
            e.preventDefault();

            const url = new URL(
                typeof href === 'string' ? href : typeof href === 'object' ? href.pathname : '/',
                window.location.origin
            );

            const paramsWithCtaPage = queryParams
                ? {
                      cta_page: defaultSourceName,
                      ...queryParams
                  }
                : {};

            Object.entries(paramsWithCtaPage).forEach(([key, value]) => {
                url.searchParams.set(key, String(value));
            });

            router.push(url.pathname + url.search);
        }
        if (typeof rest.onClick === 'function') {
            rest.onClick(e as React.MouseEvent<HTMLButtonElement>);
        }
    };

    return (
        <Component
            //@ts-expect-error intentional element switch
            href={isLink ? (queryParams ? '/' : href) : undefined}
            target={isLink ? target : undefined}
            rel={rel}
            disabled={disabled}
            //@ts-expect-error intentional element switch
            onClick={handleClick}
            className={`text-label-lg inline-flex items-center justify-center outline-none ${loading ? 'pointer-events-none' : ''} ${disabled ? 'pointer-events-none opacity-40' : 'cursor-pointer'} ${cssClasses.shadow} ${circular ? cssClasses.circularSize : cssClasses.roundedSize} ${variant === 'text' ? cssClasses.textVariant : variant === 'outline' ? cssClasses.outlineVariant : cssClasses.fillVariant} ${className}`}
            style={
                {
                    '--color': parsedColor,
                    '--color-pale': parsedPaleColor,
                    '--color-light': `color-mix(in srgb,${parsedColor},white 15%)`,
                    '--color-dark': `color-mix(in srgb,${parsedColor},black 15%)`,
                    ...style
                } as CSSProperties
            }
            {...rest}
        >
            {loading ? (
                <CircularLoader
                    size={size === 'sm' ? 14 : size === 'md' ? 18 : 22}
                    thickness={1}
                    color={variant === 'fill' ? 'white' : color}
                />
            ) : (
                children
            )}
        </Component>
    );
};

export default Button;
