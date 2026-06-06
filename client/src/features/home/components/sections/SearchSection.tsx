export default function SearchSection() {
    return (
        <section className="container mx-auto px-4">
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">
                    Search for Venues
                </h2>
                <form className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Search venues..."
                        className="flex-1 border rounded-lg p-2"
                    />
                    <button type="submit" className="bg-blue-500 text-white rounded-lg px-4">
                        Search
                    </button>
                </form>
            </div>
        </section>
    )
}