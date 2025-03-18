
import { Skeleton } from "@/components/ui/skeleton"

const ProductCardSkeleton = () => {
  return (

<>

   

    <div className="flex flex-col w-full h-full bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
     
      <div className="flex justify-center p-4 h-40">
      <Skeleton className="w-[160px] h-[160px] rounded-full" />
      </div>

      <div className="p-4 flex flex-col gap-2 flex-grow m-6">
      
        <Skeleton className="w-[200px] h-[30px] rounded-lg" />

        <Skeleton className="w-[180px] h-[20px] rounded-lg mb-4" />
      <Skeleton className="w-[100px] h-[20px] rounded-lg mt-2" />
      <Skeleton className="w-[160px] h-[30px] rounded-lg mb-4" />
      <Skeleton className="w-[170px] h-[40px] rounded-lg" />

       
      </div>
    </div>

   </> 
  )
}

export default ProductCardSkeleton
