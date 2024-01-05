import { InvitePage } from '@/client-pages/invite-page';

interface props {
    params: {
        inviteCode: string;
    };
}

const Page = async (props: props) => {
    return <InvitePage {...props} />;
};

export default Page;
