"use client";

import { ColumnDef } from "@tanstack/react-table";

// Define the Invoice type
export type Invoice = {
  invoice_id: number;
  invoice_number: string;
  total_amount: number;
  status: "Pending" | "Paid" | "Overdue";
  due_date: string;
};

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "invoice_number",
    header: "Invoice Number",
  },
  {
    accessorKey: "total_amount",
    header: "Amount",
    cell: ({ getValue }) => `£${getValue()}`, // Formatting amount
  },
  {
    accessorKey: "due_date",
    header: "Due Date",
  },
];
