"use client"

import React, { useState } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

interface Answer {
    id: string
    content: string
    color: string
}

const initialAnswers: Answer[] = [
    { id: "1", content: "int", color: "bg-blue-400" },
    { id: "2", content: "= 2000;", color: "bg-orange-500" },
];

const ClickChipAnswer: React.FC = () => {

    const [answers, setAnswers] = useState<Answer[]>([])
    const [idClick, setIdClick] = useState<string[]>([])

    function getAnswer(id: string) {
        setIdClick(prev => [...prev, id])
        const foundAnswer: any = initialAnswers?.find(answer => answer.id === id)
        const exists = answers.some(answer => answer.id === id)
        if (!exists) {
            setAnswers(prev => [...prev, foundAnswer])
        }
    }

    function resetAnswer() {
        setAnswers([])
        setIdClick([])
    }

    console.log(answers)
    
    return (
        <div className="flex flex-col">
            <div className="code-display py-8 px-6 bg-slate-950 text-white rounded-md whitespace-pre-wrap">
                <code><span className="text-blue-400">int</span> apel = <span className="text-orange-500">5000</span>;</code>
                <br />
                <code><Input value={answers.length > 0 ? answers[0].content : ""} style={{ width: `${(answers.length > 0 ? answers[0].content : "").length}ch` }}  disabled className={`focus-visible:ring-offset-0 disabled:opacity-100 disabled:cursor-default ${answers.length > 0 ? answers[0].color : "bg-slate-600"} text-slate-950 min-w-9 h-6 inline p-0 leading-3 focus:ring-transparent text-base`} /> jeruk = <span className="text-orange-500">2000</span>;</code>
                <br />
                <code><span className="text-blue-400">int</span> anggur <Input value={answers.length > 1 ? answers[1].content : ""} style={{ width: `${(answers.length > 1 ? answers[1].content : "").length}ch` }} disabled className={`focus-visible:ring-offset-0 disabled:opacity-100 disabled:cursor-default ${answers.length > 1 ? answers[1].color : "bg-slate-600"}  text-slate-950 min-w-16 h-6 inline p-0 leading-3 focus:ring-transparent focus:outline-none text-base`} /></code>
                <br />
                <code>total_harga = apel + jeruk + anggur;</code>
            </div>
            <div className="flex justify-between items-center mt-5">
                <div className="flex gap-x-2.5">
                    {initialAnswers.map(({id, content, color}) => (
                        <div 
                            className={`${color} ${idClick.some(el => el === id) ? "invisible" : "visible"} text-slate-950 py-1 px-2 rounded-md cursor-pointer`}
                            key={id}
                            onClick={() => getAnswer(id)}
                        >
                            <code>{content}</code>
                        </div>
                    ))}
                </div>
                <Button variant="ghost" onClick={() => resetAnswer()}>Reset</Button>
            </div>
        </div>
    )
}

export default ClickChipAnswer
