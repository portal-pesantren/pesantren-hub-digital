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
    <Card className="mb-4 hover:shadow-lg transition-all duration-200 border border-border/50 touch-target">
      <CardContent className="p-4 sm:p-6">
        {/* Card Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-responsive-base text-foreground line-clamp-2 mb-1">
              {visibleColumns[0]?.render ? visibleColumns[0].render(data[visibleColumns[0].key], data) : data[visibleColumns[0]?.key]}
            </h3>
          </div>
          {actions && (
            <div className="flex items-center gap-2 ml-3 flex-shrink-0">
              {actions}
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="space-y-3">
          {visibleColumns.slice(1).map((column) => {
            const value = data[column.key];
            const renderedValue = column.render ? column.render(value, data) : value;

            return (
              <div key={column.key} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                <span className="text-responsive-xs text-muted-foreground font-medium min-w-0 flex-shrink-0">
                  {column.label}
                </span>
                <div className={`text-responsive-sm text-right min-w-0 flex-1 ${column.className || ''}`}>
                  {renderedValue}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Action Button */}
        {onClick && (
          <div className="mt-4 pt-3 border-t border-border/50">
            <Button
              variant="outline"
              size="sm"
              onClick={onClick}
              className="w-full touch-target"
            >
              <ChevronRight className="w-4 h-4 mr-2" />
              Lihat Detail
            </Button>
          </div>
        )}
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
          <div className="text-responsive-lg font-medium">{emptyMessage}</div>
        </div>
      );
    }

    return (
      <div className="hidden md:block">
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/30">
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        className={`px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider ${column.className || ''}`}
                      >
                        {column.label}
                      </th>
                    ))}
                    {actions && <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {data.map((row, index) => (
                    <tr key={row[keyField]} className={`hover:bg-muted/25 transition-colors ${index % 2 === 0 ? 'bg-background' : 'bg-muted/10'}`}>
                      {columns.map((column) => {
                        const value = row[column.key];
                        const renderedValue = column.render ? column.render(value, row) : value;

                        return (
                          <td
                            key={column.key}
                            className={`px-4 py-3 whitespace-nowrap text-sm ${column.className || ''}`}
                          >
                            {renderedValue}
                          </td>
                        );
                      })}
                      {actions && (
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          {actions(row)}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
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