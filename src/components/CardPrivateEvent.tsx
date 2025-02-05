"use client"

import React, { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { registerEvent } from "@/lib/api"

const CardPrivateEvent = () => {
    const [eventCode, setEventCode] = useState("")

    const handleEnroll = async () => {
        try {
            const response = await registerEvent(1, eventCode)
            console.log("Register Event Response:", response)
            alert("Successfully enrolled in event!")
        } catch (error: any) {
            console.error("Error enrolling event:", error)
            alert(error.message || "Error enrolling event.")
        }
    }

    return (
        <div className="bg-white p-6 rounded-3xl text-slate-800 shadow">
            <h3 className="text-xl font-semibold">Join Private Event</h3>
            <div className="text-base font-medium mb-3.5 text-slate-500">
                Enter the Event ID
            </div>
            <div className="flex flex-row md:flex-col tablet:flex-row">
                <Input
                    placeholder="Enter code..."
                    className="ring-primary"
                    value={eventCode}
                    onChange={(e) => setEventCode(e.target.value)}
                />
                <Button
                    className="ml-4 md:mt-4 md:ml-0 tablet:ml-4 tablet:mt-0"
                    onClick={handleEnroll}
                >
                    Enroll
                </Button>
            </div>
        </div>
    )
}

export default CardPrivateEvent
