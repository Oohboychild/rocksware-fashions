export default function ShopLoading() {
  return (
    <div className="section-padding py-16">
      <div className="container-narrow">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array(8).fill(null).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-[#EDE8E0] aspect-[3/4] mb-4" />
              <div className="bg-[#EDE8E0] h-3 w-16 mb-2" />
              <div className="bg-[#EDE8E0] h-4 w-32 mb-2" />
              <div className="bg-[#EDE8E0] h-3 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}