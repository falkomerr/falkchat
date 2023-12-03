import { ServerSidebar } from '@/widgets/server-sidebar';
import { Button } from '@/shared/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/shared/ui/sheet';
import { NavigationSidebar } from '@/widgets/navigation-sidebar';
import { Menu } from 'lucide-react';

interface props {
    serverId: string;
}

export const BurgerMenu = ({ serverId }: props) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 flex gap-0">
                <div className="w-[72px]">
                    <NavigationSidebar />
                </div>
                <ServerSidebar serverId={serverId} />
            </SheetContent>
        </Sheet>
    );
};
