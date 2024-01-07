import { ChannelIdPage } from '@/pages/chat-id';

interface props {
    params: {
        serverId: string;
        channelId: string;
    };
}

const Page = async (props: props) => {
    return <ChannelIdPage {...props} />;
};

export default Page;
