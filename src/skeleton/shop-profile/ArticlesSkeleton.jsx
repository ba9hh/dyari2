import Skeleton from "react-loading-skeleton";

const ArticlesSkeleton = () => {
  return (
    <div className="w-full sm:w-2/3 bg-white shadow-md rounded-md pt-4 pb-8">
      <div className="flex justify-end w-full px-8">
        <Skeleton width={80} height={30} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-2 gap-y-2 mt-4">
        <Skeleton className="w-full aspect-square" />
        <Skeleton className="w-full aspect-square" />
        <Skeleton className="w-full aspect-square" />
      </div>
    </div>
  );
};

export default ArticlesSkeleton;
