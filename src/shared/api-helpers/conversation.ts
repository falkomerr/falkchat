import { db } from '@/shared/api-helpers/db';

export const createOrFindConversation = async (firstMemberId: string, secondMemberId: string) => {
    let conversation =
        (await findConversation(firstMemberId, secondMemberId)) ||
        (await findConversation(secondMemberId, firstMemberId));

    if (!conversation) {
        conversation = await createNewConversation(firstMemberId, secondMemberId);
    }

    return conversation;
};

const findConversation = async (firstMemberId: string, secondMemberId: string) => {
    try {
        return await db.conversation.findFirst({
            where: {
                AND: [{ firstMemberId: firstMemberId }, { secondMemberId: secondMemberId }],
            },
            include: {
                firstMember: {
                    include: {
                        profile: true,
                    },
                },
                secondMember: {
                    include: {
                        profile: true,
                    },
                },
            },
        });
    } catch {
        return null;
    }
};

const createNewConversation = async (firstMemberId: string, secondMemberId: string) => {
    try {
        return await db.conversation.create({
            data: {
                firstMemberId: firstMemberId,
                secondMemberId: secondMemberId,
            },
            include: {
                firstMember: {
                    include: {
                        profile: true,
                    },
                },
                secondMember: {
                    include: {
                        profile: true,
                    },
                },
            },
        });
    } catch {
        return null;
    }
};
