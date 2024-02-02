import { cn } from "@fyp/class-name-helper";
import Card from "@renderer/core/Card";
import { ReactNode } from "react";

type Data = {
  value: number,
  label: ReactNode,
  color: string // tailwind color class
}[];

export type BarChartProps = {
  className?: string,
  label: string,
  data: Data,
  tickCount?: number,
  height: number
  barWidth?: number,
}

const BarChart = ({ label, className, data, height, tickCount = 5, barWidth = 20 }: BarChartProps) => {

  const findHighestValue = <T extends { value: number }>(array: T[]) => {
    return array.reduce((max, current) => {
      return current.value > max ? current.value : max;
    }, array[0].value);
  }

  const largest = (Math.ceil((findHighestValue(data) / 5) / 1000) * 1000) * tickCount;
  const scale = height / largest;
  const tickInterval = (largest * scale) / tickCount;

  return (
    <Card className={cn("flex flex-col text-sm", className)}>
      <p className="mb-4 text-star-dust-300 uppercase font-medium text-xs"> { label } </p>
      <div className="grid gap-x-2 relative place-items-center items-end pl-12 pr-4 mt-2"
      style={{ height: height, gridTemplateColumns: `repeat(${data.length},minmax(0,1fr))` }}>

      { data.map((value, i) => {
          return (
            <div key={i} className={cn("z-10", value.color)}
            style={{ height: `${((value.value * scale) / (largest * scale)) * 100}%`, width: barWidth }}>
              &nbsp;
            </div>
          )
      }) }

     {
        Array.from({ length: (height / tickInterval) + 1 }).map((_, i) => {
          const tick = i * tickInterval / scale;
          return (
            <div key={i} className="absolute w-full items-center text-star-dust-400 gap-2 bottom-0 left-0"
            style={{ bottom: i * tickInterval }}>
              <p className="absolute -translate-y-1/2">
                { tick >= 1000 ? `${Math.round(tick / 1000)}K` : tick }
              </p>
              <div className="ml-8 bottom-1/2 bg-woodsmoke-400 h-[1px] w-[100% - 2rem]"/>
            </div>  
          )
        })
      }
      </div>
      <Labels data={data}/>
    </Card>
  )
}

type LabelsProps = {
  data: Data
}

const Labels = ({ data }: LabelsProps) => {
  return (
    <div className="grid gap-x-2 pl-12 pr-4 place-items-center w-full"
    style={{ gridTemplateColumns: `repeat(${data.length},minmax(0,1fr))` }}>
      { data.map(({ label }, i) => {
        return (
          <div key={i} className="row-start-2">
            { label }
          </div>
        )
      }) }
    </div>
  )
}

export default BarChart;