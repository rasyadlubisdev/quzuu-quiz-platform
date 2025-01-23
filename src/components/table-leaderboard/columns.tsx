"use client"

import { ColumnDef } from "@tanstack/react-table"

export type LeaderboardData = {
    rank: number
    username: string
    score: number
    duration: number
}

export const leaderboardColumns: ColumnDef<LeaderboardData>[] = [
    {
        accessorKey: "rank",
        header: "Rank",
    },
    {
        accessorKey: "username",
        header: "Username",
    },
    {
        accessorKey: "score",
        header: "Score",
    },
    {
        accessorKey: "duration",
        header: "Duration (min)",
        cell: ({ row }) => {
            const raw = row.getValue("duration") as number
            return raw.toFixed(3)
        },
    },
]
