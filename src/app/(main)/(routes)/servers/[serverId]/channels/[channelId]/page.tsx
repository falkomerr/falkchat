import { ChatInput } from '@/features/chat-input';
import { currentProfile } from '@/shared/utils/lib/current-profile';
import { db } from '@/shared/utils/lib/db';
import { ChatHeader } from '@/widgets/modals/ui/chat-header';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { ChatMessages } from '@/widgets/chat-messages';

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
            <ChatMessages
                member={member}
                name={channel.name}
                chatId={channel.id}
                type="channel"
                apiUrl="/api/messages"
                socketUrl="/api/socket/messages"
                socketQuery={{
                    channelId: channel.id,
                    serverId: channel.serverId,
                }}
                paramKey="channelId"
                paramValue={channel.id}
            />
            <ChatInput
                name={channel.name}
                type="channel"
                apiUrl="/api/socket/messages"
                query={{
                    channelId: channel.id,
                    serverId: channel.serverId,
                }}
            />
        </div>
    );
};
export default ChannelIDPage;
