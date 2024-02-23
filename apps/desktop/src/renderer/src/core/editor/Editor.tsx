import { cn } from "@fyp/class-name-helper";
import { secToLength } from "@renderer/util/time";
import { Dispatch, DragEvent, MouseEvent, SetStateAction, useRef, useState } from "react";
import TimeCursorHead from '@assets/icons/TimeCursorHead.svg?react';
import Button from "@renderer/core/Button";
import ZoomIn from "@assets/icons/ZoomIn.svg?react";
import ZoomOut from "@assets/icons/ZoomOut.svg?react";
import { useVideoDuration } from "./hooks/useVideoDuration";
import FastForward from "@assets/icons/FastForward.svg?react";
import Pause from "@assets/icons/Pause.svg?react";
import Play from "@assets/icons/Play.svg?react";
import Rewind from "@assets/icons/Rewind.svg?react";
import RewindToStart from "@assets/icons/RewindToStart.svg?react";
import ForwardToEnd from "@assets/icons/ForwardToEnd.svg?react";
import { useKeyPress } from "./hooks/useKeyPress";
import { AggregatedEvents, IRecording } from "@fyp/types";
import { videoUrl } from "@renderer/util/video";
import Modal from "../video/Modal";
import Loading from "../Loading";
import CheckCircle from "@assets/icons/CheckCircle.svg?react";
import { useCreateHighlight } from "./hooks/useCreateHighlight";
import Skull from "@assets/icons/Skull.svg?react";
import Swords from "@assets/icons/Swords.svg?react";
import Handshake from "@assets/icons/Handshake.svg?react";


const pxToSec = (px: number, maxWidth: number, length: number) => px * (length / maxWidth);
const secToPx = (sec: number, maxWidth: number, length: number) => Math.round(sec * (maxWidth / length));

export type EditorProps = {
  recording: IRecording & { match: string },
  events: AggregatedEvents
}

