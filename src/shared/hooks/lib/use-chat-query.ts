import { useSocket } from '@/shared/providers/ui/socket-provider';
import qs from 'query-string';
import { useInfiniteQuery } from '@tanstack/react-query';

interface props {
    queryKey: string;
    apiUrl: string;
    paramKey: 'channelId' | 'conversationId';
    paramValue: string;
}

export const useChatQuery = ({ queryKey, apiUrl, paramKey, paramValue }: props) => {
    const { isConnected } = useSocket();

    const fetchMessages = async ({ pageParam = undefined }) => {
        const url = qs.stringifyUrl(
            {
                url: apiUrl,
                query: {
                    cursor: pageParam,
                    [paramKey]: paramValue,
                },
            },
            { skipNull: true },
        );

        const res = await fetch(url);
        return res.json();
    };

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
        queryKey: [queryKey],
        queryFn: fetchMessages,
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        refetchInterval: isConnected ? false : 1000,
        initialPageParam: undefined,
    });

    return { data, fetchNextPage, hasNextPage, isFetchingNextPage, status };
};
