import React from "react";

export default function OrSeparator(): React.JSX.Element {
  return (
    <div className="flex items-center gap-4 my-4 px-6">
      <div className="flex-1 h-px bg-accent" />
      <span className="text-accent-foreground text-sm">OR</span>
      <div className="flex-1 h-px bg-accent" />
    </div>
  );
}
