import { ChatHeader } from '@/components/chat/chat-header';
import { currentProfile } from '@/utils/current-profile';
import { db } from '@/utils/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

interface props {
    params: {
        serverId: string;
        channelId: string;
    };
}

const ChannelIDPage = async ({ params }: props) => {
    const profile = await currentProfile();

    if (!profile) {
        return redirectToSignIn();
    }

    const member = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.id,
        },
    });

    const channel = await db.channel.findUnique({
        where: {
            id: params.channelId,
        },
    });

    if (!member || !channel) {
        return redirect('/');
    }

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader serverId={params.serverId} name={channel.name} type="channel" />
        </div>
    );
};
export default ChannelIDPage;
