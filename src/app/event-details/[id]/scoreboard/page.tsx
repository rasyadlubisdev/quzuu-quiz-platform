"use client"

import NavEvent from "@/components/NavEvent"
import { useState, useEffect } from "react"
import { DataTableLeaderboard } from "@/components/table-leaderboard/DataTableLeaderboard"
import {
    leaderboardColumns,
    LeaderboardData,
} from "@/components/table-leaderboard/columns"

const Scoreboard = () => {
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

    return (
        <main className="start-quiz-page container bg-slate-100 text-slate-950 min-h-screen">
            <section className="head-info py-8">
                <h1 className="text-2xl font-bold">
                    Try Out OSNK Informatika 2023
                </h1>
                <h3 className="text-xl font-normal">Event Details</h3>
            </section>
            <section className="pb-10 grid grid-cols-1 md:grid-cols-3 gap-y-8 md:gap-x-8">
                <NavEvent />
                {/* <div className="display-event-overview col-span-2 bg-white p-9 rounded-3xl text-slate-800 shadow">
                    
                </div> */}
                <div className="col-span-2 p-2">
                    <DataTableLeaderboard
                        columns={leaderboardColumns}
                        data={leaderboardData}
                    />
                </div>
            </section>
        </main>
    )
}

export default Scoreboard
