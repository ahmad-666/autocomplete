'use client';

import { useEffect, useRef, useState } from 'react';
import Container from '@/components/Container';
import AutoComplete, { type Option } from '@/components/AutoComplete';

type CustomOption = Option & { desc: string };

const options: CustomOption[] = Array.from({ length: 50 }, (_, i) => ({
    value: i + 1,
    label: `item-${i + 1}`,
    desc: 'desc'
}));

const TestPage = () => {
    const [val1, setVal1] = useState<null | CustomOption>(null);
    const [val2, setVal2] = useState<CustomOption[]>([]);
    // console.log('🚀 ~ TestPage ~ val1:', val1);
    // console.log('🚀 ~ TestPage ~ val2:', val2);

    return (
        <div>
            <Container className='!overflow-visible'>
                <div className='w-200 max-w-full'>
                    <AutoComplete
                        labelPos='outside'
                        mode='combobox'
                        variant='outline'
                        size='md'
                        value={val1}
                        options={options}
                        onChange={(newVal) => setVal1(newVal)}
                        clearable
                        placeholder='Placeholder'
                        label='Label'
                    />
                    <AutoComplete
                        labelPos='inside'
                        mode='autocomplete'
                        variant='outline'
                        multiple={false}
                        size='sm'
                        loading={false}
                        // prependInnerIcon='mdi:user'
                        value={val1}
                        options={options}
                        onChange={(newVal) => setVal1(newVal)}
                        clearable
                        placeholder='Placeholder'
                        label='Label sd ad sa d sa sadsadsad'
                    />
                </div>
            </Container>
        </div>
    );
};

export default TestPage;
