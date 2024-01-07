import { ServerIdPage } from '@/pages/server-id';

interface props {
    params: {
        serverId: string;
    };
}

const Page = async (props: props) => {
    return <ServerIdPage {...props} />;
};
export default Page;
