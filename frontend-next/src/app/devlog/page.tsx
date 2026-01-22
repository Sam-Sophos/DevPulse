import DevLogCard from "@/components/DevLogCard";

const devLogs = [
  {
    id: 1,
    title: "Initialized DevPulse",
    description: "Scaffolded Next.js App Router and Tailwind setup.",
    date: "2026-01-22",
  },
  {
    id: 2,
    title: "Added Global Layout",
    description: "Implemented root layout and homepage structure.",
    date: "2026-01-21",
  },
];

export default function DevLogPage() {
  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Dev Log</h1>
      <div className="space-y-4">
        {devLogs.map(log => (
          <DevLogCard key={log.id} {...log} />
        ))}
      </div>
    </main>
  );
}
