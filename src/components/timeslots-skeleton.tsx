export default function TimeslotsSkeleton() {
  return (
    <>
      <div className="h-6 bg-gray-100 rounded-md w-1/4 mb-2 animate-pulse" />
      <div className="flex gap-2">
        {[1, 2, 3].map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-gray-100 h-9 rounded-md animate-pulse"
          />
        ))}
      </div>
    </>
  );
}
