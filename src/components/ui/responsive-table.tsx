import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { STANDARD_TABLE_HEADERS } from "./table-header";

interface ResponsiveTableProps {
  headers?: Array<{ key: string; label: string; sortable?: boolean }>;
  columns?: Array<{
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
    hideOnMobile?: boolean;
    sortable?: boolean;
  }>;
  data: Record<string, React.ReactNode>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  pagination?: boolean;
  itemsPerPage?: number;
  onSearch?: (query: string) => void;
  onSort?: (key: string) => void;
  emptyMessage?: string;
  className?: string;
  keyField?: string;
  actions?: (row: any) => React.ReactNode;
}

export const ResponsiveTable = ({
  headers,
  columns,
  data,
  searchable = true,
  searchPlaceholder = "Cari...",
  pagination = true,
  itemsPerPage = 10,
  onSearch,
  onSort,
  emptyMessage = "Tidak ada data yang tersedia",
  className = "",
  keyField = "id",
  actions
}: ResponsiveTableProps) => {

  // Use columns if provided, otherwise use headers
  const tableColumns = columns || headers || [];

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    onSearch?.(query);
  };

  // Handle sorting
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    onSort?.(key);
  };

  // Filter data based on search - use original data for filtering
  const filteredData = data.filter(row => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return Object.values(row).some(value =>
      value && value.toString().toLowerCase().includes(query)
    );
  });

  // Sort data
  const sortedData = filteredData.sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;

    const aValue = a[key]?.toString() || '';
    const bValue = b[key]?.toString() || '';

    if (direction === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = pagination
    ? sortedData.slice(startIndex, startIndex + itemsPerPage)
    : sortedData;

  // Transform paginated data for display
  const displayData = paginatedData.map(row => {
    const transformedRow = { ...row };

    // Apply render functions from columns
    tableColumns.forEach(column => {
      if (column.render) {
        transformedRow[column.key] = column.render(row[column.key], row);
      }
    });

    // Add actions if provided
    if (actions) {
      transformedRow.actions = actions(row);
    }

    return transformedRow;
  });

  // Mobile view - Card layout
  const MobileView = () => (
    <div className="space-y-3 sm:hidden">
      {displayData.map((row, index) => (
        <Card key={row[keyField] || index} className="p-4">
          <div className="space-y-3">
            {tableColumns.map((column) => (
              column.key !== 'actions' && (
                <div key={column.key} className="flex justify-between items-start">
                  <span className="text-sm font-medium text-muted-foreground min-w-0 flex-shrink-0">
                    {column.label}:
                  </span>
                  <span className="text-sm text-right min-w-0 flex-1 ml-2">
                    {row[column.key]}
                  </span>
                </div>
              )
            ))}
            {row.actions && (
              <div className="flex justify-end pt-2 border-t">
                {row.actions}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );

  // Desktop view - Table layout
  const DesktopView = () => (
    <div className="hidden sm:block overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            {tableColumns.map((column) => (
              <th
                key={column.key}
                className={`
                  px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider
                  ${(column.sortable !== false) ? 'cursor-pointer hover:bg-muted/50' : ''}
                `}
                onClick={() => (column.sortable !== false) && handleSort(column.key)}
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  {(column.sortable !== false) && (
                    <span className="text-xs">
                      {sortConfig?.key === column.key ? (
                        sortConfig.direction === 'asc' ? '↑' : '↓'
                      ) : (
                        <span className="text-muted-foreground">↕</span>
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
            {actions && (
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Aksi
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y">
          {displayData.map((row, index) => (
            <tr key={row[keyField] || index} className="hover:bg-muted/25 transition-colors">
              {tableColumns.map((column) => (
                <td key={column.key} className="px-4 py-3 text-sm">
                  {row[column.key]}
                </td>
              ))}
              {actions && (
                <td className="px-4 py-3 text-sm">
                  {row.actions}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Pagination controls
  const Pagination = () => {
    if (!pagination || totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/25">
        <div className="text-sm text-muted-foreground">
          Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedData.length)} dari {sortedData.length} data
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="text-sm text-muted-foreground">
            Halaman {currentPage} dari {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      {searchable && (
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      )}

      {/* Table Content */}
      {displayData.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {emptyMessage}
        </div>
      ) : (
        <>
          <MobileView />
          <DesktopView />
        </>
      )}

      {/* Pagination */}
      <Pagination />
    </div>
  );
};