const InternalServerErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold mb-4">505 - Internal Server Error</h1>
      <p className="mb-6 text-lg">
        Something went wrong. Please try again later.
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

export default InternalServerErrorPage
