"use client"

import React, { useState, useEffect } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

interface ClickChipAnswerProps {
    correctAnswer?: string[]
    userSelected?: string[]
    isReviewMode?: boolean
    onChange?: (newSelected: string[]) => void
}

interface ChipOption {
    id: string
    content: string
    color: string
}

const chipOptions: ChipOption[] = [
    { id: "1", content: "int", color: "bg-blue-400" },
    { id: "2", content: "= 2000;", color: "bg-orange-500" },
    { id: "3", content: "+ 1000", color: "bg-green-400" }
]

const ClickChipAnswer: React.FC<ClickChipAnswerProps> = ({
    correctAnswer = [],
    userSelected = [],
    isReviewMode = false,
    onChange,
}) => {
    const [selectedChips, setSelectedChips] = useState<string[]>(userSelected)
    const [selectedChipIds, setSelectedChipIds] = useState<string[]>([])

    useEffect(() => {
        setSelectedChips(userSelected)
        // Map userSelected back to chip IDs for UI consistency
        const chipIds = userSelected.map(selected => {
            const chip = chipOptions.find(option => option.content === selected)
            return chip ? chip.id : ""
        }).filter(id => id !== "")
        setSelectedChipIds(chipIds)
    }, [userSelected])

    const handleSelectChip = (chipId: string) => {
        if (isReviewMode) return

        const chip = chipOptions.find(option => option.id === chipId)
        if (!chip) return

        // Prevent selecting the same chip twice
        if (selectedChipIds.includes(chipId)) return

        const updatedIds = [...selectedChipIds, chipId]
        const updatedChips = [...selectedChips, chip.content]
        
        setSelectedChipIds(updatedIds)
        setSelectedChips(updatedChips)
        onChange?.(updatedChips)
    }

    const handleReset = () => {
        if (isReviewMode) return

        setSelectedChips([])
        setSelectedChipIds([])
        onChange?.([])
    }

    const getInputColor = (index: number) => {
        if (isReviewMode) {
            // Review mode: green if correct, red if wrong
            return selectedChips[index] === correctAnswer[index]
                ? "bg-green-400"
                : "bg-red-400"
        }

        // Normal mode: use chip's original color if selected
        if (selectedChips[index]) {
            const chip = chipOptions.find(option => option.content === selectedChips[index])
            return chip ? chip.color : "bg-slate-600"
        }

        return "bg-slate-600"
    }

    const getInputWidth = (index: number) => {
        const content = selectedChips[index] || ""
        if (content.length === 0) {
            return index === 0 ? "min-w-9" : "min-w-16"
        }
        return `min-w-9`
    }

    const getInputStyle = (index: number) => {
        const content = selectedChips[index] || ""
        const width = content.length > 0 ? `${content.length + 1}ch` : undefined
        return width ? { width } : {}
    }

    return (
        <div className="flex flex-col">
            <div className="code-display py-8 px-6 bg-slate-950 text-white rounded-md whitespace-pre-wrap">
                <code>
                    <span className="text-blue-400">int</span> apel ={" "}
                    <span className="text-orange-500">5000</span>;
                </code>
                <br />
                <code>
                    <Input
                        disabled
                        value={selectedChips[0] || ""}
                        style={getInputStyle(0)}
                        className={`w-8 focus-visible:ring-offset-0 disabled:opacity-100 disabled:cursor-default ${getInputColor(0)} text-slate-950 ${getInputWidth(0)} h-6 inline p-0 leading-3 focus:ring-transparent text-base border-0`}
                    />{" "}
                    jeruk = <span className="text-orange-500">2000</span>;
                </code>
                <br />
                <code>
                    <span className="text-blue-400">int</span> anggur{" "}
                    <Input
                        disabled
                        value={selectedChips[1] || ""}
                        style={getInputStyle(1)}
                        className={`w-8 focus-visible:ring-offset-0 disabled:opacity-100 disabled:cursor-default ${getInputColor(1)} text-slate-950 ${getInputWidth(1)} h-6 inline p-0 leading-3 focus:ring-transparent focus:outline-none text-base border-0`}
                    />
                    ;
                </code>
                <br />
                <code>total = apel + jeruk + anggur;</code>
            </div>

            {!isReviewMode && (
                <div className="flex justify-between items-center mt-5">
                    <div className="flex gap-x-2.5">
                        {chipOptions.map((chip) => (
                            <div
                                key={chip.id}
                                className={`${chip.color} ${
                                    selectedChipIds.includes(chip.id)
                                        ? "invisible"
                                        : "visible"
                                } text-slate-950 py-1 px-2 rounded-md cursor-pointer hover:opacity-80 transition-opacity`}
                                onClick={() => handleSelectChip(chip.id)}
                            >
                                <code>{chip.content}</code>
                            </div>
                        ))}
                    </div>
                    <Button variant="ghost" onClick={handleReset}>
                        Reset
                    </Button>
                </div>
            )}

            {isReviewMode && (
                <div className="mt-3 text-sm">
                    {JSON.stringify(selectedChips) ===
                    JSON.stringify(correctAnswer) ? (
                        <span className="text-green-600">
                            Semua potongan kode benar!
                        </span>
                    ) : (
                        <span className="text-red-600">
                            Ada potongan kode yang salah. Seharusnya:{" "}
                            {JSON.stringify(correctAnswer)}
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}

export default ClickChipAnswer