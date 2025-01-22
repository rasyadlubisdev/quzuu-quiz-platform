"use client"

import React, { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type Statement = {
  id: number
  statement: string
}

type TrueFalseAnswerProps = {
  statements: Statement[]
  correctAnswer: Record<string, boolean>
  userAnswers?: Record<string, boolean>
  isReviewMode?: boolean
  onChange?: (updatedObj: Record<string, boolean>) => void
}

const TrueFalseAnswer: React.FC<TrueFalseAnswerProps> = ({
  statements = [],
  correctAnswer = {},
  userAnswers = {},
  isReviewMode = false,
  onChange,
}) => {
  const [localAnswers, setLocalAnswers] =
    useState<Record<string, boolean>>(userAnswers)

  useEffect(() => {
    setLocalAnswers(userAnswers)
  }, [userAnswers])

  const handleChange = (statementId: number, value: boolean) => {
    if (isReviewMode) return

    const updated = { ...localAnswers, [statementId]: value }
    setLocalAnswers(updated)
    onChange?.(updated)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Pernyataan</TableHead>
          <TableHead className="text-center">Benar</TableHead>
          <TableHead className="text-center">Salah</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {statements.map((data) => {
          const userVal = localAnswers[data.id]
          const correctVal = correctAnswer[data.id]
          let rowStyle = ""
          if (isReviewMode) {
            const isCorrect = userVal === correctVal
            rowStyle = isCorrect ? "bg-green-50" : "bg-red-50"
          }

          return (
            <TableRow key={data.id} className={rowStyle}>
              <TableCell>{data.statement}</TableCell>
              <TableCell className="text-center">
                <RadioGroup
                  className="flex justify-center"
                  value={
                    userVal === true ? "true" : userVal === false ? "false" : ""
                  }
                  onValueChange={(v) => handleChange(data.id, v === "true")}
                >
                  <RadioGroupItem
                    value="true"
                    id={`true-${data.id}`}
                    disabled={isReviewMode}
                  />
                </RadioGroup>
              </TableCell>
              <TableCell className="text-center">
                <RadioGroup
                  className="flex justify-center"
                  value={
                    userVal === false ? "false" : userVal === true ? "true" : ""
                  }
                  onValueChange={(v) => handleChange(data.id, v === "true")}
                >
                  <RadioGroupItem
                    value="false"
                    id={`false-${data.id}`}
                    disabled={isReviewMode}
                  />
                </RadioGroup>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default TrueFalseAnswer
