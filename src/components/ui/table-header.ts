// Standard table headers for consistent table structure across the application

export const STANDARD_TABLE_HEADERS = {
  VERIFICATION: [
    { key: 'id', label: 'ID', sortable: false },
    { key: 'pondok', label: 'Nama Pondok', sortable: true },
    { key: 'city', label: 'Kota', sortable: true },
    { key: 'documents', label: 'Dokumen', sortable: false },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'date', label: 'Tanggal', sortable: true },
    { key: 'actions', label: 'Aksi', sortable: false }
  ],

  PONDOK: [
    { key: 'id', label: 'ID', sortable: false },
    { key: 'name', label: 'Nama Pondok', sortable: true },
    { key: 'location', label: 'Lokasi', sortable: true },
    { key: 'students', label: 'Jumlah Santri', sortable: true },
    { key: 'status', label: 'Status', sortable: true }
  ],

  MANAGE_PONDOK: [
    { key: 'no', label: 'No', sortable: false },
    { key: 'name', label: 'Nama Pondok', sortable: true },
    { key: 'location', label: 'Lokasi', sortable: true },
    { key: 'founded', label: 'Berdiri', sortable: true },
    { key: 'students', label: 'Santri', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'activity', label: 'Aktivitas', sortable: false },
    { key: 'actions', label: 'Aksi', sortable: false }
  ],

  PEOPLE: [
    { key: 'no', label: 'No', sortable: false },
    { key: 'name', label: 'Nama', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'contact', label: 'Kontak', sortable: false },
    { key: 'joinDate', label: 'Tanggal Bergabung', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'actions', label: 'Aksi', sortable: false }
  ],

  EVENTS: [
    { key: 'no', label: 'No', sortable: false },
    { key: 'title', label: 'Judul', sortable: true },
    { key: 'date', label: 'Tanggal', sortable: true },
    { key: 'category', label: 'Kategori', sortable: true },
    { key: 'participants', label: 'Peserta', sortable: false },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'actions', label: 'Aksi', sortable: false }
  ],

  NEWS: [
    { key: 'no', label: 'No', sortable: false },
    { key: 'title', label: 'Judul', sortable: true },
    { key: 'author', label: 'Author', sortable: true },
    { key: 'date', label: 'Tanggal', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'views', label: 'Views', sortable: false },
    { key: 'actions', label: 'Aksi', sortable: false }
  ]
};

export type TableHeaderType = keyof typeof STANDARD_TABLE_HEADERS;