import React from "react";

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

export function MDXTable({ className, children, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="my-6 overflow-x-auto rounded-md border border-black/10">
      <table className={cx("w-full border-collapse text-sm rounded-md", className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function Th({ className, children, ...props }: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) {
  return (
    <th
      className={cx(
        "border-b border-black/10 bg-black/5 px-3 py-2 text-left font-medium text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export function Td({ className, children, ...props }: React.TdHTMLAttributes<HTMLTableDataCellElement>) {
  return (
    <td className={cx("border-b border-black/10 px-3 py-2 text-foreground/80 align-top", className)} {...props}>
      {children}
    </td>
  );
}

export default MDXTable;
