'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import React, { useState } from 'react';
import { api } from '~/utils/api';

export function TRPCProvider(props: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        suspense: true,
                        refetchOnWindowFocus: false,
                    },
                },
            })
    );

    const [trpcClient] = useState(() =>
        api.createClient({
            links: [
                httpBatchLink({
                    url: '/api/trpc',
                }),
            ],
        })
    );

    return (
        <api.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {props.children}
            </QueryClientProvider>
        </api.Provider>
    );
} 