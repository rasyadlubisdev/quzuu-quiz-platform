"use client"

import dynamic from "next/dynamic"
import { Button } from "./ui/button"
import React, { useState, useEffect } from "react"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
    ssr: false,
})

type CodeEditorAnswerProps = {
    userCode?: string
    isReviewMode?: boolean
    onCodeChange?: (code: string) => void
}

const CodeEditorAnswer: React.FC<CodeEditorAnswerProps> = ({
    userCode = "",
    isReviewMode = false,
    onCodeChange,
}) => {
    const [code, setCode] = useState<string>(userCode)

    useEffect(() => {
        setCode(userCode)
    }, [userCode])

    const handleEditorChange = (value: string | undefined) => {
        if (isReviewMode) return
        setCode(value || "")
        onCodeChange?.(value || "")
    }

    return (
        <div className="code-editor-answer">
            <div className="code-editor-wrapper overflow-hidden rounded-md">
                <MonacoEditor
                    height="400px"
                    language="cpp"
                    theme="vs-dark"
                    value={code}
                    onChange={handleEditorChange}
                    options={{
                        readOnly: isReviewMode,
                    }}
                />
            </div>

            {!isReviewMode && <Button className="mt-4">Submit Code</Button>}
        </div>
    )
}

export default CodeEditorAnswer
