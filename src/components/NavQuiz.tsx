"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "./ui/button"

const NavQuiz = () => {
    const pathname = usePathname()
    // console.log(router)

    return (
        <div className="col-span-1 bg-white pt-4 pb-6 px-6 rounded-3xl text-slate-800 shadow">
            <div className="timer px-6">
                <h3 className="text-base font-bold text-secondary mb-1">Time Left</h3>
                <div className="run-timer py-3 px-5 rounded-2xl border border-secondary">
                    <h1 className="text-3xl laptop:text-4xl font-bold text-secondary text-center">01 : 47 : 40</h1>
                </div>
            </div>
            <div className="questions-number mt-5 flex flex-wrap justify-center">
                <Link href="/" className="flex justify-center items-center rounded-md border-2 border-slate-400 text-slate-400 text-xl font-bold m-1.5" style={{ width: "54px", height: "47px" }}>01</Link>
                <Link href="/" className="flex justify-center items-center rounded-md border-2 border-slate-400 text-slate-400 text-xl font-bold m-1.5" style={{ width: "54px", height: "47px" }}>02</Link>
                <Link href="/" className="flex justify-center items-center rounded-md border-2 border-slate-400 text-slate-400 text-xl font-bold m-1.5" style={{ width: "54px", height: "47px" }}>03</Link>
                <Link href="/" className="flex justify-center items-center rounded-md border-2 border-slate-400 text-slate-400 text-xl font-bold m-1.5" style={{ width: "54px", height: "47px" }}>04</Link>
                <Link href="/" className="flex justify-center items-center rounded-md border-2 border-slate-400 text-slate-400 text-xl font-bold m-1.5" style={{ width: "54px", height: "47px" }}>05</Link>
                <Link href="/" className="flex justify-center items-center rounded-md border-2 border-slate-400 text-slate-400 text-xl font-bold m-1.5" style={{ width: "54px", height: "47px" }}>06</Link>
                <Link href="/" className="flex justify-center items-center rounded-md border-2 border-slate-400 text-slate-400 text-xl font-bold m-1.5" style={{ width: "54px", height: "47px" }}>07</Link>
                <Link href="/" className="flex justify-center items-center rounded-md border-2 border-slate-400 text-slate-400 text-xl font-bold m-1.5" style={{ width: "54px", height: "47px" }}>08</Link>
                <Link href="/" className="flex justify-center items-center rounded-md border-2 border-slate-400 text-slate-400 text-xl font-bold m-1.5" style={{ width: "54px", height: "47px" }}>09</Link>
                <Link href="/" className="flex justify-center items-center rounded-md border-2 border-slate-400 text-slate-400 text-xl font-bold m-1.5" style={{ width: "54px", height: "47px" }}>10</Link>
                <Link href="/" className="flex justify-center items-center rounded-md border-2 border-slate-400 text-slate-400 text-xl font-bold m-1.5" style={{ width: "54px", height: "47px" }}>11</Link>
                <Link href="/" className="flex justify-center items-center rounded-md border-2 border-slate-400 text-slate-400 text-xl font-bold m-1.5" style={{ width: "54px", height: "47px" }}>12</Link>
                <Link href="/" className="flex justify-center items-center rounded-md border-2 border-slate-400 text-slate-400 text-xl font-bold m-1.5" style={{ width: "54px", height: "47px" }}>13</Link>
                <Link href="/" className="flex justify-center items-center rounded-md border-2 border-slate-400 text-slate-400 text-xl font-bold m-1.5" style={{ width: "54px", height: "47px" }}>14</Link>
                <Link href="/" className="flex justify-center items-center rounded-md border-2 border-slate-400 text-slate-400 text-xl font-bold m-1.5" style={{ width: "54px", height: "47px" }}>15</Link>
                <Link href="/" className="flex justify-center items-center rounded-md border-2 border-slate-400 text-slate-400 text-xl font-bold m-1.5" style={{ width: "54px", height: "47px" }}>16</Link>
            </div>
            <div className="buttons mt-4 flex flex-col">
                <Button variant="outline" className="mb-4">Clarification</Button>
                <Button>Submit Answers</Button>
            </div>
        </div>
    )
}

export default NavQuiz