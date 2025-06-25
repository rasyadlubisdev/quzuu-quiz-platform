"use client"

import React, { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { registerEvent } from "@/lib/api"
import { toast } from "@/hooks/use-toast"

const CardPrivateEvent = () => {
    const [eventCode, setEventCode] = useState("")
    const [eventId, setEventId] = useState("")
    const [loading, setLoading] = useState(false)

    const handleEnroll = async () => {
        if (!eventCode.trim()) {
            toast({
                variant: "destructive",
                title: "Event code required",
                description: "Please enter an event code to enroll",
            })
            return
        }

        if (!eventId.trim()) {
            toast({
                variant: "destructive",
                title: "Event ID required",
                description: "Please enter an event ID to enroll",
            })
            return
        }

        setLoading(true)

        try {
            interface EventRegistrationResponse {
                message?: string
                // Add other properties you expect in the response
                success?: boolean
                data?: any
            }

            // Updated to pass string ID instead of number, per updated API
            const response = (await registerEvent(
                eventId,
                eventCode,
            )) as EventRegistrationResponse

            toast({
                title: "Successfully enrolled!",
                description:
                    response.message ||
                    "You have successfully enrolled in the event",
            })

            // Clear the input fields after successful enrollment
            setEventCode("")
            setEventId("")
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error enrolling in event",
                description:
                    error.message ||
                    "An error occurred while enrolling in the event",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white p-6 rounded-3xl text-slate-800 shadow">
            <h3 className="text-xl font-semibold">Join Private Event</h3>
            <div className="text-base font-medium mb-3.5 text-slate-500">
                Enter the Event Details
            </div>
            <div className="flex flex-col gap-4">
                {/* <Input
                    placeholder="Enter Event ID..."
                    className="ring-primary"
                    value={eventId}
                    onChange={(e) => setEventId(e.target.value)}
                    disabled={loading}
                /> */}
                <Input
                    placeholder="Enter Event Code..."
                    className="ring-primary"
                    value={eventCode}
                    onChange={(e) => setEventCode(e.target.value)}
                    disabled={loading}
                />
                <Button
                    className="w-full text-white"
                    variant={"secondary"}
                    onClick={handleEnroll}
                    disabled={loading}
                >
                    {loading ? "Enrolling..." : "Enroll"}
                </Button>
            </div>
        </div>
    )
}

export default CardPrivateEvent
