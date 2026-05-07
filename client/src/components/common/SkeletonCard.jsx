// Animated placeholder shown while data loads
const SkeletonCard = ({ className = "" }) => {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 p-6 animate-pulse ${className}`}
    >
      <div className="h-4 bg-slate-200 rounded w-1/2 mb-3" />
      <div className="h-8 bg-slate-200 rounded w-1/3 mb-2" />
      <div className="h-3 bg-slate-200 rounded w-2/3" />
    </div>
  );
};

export default SkeletonCard;