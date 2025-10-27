import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, MoreHorizontal } from "lucide-react";

interface ResponsiveTableColumn {
  key: string;
  label: string;
  className?: string;
  render?: (value: any, row: any) => ReactNode;
  hideOnMobile?: boolean;
}

interface ResponsiveTableProps {
  data: any[];
  columns: ResponsiveTableColumn[];
  keyField: string;
  actions?: (row: any) => ReactNode;
  emptyMessage?: string;
  className?: string;
}

interface MobileCardProps {
  data: any;
  columns: ResponsiveTableColumn[];
  actions?: (row: any) => ReactNode;
  onClick?: () => void;
}

const MobileCard = ({ data, columns, actions, onClick }: MobileCardProps) => {
  const visibleColumns = columns.filter(col => !col.hideOnMobile);

  return (
    <Card className="mb-3 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {/* Card Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="font-medium text-sm text-foreground">
            {visibleColumns[0]?.render ? visibleColumns[0].render(data[visibleColumns[0].key], data) : data[visibleColumns[0]?.key]}
          </div>
          {actions && (
            <div className="flex items-center gap-1">
              {actions}
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="space-y-2">
          {visibleColumns.slice(1).map((column) => {
            const value = data[column.key];
            const renderedValue = column.render ? column.render(value, data) : value;

            return (
              <div key={column.key} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium min-w-0 flex-shrink-0">
                  {column.label}
                </span>
                <div className={`text-xs text-right min-w-0 flex-1 ${column.className || ''}`}>
                  {renderedValue}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export const ResponsiveTable = ({
  data,
  columns,
  keyField,
  actions,
  emptyMessage = "Tidak ada data yang tersedia",
  className = "",
}: ResponsiveTableProps) => {
  // Mobile View - Card Layout
  const MobileView = () => {
    if (data.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <div className="text-lg font-medium">{emptyMessage}</div>
        </div>
      );
    }

    return (
      <div className="md:hidden">
        {data.map((row) => (
          <MobileCard
            key={row[keyField]}
            data={row}
            columns={columns}
            actions={actions?.(row)}
          />
        ))}
      </div>
    );
  };

  // Desktop View - Table Layout
  const DesktopView = () => {
    if (data.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground hidden md:block">
          <div className="text-lg font-medium">{emptyMessage}</div>
        </div>
      );
    }

    return (
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`text-left font-semibold text-gray-700 p-3 ${column.className || ''}`}
                >
                  {column.label}
                </th>
              ))}
              {actions && <th className="text-right font-semibold text-gray-700 p-3">Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row[keyField]} className="border-b hover:bg-gray-50">
                {columns.map((column) => {
                  const value = row[column.key];
                  const renderedValue = column.render ? column.render(value, row) : value;

                  return (
                    <td
                      key={column.key}
                      className={`p-3 ${column.className || ''}`}
                    >
                      {renderedValue}
                    </td>
                  );
                })}
                {actions && (
                  <td className="p-3 text-right">
                    {actions(row)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <MobileView />
      <DesktopView />
    </div>
  );
};