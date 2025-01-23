"use client"

import React, { useState } from "react"

type Option = {
    id: number
    order: string
    label: string
}

type RadioAnswerProps = {
    options: Option[]
    selectedOption?: number | null
    correctOption?: number
    isReviewMode?: boolean
    onSelectOption?: (optionId: number) => void
}

const RadioAnswer: React.FC<RadioAnswerProps> = ({
    options,
    selectedOption,
    correctOption,
    isReviewMode = false,
    onSelectOption,
}) => {
    const [localSelected, setLocalSelected] = useState<number | null>(
        selectedOption ?? null,
    )

    const handleSelect = (optionId: number) => {
        if (!isReviewMode && onSelectOption) {
            setLocalSelected(optionId)
            onSelectOption(optionId)
        }
    }

    return (
        <div className="space-y-3">
            {options.map((option) => {
                let isSelected = localSelected === option.id
                let isCorrect = correctOption === option.id

                let containerStyle = "bg-white border-slate-300"
                if (isSelected)
                    containerStyle = "bg-violet-100 border-violet-300"

                if (isReviewMode && isSelected) {
                    containerStyle = isCorrect
                        ? "bg-green-100 border-green-300"
                        : "bg-red-100 border-red-300"
                }

                return (
                    <label
                        key={option.id}
                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${containerStyle}`}
                        onClick={() => handleSelect(option.id)}
                    >
                        <span
                            className={`flex items-center justify-center h-6 w-6 rounded-full border-2 transition-all duration-200 
                ${
                    isSelected
                        ? "border-secondary bg-secondary text-white"
                        : "border-slate-300"
                }
              `}
                        >
                            <span
                                className={`text-sm font-semibold ${
                                    isSelected ? "text-white" : "text-slate-300"
                                }`}
                            >
                                {option.order}
                            </span>
                        </span>

                        <span className="ml-3 text-slate-700">
                            {option.label}
                        </span>
                    </label>
                )
            })}
        </div>
    )
}

export default RadioAnswer
