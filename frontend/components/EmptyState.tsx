export default function EmptyState({ selectedCategory }: { selectedCategory: string }) {
  return (
    <div className="text-center py-16 border-2 border-dashed border-purple-400/20 rounded-xl">
      <div className="text-6xl mb-4 opacity-30">Brain</div>
      <div className="text-purple-300 font-mono text-xl mb-2">NO_INSIGHTS_AVAILABLE</div>
      <div className="text-gray-400 font-mono max-w-md mx-auto">
        {selectedCategory === 'All'
          ? 'Complete more habits to generate neural insights.'
          : `No ${selectedCategory.toLowerCase()} insights yet. Try another category.`}
      </div>
    </div>
  );
}