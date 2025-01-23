const ComingSoonPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
            <h1 className="text-4xl font-bold mb-4">Coming Soon</h1>
            <p className="mb-6 text-lg">
                This page is under development. Stay tuned for updates!
            </p>
            <a
                href="/"
                className="bg-violet-500 text-white py-2 px-4 rounded-md hover:bg-violet-700 transition"
            >
                Go to Homepage
            </a>
        </div>
    )
}

export default ComingSoonPage
