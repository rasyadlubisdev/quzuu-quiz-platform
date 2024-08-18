"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Events = {
  id: string
  // status: "pending" | "processing" | "success" | "failed"
  eventTitle: string
  dateTime: string
  participant: number
}

export const columns: ColumnDef<Events>[] = [
  {
    accessorKey: "eventTitle",
    header: "Event Title",
  },
  {
    accessorKey: "dateTime",
    header: "Date Time",
  },
  {
    accessorKey: "participant",
    header: "Joined",
  },
]
