"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NavEvent = () => {
    const pathname = usePathname()
    // console.log(router)

    return (
        <div className="col-span-1 bg-white py-6 rounded-3xl text-slate-800 shadow">
            <div className="promoter-image py-6 px-12">
                <Image
                    src="/assets/img/promotor-TROC.png"
                    alt="TROC"
                    layout="responsive"
                    width={246}
                    height={94}
                />
            </div>
            <div className="menu-links w-full">
                <Link
                    href="/event-details/1"
                    className={`block w-full py-1.5 px-12 ${pathname == "/event-details/1" ? "bg-secondary text-white" : ""}  font-semibold`}
                >
                    Overview
                </Link>
                <Link
                    href={`/event-details/1/start`}
                    className={`block w-full py-1.5 px-12 ${pathname == "/event-details/1/start" ? "bg-secondary text-white" : "text-secondary"}`}
                >
                    Start The Quiz
                </Link>
                <Link
                    href={`/event-details/1/announcement`}
                    className={`block w-full py-1.5 px-12 ${pathname == "/event-details/1/announcement" ? "bg-secondary text-white" : ""}`}
                >
                    Announcement
                </Link>
                <Link
                    href={`/event-details/1/scoreboard`}
                    className={`block w-full py-1.5 px-12 ${pathname == "/event-details/1/scoreboard" ? "bg-secondary text-white" : ""}`}
                >
                    Scoreboard
                </Link>

                {/* <Link href="/" className="block w-full py-1.5 px-12">Announcement</Link>
                <Link href="/" className="block w-full py-1.5 px-12">Scoreboard</Link> */}
            </div>
        </div>
    )
}

export default NavEvent
