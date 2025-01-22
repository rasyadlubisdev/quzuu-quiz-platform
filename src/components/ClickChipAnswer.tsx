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

const chipOptions: string[] = ["int", "= 2000;", "+ 1000"]

const ClickChipAnswer: React.FC<ClickChipAnswerProps> = ({
  correctAnswer = [],
  userSelected = [],
  isReviewMode = false,
  onChange,
}) => {
  const [selectedChips, setSelectedChips] = useState<string[]>(userSelected)

  useEffect(() => {
    setSelectedChips(userSelected)
  }, [userSelected])

  const handleSelectChip = (value: string) => {
    if (isReviewMode) return

    if (selectedChips.includes(value)) return

    const updated = [...selectedChips, value]
    setSelectedChips(updated)
    onChange?.(updated)
  }

  const handleReset = () => {
    if (isReviewMode) return

    setSelectedChips([])
    onChange?.([])
  }

  const inputColor = (index: number) => {
    if (!isReviewMode) return "bg-slate-600"
    return selectedChips[index] === correctAnswer[index]
      ? "bg-green-400"
      : "bg-red-400"
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
            className={`${inputColor(
              0
            )} text-slate-950 w-24 h-6 inline p-0 leading-3 text-base`}
          />{" "}
          jeruk = <span className="text-orange-500">2000</span>;
        </code>
        <br />
        <code>
          <span className="text-blue-400">int</span> anggur{" "}
          <Input
            disabled
            value={selectedChips[1] || ""}
            className={`${inputColor(
              1
            )} text-slate-950 w-24 h-6 inline p-0 leading-3 text-base`}
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
                key={chip}
                className={`${
                  selectedChips.includes(chip) ? "invisible" : "visible"
                } bg-blue-400 text-slate-950 py-1 px-2 rounded-md cursor-pointer`}
                onClick={() => handleSelectChip(chip)}
              >
                <code>{chip}</code>
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
          {JSON.stringify(selectedChips) === JSON.stringify(correctAnswer) ? (
            <span className="text-green-600">Semua potongan kode benar!</span>
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
