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
        if (!isReviewMode) {
            // Warna placeholder default sesuai dengan konteks semantik
            if (idx === 0) return "bg-blue-400" // untuk tipe data (int)
            if (idx === 1) return "bg-orange-500" // untuk nilai/assignment
            return "bg-blue-400" // default
        }
        
        // Untuk review mode, gunakan warna berdasarkan benar/salah
        const isCorrect = correctAnswer[idx] === answers[idx]
        return isCorrect ? "bg-green-400" : "bg-red-400"
    }

    const getInputWidth = (idx: number) => {
        // Sesuaikan lebar berdasarkan konteks jawaban yang diharapkan
        if (idx === 0) return "w-9"  // untuk "int" (3 karakter)
        if (idx === 1) return "w-16" // untuk "= 3000" (6 karakter)
        return "w-16" // default
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
                    className={`${getInputStyle(0)} text-slate-950 ${getInputWidth(0)} h-6 inline p-0 leading-3 focus:ring-transparent text-base border-0`}
                    placeholder=""
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
                    className={`${getInputStyle(1)} text-slate-950 ${getInputWidth(1)} h-6 inline p-0 leading-3 focus:ring-transparent text-base border-0`}
                    placeholder=""
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