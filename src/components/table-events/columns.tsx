"use client"

import { ColumnDef } from "@tanstack/react-table"

export type Events = {
    id_event: string
    title: string
    // participant: number
    start_event: string
    end_event: string
}

export const columns: ColumnDef<Events>[] = [
    {
        accessorKey: "title",
        header: "Event Title",
    },
    {
        accessorKey: "start_event",
        header: "Start Date",
    },
    {
        accessorKey: "end_event",
        header: "End Date",
    },

    // {
    //     accessorKey: "participant",
    //     header: "Joined",
    // },
]
