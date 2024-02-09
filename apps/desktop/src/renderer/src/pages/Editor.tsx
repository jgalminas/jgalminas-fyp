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

  // TODO:
  // make left side resizeable
  // style
  // prevent accross right handle and vice versa


  const [width, setWidth] = useState(200);
  const [offset, setOffset] = useState(100);
  const divRef = useRef<HTMLDivElement>(null);

  const move = (e: DragEvent<HTMLDivElement>, side: 'left' | 'right') => {
    // if (e.buttons === 1) {
    //   console.log(e);
    //   setWidth(e.offsetX);
    // }

    const parentRect = e.currentTarget.parentElement?.getBoundingClientRect();
  
    if (e.clientX !== 0 && parentRect) {
      setWidth(e.clientX - parentRect.left);
      
    }
    
  }

  return (
    <div ref={divRef} className="flex h-8 bg-red-100" style={{ width: width }}>
      <div
        draggable
        onDragStart={(e) => { e.dataTransfer.setDragImage(new Image(), 0, 0); } }
        onDrag={(e) => move(e, "left")}
        className=" w-2 min-h-full bg-gray-500 cursor-col-resize resize"
      />
      <div
        draggable
        onDragStart={(e) => { e.dataTransfer.setDragImage(new Image(), 0, 0); } }
        onDrag={(e) => move(e, "right")}
        className=" w-2 min-h-full bg-gray-500 cursor-col-resize resize ml-auto"
      />
    </div>
  );
};

export default ResizableDiv;
