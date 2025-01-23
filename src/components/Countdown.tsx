import React, { useEffect, useState } from "react"

const Countdown: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState<number>(2 * 60 * 60)

    useEffect(() => {
        if (timeLeft <= 0) return

        const intervalId = setInterval(() => {
            setTimeLeft((prevTime) => Math.max(prevTime - 1, 0))
        }, 1000)

        return () => clearInterval(intervalId)
    }, [timeLeft])

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600)
        const m = Math.floor((seconds % 3600) / 60)
        const s = seconds % 60
        return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
    }

    return (
        <div>
            <h1 className="text-3xl laptop:text-4xl font-bold text-secondary text-center">
                {formatTime(timeLeft)}
            </h1>
        </div>
    )
}

export default Countdown
