"use client"

import React, { useEffect, useState } from "react"
import { getEventList } from "@/lib/api"

const EventList = () => {
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getEventList()
                setEvents(data) // Sesuaikan dengan struktur API response
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchEvents()
    }, [])

    if (loading) return <div>Loading events...</div>
    if (error) return <div className="text-red-500">Error: {error}</div>

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Event List</h1>
            <ul>
                {events.map((event) => (
                    <li key={event.id} className="mb-2 p-4 border rounded">
                        <h2 className="font-semibold">{event.title}</h2>
                        <p>{event.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default EventList
