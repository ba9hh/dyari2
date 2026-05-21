import Skeleton from "react-loading-skeleton";
const SkeletonArticlesShop = () => {
  return (
    <div className="w-full sm:w-2/3 bg-white ">
      <div className="grid grid-cols-3 gap-x-6 gap-y-6 mt-4">
        <Skeleton className="w-full aspect-square" />
        <Skeleton className="w-full aspect-square" />
        <Skeleton className="w-full aspect-square" />
      </div>
    </div>
  );
};

export default SkeletonArticlesShop;
