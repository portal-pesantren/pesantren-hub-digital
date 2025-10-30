import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { STANDARD_TABLE_HEADERS } from "./table-header";

interface ResponsiveTableProps {
  headers: Array<{ key: string; label: string; sortable?: boolean }>;
  data: Record<string, React.ReactNode>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  pagination?: boolean;
  itemsPerPage?: number;
  onSearch?: (query: string) => void;
  onSort?: (key: string) => void;
  emptyMessage?: string;
  className?: string;
}

export const ResponsiveTable = ({
  headers,
  data,
  searchable = true,
  searchPlaceholder = "Cari...",
  pagination = true,
  itemsPerPage = 10,
  onSearch,
  onSort,
  emptyMessage = "Tidak ada data yang tersedia",
  className = ""
}: ResponsiveTableProps) => {
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

  // Filter data based on search
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

  // Mobile view - Card layout
  const MobileView = () => (
    <div className="space-y-3 sm:hidden">
      {paginatedData.map((row, index) => (
        <Card key={index} className="p-4">
          <div className="space-y-3">
            {headers.map((header) => (
              header.key !== 'actions' && (
                <div key={header.key} className="flex justify-between items-start">
                  <span className="text-sm font-medium text-muted-foreground min-w-0 flex-shrink-0">
                    {header.label}:
                  </span>
                  <span className="text-sm text-right min-w-0 flex-1 ml-2">
                    {row[header.key]}
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
            {headers.map((header) => (
              <th
                key={header.key}
                className={`
                  px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider
                  ${header.sortable ? 'cursor-pointer hover:bg-muted/50' : ''}
                `}
                onClick={() => header.sortable && handleSort(header.key)}
              >
                <div className="flex items-center gap-2">
                  {header.label}
                  {header.sortable && (
                    <span className="text-xs">
                      {sortConfig?.key === header.key ? (
                        sortConfig.direction === 'asc' ? '↑' : '↓'
                      ) : (
                        <span className="text-muted-foreground">↕</span>
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {paginatedData.map((row, index) => (
            <tr key={index} className="hover:bg-muted/25 transition-colors">
              {headers.map((header) => (
                <td key={header.key} className="px-4 py-3 text-sm">
                  {row[header.key]}
                </td>
              ))}
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
      {paginatedData.length === 0 ? (
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