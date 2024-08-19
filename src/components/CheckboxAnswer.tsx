"use client"

import React, { useState } from 'react'

type Option = {
    id: number
    order: string
    label: string
}

type CheckboxAnswerProps = {
    options: Option[]
}

const CheckboxAnswer: React.FC<CheckboxAnswerProps> = ({ options }) => {
    const [selectedOptions, setSelectedOptions] = useState<number[]>([])
    const handleSelect = (optionId: number) => {
        if (selectedOptions.includes(optionId)) {
            setSelectedOptions(selectedOptions.filter(id => id !== optionId))
        } else {
            setSelectedOptions([...selectedOptions, optionId])
        }
    }

    return (
        <div className="space-y-3">
            {options.map((option) => (
                <label
                    key={option.id}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors duration-200 
                    ${selectedOptions.includes(option.id) ? 'bg-violet-100 border-violet-300' : 'bg-white border-slate-300'}`}
                    onClick={() => handleSelect(option.id)}
                >
                    <span
                        className={`flex items-center justify-center h-6 w-6 rounded-full border-2 transition-all duration-200 
                        ${selectedOptions.includes(option.id) ? 'border-secondary bg-secondary text-white' : 'border-slate-300'}`}
                    >
                        <span className={`text-sm font-semibold ${selectedOptions.includes(option.id) ? "text-white" : "text-slate-300"}`}>{option.order}</span>
                    </span>
                    <span className="ml-3 text-slate-700">
                        {option.label}
                    </span>
                </label>
            ))}
        </div>
    )
}

export default CheckboxAnswer
