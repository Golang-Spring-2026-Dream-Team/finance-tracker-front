import { ReactNode } from 'react';
import { AppSidebar } from '@/widgets/navigation/AppSidebar';
import { MobileNav } from '@/widgets/navigation/MobileNav';

export const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <MobileNav />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};
