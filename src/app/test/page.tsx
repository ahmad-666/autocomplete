'use client';

import { useEffect, useRef, useState } from 'react';
import Container from '@/components/Container';
import AutoComplete, { type Option } from '@/components/AutoComplete';

const options: Option[] = Array.from({ length: 50 }, (_, i) => ({ value: i + 1, label: `item-${i + 1}` }));

const TestPage = () => {
    const [val1, setVal1] = useState<null | Option>(null);
    const [val2, setVal2] = useState<Option[]>([]);
    console.log('🚀 ~ TestPage ~ val:', val1);

    return (
        <div>
            <Container className='!overflow-visible'>
                <div className='w-200'>
                    <AutoComplete
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
                </div>
            </Container>
        </div>
    );
};

export default TestPage;
