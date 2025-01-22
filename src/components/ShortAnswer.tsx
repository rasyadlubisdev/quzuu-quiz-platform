"use client"

import React, { useState, useEffect } from "react"
import { Input } from "./ui/input"

type ShortAnswerProps = {
  userInput?: string
  correctAnswerText?: string
  isReviewMode?: boolean
  onChange?: (value: string) => void
}

const ShortAnswer: React.FC<ShortAnswerProps> = ({
  userInput = "",
  correctAnswerText = "",
  isReviewMode = false,
  onChange,
}) => {
  const [localInput, setLocalInput] = useState<string>(userInput)
  const [status, setStatus] = useState<string>("")
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [isFill, setIsFill] = useState<boolean>(false)

  useEffect(() => {
    setLocalInput(userInput)
  }, [userInput])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isReviewMode) return

    const value = event.target.value
    setLocalInput(value)
    onChange?.(value)

    if (value !== "") {
      setIsFill(true)
      setStatus("Save Changes...")
      setIsSaving(true)
    } else {
      setIsFill(false)
      setStatus("")
    }
  }

  useEffect(() => {
    if (isSaving) {
      const saveToServer = async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setStatus("Answer Saved")
        setIsSaving(false)
      }
      saveToServer()
    }
  }, [isSaving])

  const isCorrect =
    localInput.trim().toLowerCase() === correctAnswerText.trim().toLowerCase()
  const inputStyle = isReviewMode
    ? isCorrect
      ? "bg-green-100 border-green-300"
      : "bg-red-100 border-red-300"
    : "bg-white border-slate-300"

  return (
    <div className="relative max-w-sm">
      <Input
        type="text"
        placeholder="Your Answer"
        value={localInput}
        onChange={handleInputChange}
        disabled={isReviewMode}
        className={`ring-primary ${inputStyle} ${
          isSaving ? "ring-primary" : isFill ? "ring-green-500" : ""
        }`}
      />
      <span
        className={`text-xs absolute bottom-0 left-0 translate-y-full pt-1 ${
          isSaving ? "text-primary" : "text-green-500"
        }`}
      >
        {isFill && status}
      </span>
      {isReviewMode && (
        <div className="mt-2 text-sm">
          {isCorrect ? (
            <span className="text-green-600 font-medium">Jawaban Benar</span>
          ) : (
            <span className="text-red-600 font-medium">
              Jawaban Salah. Seharusnya: {correctAnswerText}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default ShortAnswer
