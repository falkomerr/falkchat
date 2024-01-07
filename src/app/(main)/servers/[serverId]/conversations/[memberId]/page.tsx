import { MemberIdPage } from '@/pages/chat-id';

interface MemberIdPageProps {
    params: {
        memberId: string;
        serverId: string;
    };
    searchParams: {
        video?: boolean;
    };
}

const Page = async (props: MemberIdPageProps) => {
    return <MemberIdPage {...props} />;
};

export default Page;
