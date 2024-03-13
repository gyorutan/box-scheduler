const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="h-full min-w-[375px] max-w-[768px] m-auto">
        <main className="h-full">{children}</main>
      </div>
    </>
  );
};

export default Layout;
