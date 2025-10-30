import React from 'react';
import { cn } from '@/lib/utils';

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return (
    <thead className={cn(
      "bg-muted/30 border-b border-border/50",
      className
    )}>
      <tr className="divide-x divide-border/30">
        {children}
      </tr>
    </thead>
  );
};

interface TableHeaderCellProps {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  onClick?: () => void;
}

export const TableHeaderCell: React.FC<TableHeaderCellProps> = ({
  children,
  className,
  align = "left",
  sortable = false,
  onClick
}) => {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  };

  return (
    <th
      className={cn(
        // Base styles
        "px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider",
        // Alignment
        alignClasses[align],
        // Responsive
        "px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-xs",
        // Hover for sortable
        sortable && "hover:bg-muted/50 cursor-pointer transition-colors",
        className
      )}
      onClick={onClick}
    >
      {children}
    </th>
  );
};

interface TableActionsHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

export const TableActionsHeader: React.FC<TableActionsHeaderProps> = ({
  children = "Aksi",
  className
}) => {
  return (
    <TableHeaderCell
      align="center"
      className={cn("w-24 sm:w-32", className)}
    >
      {children}
    </TableHeaderCell>
  );
};

// Standard table header configurations for different table types
export const STANDARD_TABLE_HEADERS = {
  // People tables (Santri, Ustadz)
  PEOPLE: [
    { key: 'name', label: 'Nama', align: 'left' as const, hideOnMobile: false },
    { key: 'class', label: 'Kelas/Mata Pelajaran', align: 'left' as const, hideOnMobile: false },
    { key: 'status', label: 'Status', align: 'center' as const, hideOnMobile: false },
    { key: 'contact', label: 'Kontak', align: 'left' as const, hideOnMobile: true },
    { key: 'address', label: 'Alamat', align: 'left' as const, hideOnMobile: true },
    { key: 'actions', label: 'Aksi', align: 'center' as const, hideOnMobile: false }
  ],

  // Pondok tables
  PONDOK: [
    { key: 'name', label: 'Nama Pondok', align: 'left' as const, hideOnMobile: false },
    { key: 'location', label: 'Lokasi', align: 'left' as const, hideOnMobile: true },
    { key: 'students', label: 'Santri', align: 'center' as const, hideOnMobile: false },
    { key: 'status', label: 'Status', align: 'center' as const, hideOnMobile: false },
    { key: 'established', label: 'Berdiri', align: 'center' as const, hideOnMobile: true },
    { key: 'actions', label: 'Aksi', align: 'center' as const, hideOnMobile: false }
  ],

  // Moderation tables
  MODERATION: [
    { key: 'id', label: 'ID', align: 'center' as const, hideOnMobile: false },
    { key: 'type', label: 'Jenis Konten', align: 'left' as const, hideOnMobile: false },
    { key: 'title', label: 'Judul', align: 'left' as const, hideOnMobile: false },
    { key: 'pondok', label: 'Pondok', align: 'left' as const, hideOnMobile: false },
    { key: 'reason', label: 'Alasan', align: 'left' as const, hideOnMobile: true },
    { key: 'status', label: 'Status', align: 'center' as const, hideOnMobile: false },
    { key: 'priority', label: 'Prioritas', align: 'center' as const, hideOnMobile: true },
    { key: 'date', label: 'Tanggal', align: 'center' as const, hideOnMobile: true },
    { key: 'actions', label: 'Aksi', align: 'center' as const, hideOnMobile: false }
  ],

  // Activity logs tables
  ACTIVITY: [
    { key: 'time', label: 'Waktu', align: 'left' as const, hideOnMobile: false },
    { key: 'pondok', label: 'Pondok', align: 'left' as const, hideOnMobile: false },
    { key: 'admin', label: 'Admin', align: 'left' as const, hideOnMobile: false },
    { key: 'action', label: 'Aksi', align: 'left' as const, hideOnMobile: false },
    { key: 'category', label: 'Kategori', align: 'center' as const, hideOnMobile: true }
  ],

  // Verification tables
  VERIFICATION: [
    { key: 'id', label: 'ID', align: 'center' as const, hideOnMobile: false },
    { key: 'pondok', label: 'Pondok', align: 'left' as const, hideOnMobile: false },
    { key: 'city', label: 'Kota', align: 'left' as const, hideOnMobile: true },
    { key: 'documents', label: 'Dokumen', align: 'center' as const, hideOnMobile: false },
    { key: 'status', label: 'Status', align: 'center' as const, hideOnMobile: false },
    { key: 'date', label: 'Tanggal', align: 'center' as const, hideOnMobile: true },
    { key: 'actions', label: 'Aksi', align: 'center' as const, hideOnMobile: false }
  ],

  // Backup tables
  BACKUP: [
    { key: 'id', label: 'ID', align: 'center' as const, hideOnMobile: false },
    { key: 'created', label: 'Dibuat', align: 'left' as const, hideOnMobile: false },
    { key: 'size', label: 'Ukuran', align: 'center' as const, hideOnMobile: false },
    { key: 'type', label: 'Jenis', align: 'center' as const, hideOnMobile: false },
    { key: 'actions', label: 'Aksi', align: 'center' as const, hideOnMobile: false }
  ]
};

export type StandardTableHeaderType = keyof typeof STANDARD_TABLE_HEADERS;