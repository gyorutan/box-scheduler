import React from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-w-[375px] max-w-[768px] m-auto">{children}</div>
  );
};

export default MainLayout;
