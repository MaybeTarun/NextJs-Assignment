import Image from "next/image";
import data from "../data/journey.json";

export default function Journey() {
 return (
   <div className="w-full overflow-x-auto scrollbar-hide">
   <div className="flex flex-row gap-20 min-w-max px-4 pb-12">
     {data.map((item, index) => (
       <div key={index} className="relative flex-shrink-0 group">
         <Image src={item.image} alt={`Journey ${index + 1}`} width={250} height={150} className="object-cover rounded-b-lg rounded-t-[150px]" />
         <div 
           className="absolute inset-0 rounded-b-xl rounded-t-[150px] flex items-center justify-center"
           style={{ backgroundColor: 'rgba(10, 10, 10, 0.5)' }}
         >
           <p className="text-white text-center mt-8 text-2xl w-[80%] tracking-wide italic">
             {item.text1}
           </p>
         </div>
         <div className="absolute -bottom-12 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <p className="text-black text-lg text-center leading-5">
             {item.text2}
           </p>
         </div>
       </div>
     ))}
   </div>
   </div>
 );
}