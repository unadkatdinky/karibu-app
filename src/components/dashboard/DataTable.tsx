// Generic table component. Pass columns and rows — it handles the chrome.
// columns: defines headers and how to render each cell
// rows: array of any objects — keys map to column accessors

import type { ReactNode } from 'react';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  // Optional: right-align numbers or actions
  align?: 'left' | 'right' | 'center';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  // Optional: fired when a row is clicked (e.g. open a detail panel)
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

export default function DataTable<T extends object>({
  columns, rows, onRowClick, emptyMessage = 'No data yet.'
}: DataTableProps<T>) {
  const alignClass = { left: 'text-left', right: 'text-right', center: 'text-center' };

  return (
    <div className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-black/5 bg-[#faf8f4]/60">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={`px-5 py-3.5 text-[10px] uppercase tracking-wider font-semibold text-[#888] ${alignClass[col.align ?? 'left']}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.04]">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-10 text-center text-[#888] text-[13px]">
                  {emptyMessage}
                </td>
              </tr>
            ) : rows.map((row, ri) => (
              <tr
                key={ri}
                onClick={() => onRowClick?.(row)}
                className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-[#faf8f4]/60' : ''}`}
              >
                {columns.map((col, ci) => {
                  const cell = typeof col.accessor === 'function'
                    ? col.accessor(row)
                    : (row[col.accessor] as ReactNode);
                  return (
                    <td key={ci} className={`px-5 py-4 text-[#1C3A2E] ${alignClass[col.align ?? 'left']}`}>
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}