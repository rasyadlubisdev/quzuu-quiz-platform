"use client"

import React, { useState, useEffect } from "react"
import { Input } from "./ui/input"

type CodeShortAnswerProps = {
    correctAnswer?: string[]
    userSelected?: string[]
    isReviewMode?: boolean
    onChange?: (value: string[]) => void
}

const CodeShortAnswer: React.FC<CodeShortAnswerProps> = ({
    correctAnswer = [],
    userSelected = [],
    isReviewMode = false,
    onChange,
}) => {
    const [answers, setAnswers] = useState<string[]>(userSelected)

    useEffect(() => {
        setAnswers(userSelected)
    }, [userSelected])

    const handleChange = (value: string, idx: number) => {
        if (isReviewMode) return
        const updated = [...answers]
        updated[idx] = value
        setAnswers(updated)
        onChange?.(updated)
    }

    const getInputStyle = (idx: number) => {
        if (!isReviewMode) return "bg-blue-400"
        const isCorrect = correctAnswer[idx] === answers[idx]
        return isCorrect ? "bg-green-400" : "bg-red-400"
    }

    return (
        <div className="code-display py-8 px-6 bg-slate-950 text-white rounded-md whitespace-pre-wrap">
            <code>
                <span className="text-blue-400">int</span> apel ={" "}
                <span className="text-orange-500">5000</span>;
            </code>
            <br />
            <code>
                <Input
                    disabled={isReviewMode}
                    value={answers[0] || ""}
                    onChange={(e) => handleChange(e.target.value, 0)}
                    className={`${getInputStyle(
                        0,
                    )} text-slate-950 w-16 h-6 inline p-0 leading-3 text-base`}
                />{" "}
                jeruk = <span className="text-orange-500">2000</span>;
            </code>
            <br />
            <code>
                <span className="text-blue-400">int</span> anggur{" "}
                <Input
                    disabled={isReviewMode}
                    value={answers[1] || ""}
                    onChange={(e) => handleChange(e.target.value, 1)}
                    className={`${getInputStyle(
                        1,
                    )} text-slate-950 w-16 h-6 inline p-0 leading-3 text-base`}
                />
                ;
            </code>
            <br />
            <code>total_harga = apel + jeruk + anggur;</code>

            {isReviewMode && (
                <div className="mt-3 text-sm">
                    <span>Jawaban Anda: {JSON.stringify(answers)}</span>
                    <br />
                    <span>Jawaban Benar: {JSON.stringify(correctAnswer)}</span>
                </div>
            )}
        </div>
    )
}

export default CodeShortAnswer
