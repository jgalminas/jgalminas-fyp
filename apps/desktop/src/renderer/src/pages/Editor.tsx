import { cn } from "@fyp/class-name-helper";
import { msToLength } from "@renderer/util/time";
import { Dispatch, DragEvent, MouseEvent, SetStateAction, useEffect, useRef, useState } from "react";

export type EditorProps = {
  
}

export const Editor = ({  }: EditorProps) => {

  const length = 1_200_000;
  const scale = 1000;

  const [zoom, setZoom] = useState(100);

  const intervalCount = Math.ceil(length / (scale * zoom));

  const [width, setWidth] = useState(120);
  const [offset, setOffset] = useState(0);

  const maxWidth = (intervalCount + zoom) * intervalCount;

  // width to milis
  // (width / intervalCount / 10) * scale * zoom

  // console.log("w: ", (width / intervalCount / 10) * scale * zoom);

  // console.log(width, width / (zoom / 100));


  // TODO: fix zooming - at the moment it is not symmetrical
  // const onZoomIn = () => {
  //   const newZoom = Math.max(10, zoom - 10);
  //   setZoom(newZoom);
  //   const scaleFactor = newZoom / 100;
  //   setWidth(initialWidth.current / scaleFactor);
  //   // setWidth(prev => prev * (1 + (1 - newZoom / 100)));
  // }

  console.log("w", width, "mw", maxWidth, "z", zoom);

  const onZoomIn = () => {
    const newZoom = Math.max(10, zoom - 10);
    const scaleFactor = newZoom / zoom;
    setZoom(newZoom);
    const newWidth = width * scaleFactor;
    setWidth(newWidth > maxWidth ? maxWidth : newWidth);
}

const onZoomOut = () => {
    const newZoom = Math.min(300, zoom + 10);
    const scaleFactor = newZoom / zoom;
    setZoom(newZoom);
    const newWidth = width / scaleFactor;
    setWidth(Math.max(50, newWidth > maxWidth ? maxWidth : newWidth));
}

  return (  
    <div className="w-full">
      
      <div className="bg-woodsmoke-600 mt-64 px-5 pt-12">
        <div className="overflow-x-auto flex flex-col">
          <div className="flex text-star-dust-300 text-xs pb-3">
            { Array.from({ length: intervalCount }).map((_, i) => {
              return (
                <div key={i} style={{ minWidth: intervalCount + zoom }}
                className="relative flex justify-between">
                  <div className="flex items-end h-8 w-[1px] bg-star-dust-300 ml-[0.5px] relative">
                    <span className="ml-2"> { msToLength(i * (length / intervalCount)) } </span>
                  </div>
                  <span className="absolute left-1/2 top-0 min-h-4 min-w-[1px] bg-star-dust-300"/>
                  { i + 1 === intervalCount &&
                    <div className="flex items-end h-8 w-[1px] bg-star-dust-300 ml-[0.5px] relative">
                      <span className="ml-2"> { msToLength((i + 1) * (length / intervalCount)) } </span>
                    </div>
                  }
                </div>
              )
            }) }
          </div>
          <Slider
          maxWidth={maxWidth}
          offset={offset}
          setOffset={setOffset}
          width={width}
          setWidth={setWidth}
          />
        </div>
      </div>

      <button onClick={onZoomIn}> zoom in </button>
      <button onClick={onZoomOut}> zoom out </button>
    </div>
  )
}

type SliderProps = {
  minRange?: number
  maxWidth: number,
  width: number,
  setWidth: Dispatch<SetStateAction<number>>,
  offset: number,
  setOffset: Dispatch<SetStateAction<number>>
}

const Slider = ({ maxWidth, width, setWidth, offset, setOffset, minRange = 50 }: SliderProps) => {

  // TODO:
  // account for scroll position in move
  // scale width with zoom
  // drag (maybe)
  // prevent cursor from chaging to red circle

  const prevOffsetX = useRef<number>(0);

  const onDrag = (e: DragEvent<HTMLDivElement>, side: 'left' | 'right') => {

    const mainElement = e.currentTarget.parentElement?.parentElement;
    const parentRect = e.currentTarget.parentElement?.getBoundingClientRect();
    const mainRect = mainElement?.getBoundingClientRect();
  
    if (e.clientX && mainElement && parentRect && mainRect) {

      // Get the parent container's left padding
      const parentPaddingLeft = parseFloat(getComputedStyle(mainElement).paddingLeft); 
      
      // Calculate starting position
      const startX = e.clientX - mainRect.left - parentPaddingLeft;
      
      // Calculate difference between previous offsetX and current offsetX
      const diff = startX - (prevOffsetX.current - mainRect?.left - parentPaddingLeft);
      
      if (diff !== 0) {
        if (side === "left") {
          if (offset + diff >= 0 && width - diff >= minRange) {
            setOffset(prev => prev + diff); 
            setWidth(width => width - diff);
          }
        } else {
          if (width + diff <= (maxWidth - offset) && width + diff >= minRange) {
            setWidth(prev => prev + diff);
          }
        }

        // Set previous offsetX as current offsetX
        prevOffsetX.current = e.clientX;
      }

    }
    
  }

  const onDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setDragImage(new Image(), 0, 0);
    prevOffsetX.current = e.clientX;
  }

  return (
    <div className="w-full bg-woodsmoke-800 rounded-lg mb-2 select-none" style={{ width: maxWidth }}>
      <div style={{ width: width, marginLeft: offset, maxWidth: maxWidth - offset }}
      className="flex h-12 bg-science-blue-600 bg-opacity-15 border-2 rounded-lg border-science-blue-600">
        <div
          draggable
          onDragStart={onDragStart}
          onDrag={(e) => onDrag(e, "left")}
          className={cn(
            "p-1 min-h-full bg-science-blue-600 bg-opacity-25 cursor-col-resize resize",
            "flex items-center justify-center text-science-blue-600"
            )}>
          ||
        </div>
        <div
          draggable
          onDragStart={onDragStart}
          onDrag={(e) => onDrag(e, "right")}
          className={cn(
            "p-1 min-h-full bg-science-blue-600 bg-opacity-25 cursor-col-resize resize",
            "ml-auto flex items-center justify-center text-science-blue-600"
            )}>
          ||
        </div>
      </div>
    </div>
  );
};

export default Slider;
