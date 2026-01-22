type DevLogCardProps = {
  title: string;
  description: string;
  date: string;
};

export default function DevLogCard({ title, description, date }: DevLogCardProps) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-gray-600 mt-1">{description}</p>
      <p className="text-sm text-gray-400 mt-2">{date}</p>
    </div>
  );
}
