"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Client = {
  id: number;
  name: string;
  email: string;
};

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];
