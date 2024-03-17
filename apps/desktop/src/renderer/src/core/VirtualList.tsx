// import { useVirtualizer } from "@tanstack/react-virtual";
// import { ReactNode, useRef } from "react"

// export type VirtualListProps<T> = {
//   children: (item: T) => ReactNode,
//   data: T[],
//   size: number,
//   gap: number
// }

// export const VirtualList = <T,>({ children, data, size, gap }: VirtualListProps<T>) => {

//   const parentRef = useRef<HTMLDivElement>(null);

//   const rowVirtualizer = useVirtualizer({
//     count: data.length ?? 0,
//     getScrollElement: () => parentRef.current,
//     estimateSize: () => size + gap,
//     overscan: 5,
//   })

//   return (
//     <div ref={parentRef} className="overflow-y-auto pt-5">
//       <div className="relative w-full"
//       style={{ height: rowVirtualizer.getTotalSize() }}>
//         { rowVirtualizer.getVirtualItems().map((it) => (
//           <div key={it.key} className="top-0 left-0 absolute w-full"
//           style={{
//             height: `${it.size}px`,
//             transform: `translateY(${it.start}px)`,
//           }}>
//             { children(data[it.index]) }
//           </div>
//         )) }
//       </div>
//     </div>
//   )
// }
