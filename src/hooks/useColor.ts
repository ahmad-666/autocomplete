import { useState, useEffect } from 'react';
import twColors from 'tailwindcss/colors';
// import paletteColors from '@/themes/mui/palette';

type Splitter = '.' | '-';
const useColor = (input: string, splitter?: Splitter) => {
    //?it supports 'primary','primary-light1','primary.light1' formats
    const getColor = () => {
        const colorSplitter = splitter || input.includes('.') ? '.' : '-';
        const colorSplit = input.split(colorSplitter) || [];
        const [colorName, colorVariant = ''] = colorSplit;
        const paletteColor = undefined;
        // const paletteColor = paletteColors[colorName]?.[colorVariant || 'main'];
        //@ts-expect-error 'get tailwind color'
        const twColor = twColors[colorName]?.[colorVariant];
        return paletteColor || twColor || input || 'transparent';
    };
    const [color, setColor] = useState(() => getColor());
    useEffect(() => {
        const newColor = getColor();
        setColor(newColor);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input]);
    return color;
};

export default useColor;

//? Usage: useColor('primary') , useColor('pastelPink-light2') , useColor('blue-500') , useColor('#ff00ff') , useColor('red') , useColor('neutral.light3')