export const Editor = ({ events, recording }: EditorProps) => {

  const MAX_ZOOM = 200;
  const MIN_ZOOM = 50;

  const [length, setLength] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(100);
  const [width, setWidth] = useState<number>(112);
  const [offset, setOffset] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const intervalCount = Math.ceil(length / invertZoom(zoom));
  const intervalWidth = intervalCount + invertZoom(zoom);  
  const maxWidth = intervalWidth * intervalCount;
  const videoOffset = recording.length - (events.duration / 1000);

  const videoRef = useRef<HTMLVideoElement>(null);

  const { create, isCreating } = useCreateHighlight({
    recording,
    start: pxToSec(offset, maxWidth, length) * 1000,
    finish: (pxToSec(offset, maxWidth, length) * 1000) + (pxToSec(width, maxWidth, length) * 1000),
    onCreate: () => setModalOpen(true)
  });

  const scalePx = (zoom: number, value: number) => {
    const newIntervalCount = Math.ceil(length / invertZoom(zoom));
    const newIntervalWidth = newIntervalCount + invertZoom(zoom);
    const newMaxWidth = newIntervalWidth * newIntervalCount;
    const scale = newMaxWidth / maxWidth;
    const newWidth = Math.round(value * scale);
    return [newWidth, newMaxWidth];
  }

  const onZoomIn = () => {
    const newZoom = Math.min(MAX_ZOOM, zoom + 10);
    const [newWidth, newMaxWidth] = scalePx(newZoom, width);
    const [newOffset] = scalePx(newZoom, offset);
    setOffset(newOffset);
    setZoom(newZoom);
    setWidth(newWidth > newMaxWidth ? newMaxWidth : newWidth);
  }

  const onZoomOut = () => {
    const newZoom = Math.max(MIN_ZOOM, zoom - 10);
    const [newWidth, newMaxWidth] = scalePx(newZoom, width);
    const [newOffset] = scalePx(newZoom, offset);
    setOffset(newOffset);
    setZoom(newZoom);
    setWidth(Math.max(50, newWidth > newMaxWidth ? newMaxWidth : newWidth));
  }

  const onTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(secToPx(videoRef.current.currentTime, maxWidth, length));
    }
  }

  const play = () => videoRef.current?.play();
  const pause = () => videoRef.current?.pause();

  const fastForward = () => {
    const video = videoRef.current;
    if (video) {
      if (video.currentTime + 15 >= length) {
        video.currentTime = length;
      } else {
        video.currentTime += 15;
      }
    }
  }

  const rewindToEnd = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  }

  const forwardToEnd = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = length;
    }
  }

  const rewind = () => {
    const video = videoRef.current;
    if (video) {
      if (video.currentTime - 15 < 0) {
        video.currentTime = 0;
      } else {
        video.currentTime -= 15;
      }
    }
  }

  function invertZoom(num: number) {
    if (num === MIN_ZOOM) {
      return MAX_ZOOM;
    } else if (num === MAX_ZOOM) {
      return MIN_ZOOM - 40;
    } else {
      return MAX_ZOOM + 10 - num;
    }
  }

  const updateCurrentTime = (px: number) => {
    if (videoRef.current) {
      setCurrentTime(px);
      videoRef.current.currentTime = pxToSec(px, maxWidth, length);
    }
  }

  useVideoDuration({
    ref: videoRef,
    setDuration: (num) => setLength(Math.ceil(num))
  });

  useKeyPress({
    key: "space",
    callback: () => isPlaying ? pause() : play(),
    deps: [isPlaying]
  });

  return (  
    <div className="w-full grid grid-rows-[auto,1fr,auto,auto]">

      <div className="flex justify-end p-5">
        <Button onClick={create}>
          Create Highlight
        </Button>
      </div>
      
      <div className="relative w-full">
        <video
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={onTimeUpdate} ref={videoRef}
        src={videoUrl(recording.gameId, "recording")}
        className="absolute top-0 left-0 w-full h-full"/>
      </div>

      <div className="flex items-center gap-1 justify-center p-5">
        <Button styleType="text" onClick={rewindToEnd}
        className="p-1.5 hover:bg-woodsmoke-300">
          <RewindToStart className="w-5 h-5"/>
        </Button>
        <Button styleType="text" onClick={rewind}
        className="p-1.5 hover:bg-woodsmoke-300">
          <Rewind className="w-5 h-5"/>
        </Button>

        { !isPlaying
          ?
          <Button styleType="text" onClick={play}
          className="p-2 hover:bg-woodsmoke-300">
            <Play className="w-4 h-4"/>
          </Button>
          :
          <Button styleType="text" onClick={pause}
          className="p-1.5 hover:bg-woodsmoke-300">
            <Pause className="w-5 h-5"/>
          </Button>
        }

        <Button styleType="text" onClick={fastForward}
        className="p-1.5 hover:bg-woodsmoke-300">
          <FastForward className="w-5 h-5"/>
        </Button>
        <Button styleType="text" onClick={forwardToEnd}
        className="p-1.5 hover:bg-woodsmoke-300">
          <ForwardToEnd className="w-5 h-5"/>
        </Button>
      </div>
      
      <div className="mt-auto w-full overflow-x-auto">
        <Timeline
        videoOffset={videoOffset}
        events={events}
        intervalWidth={intervalWidth}
        intervalCount={intervalCount}
        maxWidth={maxWidth}
        offset={offset}
        position={currentTime}
        width={width}
        setOffset={setOffset}
        setWidth={setWidth}
        zoom={zoom}
        length={length}
        zoomIn={onZoomIn}
        zoomOut={onZoomOut}
        updateCurrentTime={updateCurrentTime}
        />
      </div>

      { isModalOpen &&
        <CreateHighlightModal
        isLoading={isCreating}
        onClose={() => setModalOpen(false)}
        />
      }

    </div>
  )
}


export type CreateHighlightModalProps = {
  isLoading: boolean,
  onClose: () => void
}

export const CreateHighlightModal = ({ isLoading, onClose }: CreateHighlightModalProps) => {
  return (
    <Modal clickOutside={false}
    className="w-fit h-fit p-5 rounded-lg min-w-64 min-h-64 flex items-center justify-center flex-col">
      {
        isLoading
        ?
        <div className="flex flex-col items-center mt-4">
          <Loading/>
          <p className="text-star-dust-200 mt-6 mb-1"> Creating Highlight </p>
          <p className="text-star-dust-300 text-sm mb-4 max-w-48 text-center"> This should only take a few seconds </p>
        </div>
        :
        <div className="flex flex-col items-center gap-3">
          <div className="bg-green-500 rounded-lg bg-opacity-15 text-green-600 p-2">
            <CheckCircle className="w-14 h-14"/>
          </div>
          <p className="text-star-dust-200 mb-2"> Success! </p>
          <Button styleType="text" onClick={onClose}>
              Close
          </Button>
        </div>
      }
    </Modal>
  )
}

