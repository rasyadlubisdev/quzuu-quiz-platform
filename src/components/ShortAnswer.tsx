"use client"

import React, { useState, useEffect } from "react"
import { Input } from "./ui/input"

const ShortAnswer = () => {
    const [inputValue, setInputValue] = useState('')
    const [status, setStatus] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [isFill, setIsFill] = useState(false)

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value)
        // console.log("User is typing:", event.target.value)
        // console.log("inputValue:", inputValue)
        if (event.target.value !== "") {
            setIsFill(true)
            setStatus("Save Changes...")
            setIsSaving(true)
        } else {
            setIsFill(false)
        }
    }

    useEffect(() => {
        // console.log("CEK SAVING", isSaving)
        // console.log("CEK FILL", isFill)
        if (isSaving) {
            const saveToServer = async () => {
                await new Promise(resolve => setTimeout(resolve, 2000))
                setStatus("Answer Saved")
                setIsSaving(false)
        }

        saveToServer()
    
        // console.log("inputValue 2:", inputValue)
        }

    }, [inputValue, isSaving, isFill])

    return (
        <div className="relative max-w-56">
            <Input type="text" placeholder="Your Answer" onChange={handleInputChange} className={`ring-primary ${isSaving ? "ring-primary" : (isFill && "ring-green-500")}`} />
            <span className={`text-xs absolute bottom-0 left-0 translate-y-full pt-1 ${isSaving ? "text-primary" : "text-green-500"}`}>{isFill && status}</span>
        </div>
    )
}

export default ShortAnswer