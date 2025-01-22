"use client"

import React, { useState, useEffect } from "react"

type Option = {
  id: number
  order: string
  label: string
}

type CheckboxAnswerProps = {
  options: Option[]
  selectedOptions?: number[]
  correctOptions?: number[]
  isReviewMode?: boolean
  onChangeOption?: (selectedIds: number[]) => void
}

const CheckboxAnswer: React.FC<CheckboxAnswerProps> = ({
  options,
  selectedOptions = [],
  correctOptions = [],
  isReviewMode = false,
  onChangeOption,
}) => {
  const [localSelected, setLocalSelected] = useState<number[]>(selectedOptions)

  useEffect(() => {
    setLocalSelected(selectedOptions)
  }, [selectedOptions])

  const handleSelect = (optionId: number) => {
    if (isReviewMode) return

    let updated: number[]
    if (localSelected.includes(optionId)) {
      updated = localSelected.filter((id) => id !== optionId)
    } else {
      updated = [...localSelected, optionId]
    }

    setLocalSelected(updated)
    onChangeOption && onChangeOption(updated)
  }

  return (
    <div className="space-y-3">
      {options.map((option) => {
        const isChosen = localSelected.includes(option.id)
        let containerStyle = "bg-white border-slate-300"

        if (isChosen && !isReviewMode) {
          containerStyle = "bg-violet-100 border-violet-300"
        }

        if (isReviewMode && isChosen) {
          const isCorrect = correctOptions.includes(option.id)
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
              className={`flex items-center justify-center h-6 w-6 rounded-full border-2
                ${
                  isChosen
                    ? "border-secondary bg-secondary text-white"
                    : "border-slate-300"
                }
              `}
            >
              <span
                className={`text-sm font-semibold ${
                  isChosen ? "text-white" : "text-slate-300"
                }`}
              >
                {option.order}
              </span>
            </span>
            <span className="ml-3 text-slate-700">{option.label}</span>
          </label>
        )
      })}
    </div>
  )
}

export default CheckboxAnswer
