import * as React from "react";

export const Badge = ({ variant, children }: { variant: string; children?: React.ReactNode }) => {
  return <div className={`badge badge-${variant}`}>{children}</div>;
};