import { getAuth } from '@clerk/nextjs/server';

import { db } from '@/shared/api-helpers/db';
import { NextApiRequest } from 'next';

export const pagesCurrentProfile = async (req: NextApiRequest) => {
    const { userId } = getAuth(req);

    if (!userId) {
        return null;
    }

    const profile = await db.profile.findUnique({
        where: {
            userId,
        },
    });

    return profile;
};
