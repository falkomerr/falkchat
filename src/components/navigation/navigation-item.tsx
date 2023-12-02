"use client";

import { cn } from "@/utils/utils";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ActionTooltip } from "../action-tooltip";

interface props {
  id: string;
  imageUrl: string;
  name: string;
}

export const NavigationItem = ({ id, name, imageUrl }: props) => {
  const params = useParams();
  const router = useRouter();

  const onClick = () => {
    router.push(`/servers/${id}`);
  };

  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button
        onClick={onClick}
        className="group relative flex items-center outline-none"
      >
        <div
          className={cn(
            "absolute left-0 bg-primary rounder-r-full transition-all w-[4px] rounded-r-md",
            params?.serverId !== id && "group-hover:h-[20px]",
            params?.serverId === id ? "h-[34px]" : "h-[8px]"
          )}
        />
        <div
          className={cn(
            "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
            params?.server === id && "bg-primary/10 text-primary rounded-[16px]"
          )}
        >
          <Image
            fill
            src={imageUrl}
            placeholder="blur"
            alt="Channel"
            blurDataURL={imageUrl}
            sizes="48px"
            priority
          />
        </div>
      </button>
    </ActionTooltip>
  );
};
