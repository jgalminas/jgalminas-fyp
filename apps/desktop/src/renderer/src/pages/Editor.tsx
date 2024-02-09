import { msToLength } from "@renderer/util/time";
import { DragEvent, MouseEvent as ReactMouseEvent, useEffect, useRef, useState } from "react";
import * as Slider from '@radix-ui/react-slider'; 

export type EditorProps = {
  
}

export const Editor = ({  }: EditorProps) => {

  const length = 1_200_000;
  const scale = 1000;

  const [zoom, setZoom] = useState(100);

  const intervalCount = Math.ceil(length / (scale * zoom));

  const onMouseMove = (e: ReactMouseEvent, index: number) => {
    // () => console.log(i, i * (scale * zoom))
    // console.log(index * (scale * zoom));
    console.log(index * (scale * zoom));
    
    // console.log(e.currentTarget.getBoundingClientRect());
    
    
  }

  const [width, setWidth] = useState<number>(0);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      setWidth(ref.current.scrollWidth);
    }
  }, [ref, zoom])

  console.log(intervalCount * (zoom * 0.1));
  

  return (  
    <div className="w-full">
      
      <div className="overflow-x-auto bg-woodsmoke-600 p-5">
        <div ref={ref} className="flex mt-64">
          { Array.from({ length: intervalCount + 1 }).map((_, i) => (
            <div onMouseOver={(e) => onMouseMove(e, i)} key={i}
            style={{ minWidth: intervalCount * (zoom * 0.1) }}
            className="bg-green-700">
              | { msToLength(i * (length / intervalCount)) }
            </div>
          )) }
        </div>
        {/* <div className="bg-blue-500 ml-[30px] flex gap-2 w-[60px]"
        onMouseOver={(e) => {

          const intervalWidth = intervalCount * (zoom * 0.1);
          const width = e.currentTarget.getBoundingClientRect().width;

          const intervalValueInMs = scale * zoom;
          const msPerPx = intervalValueInMs / intervalWidth;

          const start = e.currentTarget.offsetLeft * msPerPx;
          const end = width * msPerPx;
          
        }}>
          Drag Me
        </div> */}

        <ResizableDiv/>
      </div>


      <button onClick={() => setZoom(zoom => Math.floor(zoom * 0.9))}> zoom in </button>
      <button onClick={() => setZoom(zoom => Math.floor(zoom * 1.1))}> zoom out </button>
    </div>
  )
}


const ResizableDiv = () => {

  const [isDragging, setIsDragging] = useState<boolean>(false);

  const [width, setWidth] = useState(200);
  const divRef = useRef<HTMLDivElement>(null);

  const move = (e: DragEvent<HTMLDivElement>) => {
    // if (e.buttons === 1) {
    //   console.log(e);
    //   setWidth(e.offsetX);
    // }

    const parentRect = e.currentTarget.parentElement?.getBoundingClientRect();
  
    if (e.clientX !== 0 && parentRect) {
      setWidth(e.clientX - parentRect.left)
    }
    
  }

  const onMouseDown = () => {
    setIsDragging(true);
  }

  // useEffect(() => {
    
  //   document.addEventListener("mousemove", move);

  //   return () => {
  //     document.removeEventListener("mousemove", move)
  //   }
  // }, [])

  return (
    <div ref={divRef} className="relative h-8 bg-red-100" style={{ width: width }}>
      {/* <div
        className="absolute inset-y-0 left-0 w-2 bg-gray-500 cursor-col-resize"
        onMouseDown={}
      ></div> */}
      <div
        draggable
        onDrag={move}
        className="inset-y-0 right-0 w-2 bg-gray-500 cursor-col-resize resize ml-auto"
        // onMouseDown={onMouseDown}
      >x</div>
    </div>
  );
};

export default ResizableDiv;
