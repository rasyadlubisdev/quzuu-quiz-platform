"use client"

import { useState, useEffect } from "react"
import { DataTableLeaderboard } from "@/components/table-leaderboard/DataTableLeaderboard"
import {
    leaderboardColumns,
    LeaderboardData,
} from "@/components/table-leaderboard/columns"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function LeaderboardPage() {
    const [quiz, setQuiz] = useState("quiz1")
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardData[]>(
        [],
    )

    useEffect(() => {
        fetch("/dummyLeaderboard.json")
            .then((res) => res.json())
            .then((data) => {
                const result = data[quiz] || []
                setLeaderboardData(result)
            })
            .catch((err) =>
                console.error("Error fetching leaderboard data:", err),
            )
    }, [quiz])

    function handleQuizChange(value: string) {
        setQuiz(value)
    }

    return (
        <main className="container">
            <section className="w-full grid grid-cols-1 sm:grid-cols-2 items-center">
                <div className="title-page py-11">
                    <h1 className="text-2xl font-bold">Leaderboard</h1>
                </div>

                <div className="justify-self-start sm:justify-self-end mb-6">
                    <Label className="mb-2 block">Choose Quiz:</Label>
                    <Select value={quiz} onValueChange={handleQuizChange}>
                        <SelectTrigger className="w-[200px] ring-primary">
                            <SelectValue placeholder="Select quiz" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="quiz1">Quiz 1</SelectItem>
                            <SelectItem value="quiz2">Quiz 2</SelectItem>
                            <SelectItem value="quiz3">Quiz 3</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </section>

            <DataTableLeaderboard
                columns={leaderboardColumns}
                data={leaderboardData}
            />
        </main>
    )
}
