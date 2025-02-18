import TabNavigation from '@/components/TabNavigation';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <TabNavigation />
    </>
  );
}
