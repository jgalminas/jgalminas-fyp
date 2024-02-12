import { cn } from "@fyp/class-name-helper";
import { msToLength } from "@renderer/util/time";
import { Dispatch, DragEvent, SetStateAction, useRef, useState } from "react";
import TimeCursorHead from '@assets/icons/TimeCursorHead.svg?react';
import Button from "@renderer/core/Button";
import ZoomIn from "@assets/icons/ZoomIn.svg?react";
import ZoomOut from "@assets/icons/ZoomOut.svg?react";
import { videoUrl } from "@renderer/util/video";

export type EditorProps = {
  
}

const pxToMs = (px: number, maxWidth: number, length: number) => px * (length / maxWidth);
const msToPx = (ms: number, maxWidth: number, length: number) => Math.ceil(ms * (maxWidth / length));

export const Editor = ({  }: EditorProps) => {

  const length = 1_200_000;
  const scale = 1000;

  const [zoom, setZoom] = useState(100);
  const [width, setWidth] = useState(112);
  const [offset, setOffset] = useState(0);
  const [position, setPosition] = useState(112);

  const intervalCount = Math.ceil(length / (scale * zoom));
  const maxWidth = (intervalCount + zoom) * intervalCount;


  console.log(msToLength(pxToMs(width, maxWidth, length)));
  


  const onZoomIn = () => {
    const newZoom = Math.max(10, zoom - 10);
    const scaleFactor = newZoom / zoom;
    setZoom(newZoom);
    const newWidth = width * (1 + (1 - (scaleFactor)));
    const intervalCount = Math.ceil(length / (scale * newZoom));
    const maxWidth = (intervalCount + newZoom) * intervalCount;
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
      
      <div>
        {/* <video className="aspect-video" src={videoUrl("6802422436", "recording")}/> */}
      </div>

      <div>
        controls
      </div>
      {/* control icon buttons */}

      <Timeline
      intervalCount={intervalCount}
      maxWidth={maxWidth}
      offset={offset}
      position={position}
      width={width}
      setOffset={setOffset}
      setWidth={setWidth}
      zoom={zoom}
      length={length}
      zoomIn={onZoomIn}
      zoomOut={onZoomOut}
      />

    </div>
  )
}


export type TimelineProps = {
  length: number,
  position: number,
  width: number,
  maxWidth: number,
  zoom: number,
  intervalCount: number,
  setWidth: Dispatch<SetStateAction<number>>,
  offset: number,
  setOffset: Dispatch<SetStateAction<number>>
  zoomIn: () => void,
  zoomOut: () => void
}

export const Timeline = ({
  maxWidth,
  zoom,
  intervalCount,
  setWidth,
  offset,
  setOffset,
  position,
  width,
  length,
  zoomIn,
  zoomOut
}: TimelineProps) => {

  return (
    <div className="bg-woodsmoke-600 select-none">
      <div className="grid grid-cols-3 border-y items-center justify-between text-star-dust-300 border-woodsmoke-200 px-2 py-0.5 text-sm">
        <p className="col-start-2 justify-self-center">
          <span className="font-medium"> { msToLength(pxToMs(position, maxWidth, length)) } </span>
          <span> / </span>
          { msToLength(length) }
        </p>
        <div className="flex items-center justify-end gap-2">
          <Button styleType="text" onClick={zoomOut}
          className="p-1.5 hover:bg-woodsmoke-300">
            <ZoomOut className="w-5 h-5"/>
          </Button>
          <p> { zoom }% </p>
          <Button styleType="text" onClick={zoomIn}
          className="p-1.5 hover:bg-woodsmoke-300">
            <ZoomIn className="w-5 h-5"/>
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto flex flex-col relative mx-5">
        <TimeCursor position={position}/>

        <div className="py-5">
          events
        </div>

        <div className="flex text-star-dust-300 text-xs pb-3">
          { Array.from({ length: intervalCount }).map((_, i) => {
            return (
              <div key={i} style={{ minWidth: intervalCount + zoom }}
              className="relative flex justify-between">
                <div className="flex items-end h-8 w-[1px] bg-star-dust-300 ml-[0.5px]">
                  <span className="ml-2"> { msToLength(i * (length / intervalCount)) } </span>
                </div>
                <span className="absolute left-1/2 top-0 min-h-4 min-w-[1px] bg-star-dust-300"/>
                { i + 1 === intervalCount &&
                  <div className="flex items-end h-8 w-[1px] bg-star-dust-300 ml-[0.5px]">
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

export type TimeCursorProps = {
  position: number
}

export const TimeCursor = ({ position }: TimeCursorProps) => {
  return (
    <div className="bg-science-blue-600 w-[2px] h-full absolute flex flex-col items-center z-50" style={{ left: position }}>
      <TimeCursorHead className="w-6 h-6"/>
    </div>
  )
}
