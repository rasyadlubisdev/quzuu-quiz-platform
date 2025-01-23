"use client"

import { ColumnDef } from "@tanstack/react-table"

export type Events = {
    id: string
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
