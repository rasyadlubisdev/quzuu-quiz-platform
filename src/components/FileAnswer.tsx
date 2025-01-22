"use client"

import React, { useState, useEffect } from "react"
import { Label } from "./ui/label"
import { Input } from "./ui/input"

type FileAnswerProps = {
  userFileUrl?: string
  correctFileUrl?: string
  isReviewMode?: boolean
  onFileChange?: (fileUrl: string) => void
}

const FileAnswer: React.FC<FileAnswerProps> = ({
  userFileUrl = "",
  correctFileUrl = "",
  isReviewMode = false,
  onFileChange,
}) => {
  const [fileUrl, setFileUrl] = useState<string>(userFileUrl)

  useEffect(() => {
    setFileUrl(userFileUrl)
  }, [userFileUrl])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isReviewMode) return

    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setFileUrl(url)
      onFileChange?.(url)
    }
  }

  const isCorrect = fileUrl && fileUrl === correctFileUrl

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="code-file">Submit Code File</Label>
      {!isReviewMode ? (
        <>
          <Input id="code-file" type="file" onChange={handleFileChange} />
          {fileUrl && (
            <div className="mt-2 text-sm">
              <span className="text-blue-600">
                File uploaded. Preview URL: {fileUrl}
              </span>
            </div>
          )}
        </>
      ) : (
        <div className="p-4 border rounded-md">
          <p className="text-sm font-medium">
            Review File Anda:
            {fileUrl ? (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-600 underline"
              >
                Open file
              </a>
            ) : (
              " (No file submitted)"
            )}
          </p>
          <p className="text-sm mt-2">
            File Benar:
            {correctFileUrl ? (
              <a
                href={correctFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-600 underline"
              >
                Correct file
              </a>
            ) : (
              " (No correct file link provided)"
            )}
          </p>
          {fileUrl && (
            <p
              className={`mt-2 font-semibold ${
                isCorrect ? "text-green-600" : "text-red-600"
              }`}
            >
              {isCorrect
                ? "File Anda benar."
                : "File Anda tidak sesuai dengan expected file."}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default FileAnswer
