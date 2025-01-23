"use client"

import React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "./ui/button"
import Countdown from "./Countdown"

type NavQuizProps = {
    totalQuestions: number
    basePath: string
    isReviewMode?: boolean
    onSubmitAnswers?: () => void
}

const NavQuiz: React.FC<NavQuizProps> = ({
    totalQuestions,
    basePath,
    isReviewMode = false,
    onSubmitAnswers,
}) => {
    const searchParams = useSearchParams()
    const pageNumber = searchParams.get("num")
    const activePage = pageNumber ? parseInt(pageNumber, 10) : 1

    return (
        <div className="bg-white pt-4 pb-6 px-6 rounded-3xl text-slate-800 shadow">
            <div className="timer px-6">
                <h3 className="text-base font-bold text-secondary mb-1">
                    Time Left
                </h3>
                <div className="run-timer py-3 px-5 rounded-2xl border border-secondary">
                    <Countdown />
                </div>
            </div>

            <div className="questions-number mt-5 flex flex-wrap justify-center">
                {Array.from({ length: totalQuestions }, (_, i) => i + 1).map(
                    (num) => {
                        const isActive = activePage === num
                        return (
                            <Link
                                key={num}
                                href={`${basePath}?num=${num}`}
                                className={`flex justify-center items-center rounded-md border-2
                ${
                    isActive
                        ? "border-secondary text-white bg-secondary"
                        : "border-slate-400 text-slate-400"
                }
                text-xl font-bold m-1.5
              `}
                                style={{ width: "54px", height: "47px" }}
                            >
                                {num.toString().padStart(2, "0")}
                            </Link>
                        )
                    },
                )}
            </div>

            <div className="buttons mt-4 flex flex-col">
                <Button variant="outline" className="mb-4">
                    Clarification
                </Button>
                {!isReviewMode && (
                    <Button onClick={onSubmitAnswers}>Submit Answers</Button>
                )}
            </div>
        </div>
    )
}

export default NavQuiz
