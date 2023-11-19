import { Member, Profile, Server } from '@prisma/client';

export type ServerWithMembersWithProfiles = Server & {
    members: (Member & { profile: Profile })[];
};
