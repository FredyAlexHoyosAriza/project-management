export default function Button({ label }: { label: string }) {
  return (
    <button className="btn bg-green-700 cursor-pointer text-white p-2 rounded-lg">
      {label}
    </button>
  );
}
