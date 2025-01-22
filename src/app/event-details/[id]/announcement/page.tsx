import NavEvent from "@/components/NavEvent"

const Announcement = () => {
  return (
    <main className="announcement-page container bg-slate-100 text-slate-950 min-h-screen">
      <section className="head-info py-8">
        <h1 className="text-2xl font-bold">Try Out OSNK Informatika 2023</h1>
        <h3 className="text-xl font-normal">Event Details</h3>
      </section>
      <section className="pb-10 grid grid-cols-1 md:grid-cols-3 gap-y-8 md:gap-x-8">
        <NavEvent />
        <div className="display-event-overview col-span-2 bg-white p-9 rounded-3xl text-slate-800 shadow">
          <h1 className="text-2xl underline">Announcement</h1>
        </div>
      </section>
    </main>
  )
}

export default Announcement
