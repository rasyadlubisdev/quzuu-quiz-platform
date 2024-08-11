import Link from "next/link"

const Navbar = () => {
    return (
        <nav className="navbar w-screen py-5 bg-primary text-white">
            <div className="container flex items-center">
                <div className="nav-logo basis-1/4">
                    <h1 className="text-4xl font-semibold">Quzuu</h1>
                </div>
                <div className="nav-links basis-3/4 flex justify-between">
                    <Link href="/" className="text-lg font-medium">Home</Link>
                    <Link href="/" className="text-lg font-medium">Event</Link>
                    <Link href="/" className="text-lg font-medium">Learn</Link>
                    <Link href="/" className="text-lg font-medium">Problemset</Link>
                    <Link href="/" className="text-lg font-medium">Submission</Link>
                    <Link href="/" className="text-lg font-medium">Leaderboard</Link>
                </div>
            </div>
        </nav>
    )
}

export default Navbar