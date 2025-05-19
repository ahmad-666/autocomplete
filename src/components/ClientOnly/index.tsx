'use client';

import { type ReactNode } from 'react';
import useClient from '@/hooks/useClient';

type Props = {
    children: ReactNode;
};

export default function ClientOnly({ children }: Props) {
    const isClient = useClient();

    if (!isClient) return null;
    return <>{children}</>;
}
