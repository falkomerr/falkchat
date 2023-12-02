import { ChatHeader } from "@/components/chat/chat-header";
import { createOrFindConversation } from "@/utils/conversation";
import { currentProfile } from "@/utils/current-profile";
import { db } from "@/utils/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface props {
  params: {
    memberId: string;
    serverId: string;
  };
}

const MemberIDPage = async ({ params }: props) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
      server: {
        include: {
          channels: {
            where: {
              name: "general",
            },
          },
        },
      },
    },
  });

  if (!member) {
    return redirect("/");
  }

  const conversation = await createOrFindConversation(
    member.id,
    params.memberId
  );

  if (!conversation) {
    return redirect(
      `/servers/${params?.serverId}/channels/${member.server.channels[0]}`
    );
  }

  const otherMember =
    member.profileId === profile.id
      ? conversation.secondMember
      : conversation.firstMember;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={params.serverId}
        type="conversation"
      />
    </div>
  );
};
export default MemberIDPage;
