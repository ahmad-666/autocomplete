'use client';

import { useState } from 'react';
import Container from '@/components/Container';
import AutoComplete, { type Option } from '@/components/AutoComplete';

const options: Option[] = Array.from({ length: 5 }, (_, i) => ({ value: i + 1, label: `item-${i + 1}` }));

const TestPage = () => {
    const [val, setVal] = useState<null | Option>(null);

    return (
        <div>
            <Container className='!overflow-visible'>
                <div className='w-60'>
                    <AutoComplete
                        variant='outline'
                        size='md'
                        value={val}
                        options={options}
                        onChange={(newVal) => setVal(newVal)}
                    />
                </div>
            </Container>
        </div>
    );
};

export default TestPage;
