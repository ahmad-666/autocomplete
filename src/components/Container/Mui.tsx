'use client';

import Box, { type BoxProps } from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export type Size = 'sm' | 'md' | 'lg';
type Props = BoxProps & {
    size?: Size;
};

export default function Container({ size = 'md', children, ...rest }: Props) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('desktopXl'));
    const getWidth = () => {
        let w;
        if (size === 'sm') w = isMobile ? '84%' : '800px';
        else if (size === 'md') w = isMobile ? '92%' : '1000px';
        else if (size === 'lg') w = isMobile ? '96%' : '1200px';
        return w;
    };
    const width = getWidth();

    return (
        <Box overflow='hidden' width={width} mx='auto' {...rest}>
            {children}
        </Box>
    );
}
