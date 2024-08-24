"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Button } from "./ui/button"
import Countdown from "./Countdown"

const NavQuiz = () => {
    // const pathname = usePathname()
    const searchParams = useSearchParams()
    const pageNumber = searchParams.get("num")

    // console.log(router)

    return (
        <div className="col-span-1 bg-white pt-4 pb-6 px-6 rounded-3xl text-slate-800 shadow">
            <div className="timer px-6">
                <h3 className="text-base font-bold text-secondary mb-1">Time Left</h3>
                <div className="run-timer py-3 px-5 rounded-2xl border border-secondary">
                    <Countdown />
                </div>
            </div>
            <div className="questions-number mt-5 flex flex-wrap justify-center">
                <Link href="/event-details/1/start/analitika?num=1" className={`flex justify-center items-center rounded-md border-2 ${pageNumber === "1" || pageNumber === null ? "border-secondary text-white bg-secondary" : "border-slate-400 text-slate-400"} text-xl font-bold m-1.5`} style={{ width: "54px", height: "47px" }}>01</Link>
                <Link href="/event-details/1/start/analitika?num=2" className={`flex justify-center items-center rounded-md border-2 ${pageNumber === "2"? "border-secondary text-white bg-secondary" : "border-slate-400 text-slate-400"} text-xl font-bold m-1.5`} style={{ width: "54px", height: "47px" }}>02</Link>
                <Link href="/event-details/1/start/analitika?num=3" className={`flex justify-center items-center rounded-md border-2 ${pageNumber === "3"? "border-secondary text-white bg-secondary" : "border-slate-400 text-slate-400"} text-xl font-bold m-1.5`} style={{ width: "54px", height: "47px" }}>03</Link>
                <Link href="/event-details/1/start/analitika?num=4" className={`flex justify-center items-center rounded-md border-2 ${pageNumber === "4"? "border-secondary text-white bg-secondary" : "border-slate-400 text-slate-400"} text-xl font-bold m-1.5`} style={{ width: "54px", height: "47px" }}>04</Link>
                <Link href="/event-details/1/start/analitika?num=5" className={`flex justify-center items-center rounded-md border-2 ${pageNumber === "5"? "border-secondary text-white bg-secondary" : "border-slate-400 text-slate-400"} text-xl font-bold m-1.5`} style={{ width: "54px", height: "47px" }}>05</Link>
                <Link href="/event-details/1/start/analitika?num=6" className={`flex justify-center items-center rounded-md border-2 ${pageNumber === "6"? "border-secondary text-white bg-secondary" : "border-slate-400 text-slate-400"} text-xl font-bold m-1.5`} style={{ width: "54px", height: "47px" }}>06</Link>
                <Link href="/event-details/1/start/analitika?num=7" className={`flex justify-center items-center rounded-md border-2 ${pageNumber === "7"? "border-secondary text-white bg-secondary" : "border-slate-400 text-slate-400"} text-xl font-bold m-1.5`} style={{ width: "54px", height: "47px" }}>07</Link>
                <Link href="/event-details/1/start/analitika?num=8" className={`flex justify-center items-center rounded-md border-2 ${pageNumber === "8"? "border-secondary text-white bg-secondary" : "border-slate-400 text-slate-400"} text-xl font-bold m-1.5`} style={{ width: "54px", height: "47px" }}>08</Link>
                <Link href="/event-details/1/start/analitika?num=9" className={`flex justify-center items-center rounded-md border-2 ${pageNumber === "9"? "border-secondary text-white bg-secondary" : "border-slate-400 text-slate-400"} text-xl font-bold m-1.5`} style={{ width: "54px", height: "47px" }}>09</Link>
                <Link href="/event-details/1/start/analitika?num=10" className={`flex justify-center items-center rounded-md border-2 ${pageNumber === "10"? "border-secondary text-white bg-secondary" : "border-slate-400 text-slate-400"} text-xl font-bold m-1.5`} style={{ width: "54px", height: "47px" }}>10</Link>
                <Link href="/event-details/1/start/analitika?num=11" className={`flex justify-center items-center rounded-md border-2 ${pageNumber === "11"? "border-secondary text-white bg-secondary" : "border-slate-400 text-slate-400"} text-xl font-bold m-1.5`} style={{ width: "54px", height: "47px" }}>11</Link>
                <Link href="/event-details/1/start/analitika?num=12" className={`flex justify-center items-center rounded-md border-2 ${pageNumber === "12"? "border-secondary text-white bg-secondary" : "border-slate-400 text-slate-400"} text-xl font-bold m-1.5`} style={{ width: "54px", height: "47px" }}>12</Link>
                <Link href="/event-details/1/start/analitika?num=13" className={`flex justify-center items-center rounded-md border-2 ${pageNumber === "13"? "border-secondary text-white bg-secondary" : "border-slate-400 text-slate-400"} text-xl font-bold m-1.5`} style={{ width: "54px", height: "47px" }}>13</Link>
                <Link href="/event-details/1/start/analitika?num=14" className={`flex justify-center items-center rounded-md border-2 ${pageNumber === "14"? "border-secondary text-white bg-secondary" : "border-slate-400 text-slate-400"} text-xl font-bold m-1.5`} style={{ width: "54px", height: "47px" }}>14</Link>
                <Link href="/event-details/1/start/analitika?num=15" className={`flex justify-center items-center rounded-md border-2 ${pageNumber === "15"? "border-secondary text-white bg-secondary" : "border-slate-400 text-slate-400"} text-xl font-bold m-1.5`} style={{ width: "54px", height: "47px" }}>15</Link>
            </div>
            <div className="buttons mt-4 flex flex-col">
                <Button variant="outline" className="mb-4">Clarification</Button>
                <Button>Submit Answers</Button>
            </div>
        </div>
    )
}

export default NavQuiz