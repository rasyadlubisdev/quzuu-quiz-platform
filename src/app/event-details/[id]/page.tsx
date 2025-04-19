"use client"

import React, { useState, useEffect } from "react"
import NavEvent from "@/components/NavEvent"
import { useParams } from "next/navigation"
import { getEventDetails } from "@/lib/api"

const EventOverview = () => {
    const { id } = useParams()
    const [eventData, setEventData] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!id) return

        const fetchEventDetails = async () => {
            setLoading(true)
            setError(null)
            try {
                const response = await getEventDetails(id as string)
                console.log("Event Details:", response)
                setEventData(response.data)
            } catch (err: any) {
                console.error(err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchEventDetails()
    }, [id])

    if (loading) return <p>Loading event details...</p>
    if (error) return <p className="text-red-500">Error: {error}</p>

    console.log(eventData)

    return (
        <main className="event-overview-page container bg-slate-100 text-slate-950 min-h-screen">
            <section className="head-info py-8">
                <h1 className="text-2xl font-bold">
                    Try Out OSNK Informatika 2023
                </h1>
                <h3 className="text-xl font-normal">Event Details</h3>
            </section>
            <section className="pb-10 grid grid-cols-1 md:grid-cols-3 gap-y-8 md:gap-x-8">
                <NavEvent />
                <div className="display-event-overview col-span-2 bg-white p-9 rounded-3xl text-slate-800 shadow">
                    <h1 className="text-2xl underline">Event Overview</h1>
                    <ol className="list-decimal mt-5 ml-5">
                        <li>
                            Soal Ujian terdiri dari 2 jenis. Bagian A : Soal
                            Pilihan Ganda dan Isian
                        </li>
                        <li>Dan Bagian B : Soal Membuat Program</li>
                        <li>
                            Lorem ipsum dolar si amet Lorem ipsum dolar si
                            ametLorem ipsum dolar si amet
                        </li>
                        <li>
                            Lorem ipsum dolar si amet Lorem ipsum dolar si
                            ametLorem ipsum dolar si amet
                        </li>
                    </ol>
                </div>
            </section>
        </main>
    )
}

export default EventOverview
