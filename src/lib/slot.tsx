import React, { ReactElement, ReactNode } from "react";
import { cn } from "@/lib/utils";

type SlotProps = {
  children?: ReactNode;
  className?: string;
  [key: string]: any;
};

export function Slot({ children, className, ...props }: SlotProps) {
  if (!React.isValidElement(children)) {
    return null;
  }

  const childProps = (children.props as any) || {};

  return React.cloneElement(children as ReactElement<any>, {
    ...props,
    ...childProps,
    className: cn(className, childProps.className),
  });
}
