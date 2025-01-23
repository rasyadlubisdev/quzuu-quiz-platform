const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="mb-6 text-lg">
                Sorry, the page you are looking for does not exist.
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

export default NotFoundPage
