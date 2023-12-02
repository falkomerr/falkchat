"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal-store";
import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus2,
  Users,
} from "lucide-react";

interface props {
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
}

export const ServerHeader = ({ server, role }: props) => {
  const { onOpen } = useModal();

  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none" asChild>
          <button className="w-full text-md px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2  hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
            {server.name}
            <ChevronDown className="h-5 w-5 ml-auto hidden md:block" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 text-xs font-md text-black dark:text-neutral-400 space-y-[2px]">
          {isModerator && (
            <DropdownMenuItem
              onClick={() => onOpen("invite", { server })}
              className="flex justify-between text-indigo-600 dark:text-indigo-400  px-3 py-2 cursor-pointer"
            >
              Invite People
              <UserPlus2 className="w-6 h-6" />
            </DropdownMenuItem>
          )}
          {isModerator && <DropdownMenuSeparator />}
          {isAdmin && (
            <DropdownMenuItem
              className="flex justify-between dark:text-white px-3 py-2 cursor-pointer"
              onClick={() => onOpen("editServer", { server })}
            >
              Server Settings
              <Settings className="w-6 h-6" />
            </DropdownMenuItem>
          )}
          {isModerator && (
            <DropdownMenuItem
              className="flex justify-between dark:text-white px-3 py-2 cursor-pointer"
              onClick={() => onOpen("users", { server })}
            >
              Manage Users
              <Users className="w-6 h-6" />
            </DropdownMenuItem>
          )}
          {isModerator && (
            <DropdownMenuItem
              className="flex justify-between dark:text-white px-3 py-2 cursor-pointer"
              onClick={() => onOpen("createChannel")}
            >
              Create Channel
              <PlusCircle className="w-6 h-6" />
            </DropdownMenuItem>
          )}
          {isModerator && <DropdownMenuSeparator />}
          {isAdmin && (
            <DropdownMenuItem
              className="flex justify-between text-rose-500 px-3 py-2 cursor-pointer"
              onClick={() => onOpen("deleteServer", { server })}
            >
              Delete Server
              <Trash className="w-6 h-6" />
            </DropdownMenuItem>
          )}
          {!isAdmin && (
            <DropdownMenuItem
              className="flex justify-between text-rose-500  px-3 py-2 cursor-pointer"
              onClick={() => onOpen("leaveServer", { server })}
            >
              Leave Server
              <LogOut className="w-6 h-6" />
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