export type TimelineProps = {
  videoOffset: number,
  events: AggregatedEvents,
  intervalWidth: number,
  length: number,
  position: number,
  width: number,
  maxWidth: number,
  zoom: number,
  intervalCount: number,
  setWidth: Dispatch<SetStateAction<number>>,
  offset: number,
  setOffset: Dispatch<SetStateAction<number>>
  updateCurrentTime: (px: number) => void,
  zoomIn: () => void,
  zoomOut: () => void,
  className?: string
}

export const Timeline = ({
  videoOffset,
  events,
  maxWidth,
  intervalWidth,
  zoom,
  intervalCount,
  setWidth,
  offset,
  setOffset,
  position,
  width,
  length,
  zoomIn,
  zoomOut,
  className,
  updateCurrentTime
}: TimelineProps) => {

  const timelineRef = useRef<HTMLDivElement>(null);

  const onTimelineClick = (e: MouseEvent<HTMLDivElement>) => {
    const timeline = timelineRef.current;
    if (timeline) {
      updateCurrentTime(e.clientX - timeline.getBoundingClientRect().left);
    }
  }

  const eventToIcon = (type: typeof events.events[number]["type"]) => {
    switch(type) {
      case "KILL":
        return <Swords className="fill-woodsmoke-600 w-6 h-6 text-star-dust-400"/>
      case "ASSIST":
        return <Handshake className="w-6 h-6"/>
      case "DEATH":
        return <Skull className="w-6 h-6"/>
    }
  }

  return (
    <div className={cn("bg-woodsmoke-600 select-none", className)}>
      <div className="grid grid-cols-3 border-y items-center justify-between text-star-dust-300 border-woodsmoke-200 px-2 py-0.5 text-sm">
        <p className="col-start-2 justify-self-center">
          <span className="font-medium"> { secToLength(pxToSec(position, maxWidth, length)) } </span>
          <span className="text-star-dust-400 mx-1"> / </span>
          <span className="text-star-dust-400"> { secToLength(length) } </span>
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

      <div className="overflow-x-auto flex flex-col relative px-5">
        <TimeCursor offset={timelineRef.current?.offsetLeft ?? 0} position={position}/>

        <div onClick={onTimelineClick} style={{ width: maxWidth }}
        className="py-6 text-star-dust-300 w-full relative">
          { events.events.map((e, key) => {
            return (
              <div key={key} style={{ left: secToPx((e.timestamp / 1000) + videoOffset, maxWidth, length) ?? 0 }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2">
                { eventToIcon(e.type) }
              </div>
            )
          }) }
        </div>

        <div ref={timelineRef} className="flex text-star-dust-300 text-xs pb-3" onClick={onTimelineClick}>
          { Array.from({ length: intervalCount }).map((_, i) => {
            return (
              <div key={i} style={{ minWidth: intervalWidth }}
              className="relative flex justify-between">
                <div className="flex items-end h-8 w-[1px] bg-star-dust-300 ml-[0.5px]">
                  <span className="ml-2"> { secToLength(i * (length / intervalCount)) } </span>
                </div>
                <span className="absolute left-1/2 top-0 min-h-4 min-w-[1px] bg-star-dust-300"/>
                { i + 1 === intervalCount &&
                  <div className="flex items-end h-8 w-[1px] bg-star-dust-300 ml-[0.5px]">
                    <span className="ml-2 pr-3"> { secToLength((i + 1) * (length / intervalCount)) } </span>
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

  const onClick = (e: MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const position = e.clientX - rect.left;

    if (position < offset) {
      setOffset(position);
      setWidth(prev => prev + (offset - position));
    } else if (position > (offset + width)) {
      setWidth(position - offset);
    }
  }

  return (
    <div className="w-full bg-woodsmoke-800 rounded-lg mb-2 select-none" style={{ width: maxWidth }} onClick={onClick}>
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
  position: number,
  offset: number
}

export const TimeCursor = ({ position, offset }: TimeCursorProps) => {
  return (
    <div className="bg-science-blue-600 w-[2px] h-full absolute flex flex-col items-center z-50" style={{ left: position + offset }}>
      <TimeCursorHead className="w-5 h-5"/>
    </div>
  )
}
