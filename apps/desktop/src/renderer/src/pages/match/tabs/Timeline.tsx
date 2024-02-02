import { MatchWithGoldFrames } from '@fyp/types';
import { useSummoner } from '@renderer/SummonerContext';
import Card from '@renderer/core/Card';
import { getPlayer } from '@renderer/util/match';
import { ClientRequestBuilder } from '@renderer/util/request';
import { length, timestampToMinutes, msToLength } from '@renderer/util/time';
import { useQuery } from '@tanstack/react-query';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  ChartData,
  ChartOptions,
  Filler,
  ScriptableScaleContext
} from 'chart.js';
import { useEffect, useRef, useState } from 'react';
import { Line, Bubble } from 'react-chartjs-2';
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';
import { useParams } from 'react-router';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

const tickColor = (context: ScriptableScaleContext) => {
  if (context.tick.value === 0) {
    return '#3C3E42';
  }
  return '#202328'
}



const Timeline = () => {

  const { matchId } = useParams();

  const { data } = useQuery<MatchWithGoldFrames>({
    queryKey: ['gold', matchId],
    queryFn: async() => {
      const res = await new ClientRequestBuilder()
        .route(`/v1/match/${matchId}/gold`)
        .fetch();
      return await res.json();
    }
  });

  const [sizing, setSizing] = useState<{ left: number, right: number, width: number }>({ left: 0, right: 0, width: 0 });

  const options: ChartOptions<"line"> = {
    responsive: true,
    onResize(chart, size) {
      if (!chart.chartArea) return;
      setSizing({ left: chart.chartArea.left, right: chart.scales['x'].paddingRight, width: size.width })
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart',
      },
    },
    scales: {
      x: {
        grid: {
          color: '#202328'
        },
        ticks: {
          color: '#999999'
        }
      },
      y: {
        grid: {
          color: tickColor
        },
        ticks: {
          callback: (value) => value !== 0 ? Number(value) / 1000 + "K": "0",
          color: '#999999'
        }
      }
    }
  };

  const chartRef = useRef<ChartJSOrUndefined<"line"> | null>(null);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart?.chartArea) return;
    setSizing({ left: chart.chartArea.left, right: chart.scales['x'].paddingRight, width: chart.width })
  }, [])

  if (!data) return;

  const labels = data.frames.map((fr) => msToLength(fr.timestamp));
  
  const blue = data.winningTeam === 'BLUE' ? "#0068CA" : '#FF3B3A';
  const red = data.winningTeam !== 'BLUE' ? "#0068CA" : '#FF3B3A';

  const caculateLineColor = (ctx) => {
    if (ctx.p0.parsed.y * ctx.p1.parsed.y < 0) {
      // if the segment changes sign from p0 to p1

      const x0 = ctx.p0.parsed.x,
        x1 = ctx.p1.parsed.x,
        y0 = ctx.p0.parsed.y,
        y1 = ctx.p1.parsed.y,
        dataset = ctx.chart.data.datasets[ctx.datasetIndex],
        //identify the correct axes used for the dataset
        xAxisId = dataset.xAxisId ?? "x",
        yAxisId = dataset.yAxisId ?? "y",
        //transform values to pixels
        x0px = ctx.chart.scales[xAxisId].getPixelForValue(x0),
        x1px = ctx.chart.scales[xAxisId].getPixelForValue(x1),
        y0px = ctx.chart.scales[yAxisId].getPixelForValue(y0),
        y1px = ctx.chart.scales[yAxisId].getPixelForValue(y1);
  
      // create gradient form p0 to p1
      const gradient = ctx.chart.ctx.createLinearGradient(x0px, y0px, x1px, y1px);
      // calculate frac - the relative length of the portion of the segment
      // from p0 to the point where the segment intersects the x axis
      const frac = Math.abs(y0) / (Math.abs(y0) + Math.abs(y1));
      // set colors at the ends of the segment
      const [col_p0, col_p1] = y0 > 0 ? [blue, red] : [red, blue];
      gradient.addColorStop(0, col_p0);
      gradient.addColorStop(frac, col_p0);
      gradient.addColorStop(frac, col_p1);
      gradient.addColorStop(1, col_p1);
      return gradient;
    }
    return ctx.p0.parsed.y >= 0 ? blue : red;
  };


  const lineData: ChartData<"line", number[], string> = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: data.frames.map((fr) => data.winningTeam === 'RED' ? fr.redGold - fr.blueGold : fr.blueGold - fr.redGold),
        segment: {
          borderColor: caculateLineColor
        },
        pointBackgroundColor: (context) => {
          const y = context.parsed.y;
          if (y > 0) {
            return blue;
          } else if (y < 0) {
            return red;
          } else {
            return '#6D6D6D'
          }          
        },
        pointRadius: 4,
        fill: {
          target: 'origin',
          below: data.winningTeam !== 'RED' ? '#FF3B3A11' : '#0068CA11',
          above: data.winningTeam === 'RED' ? '#FF3B3A11' : '#0068CA11'
        }
      }
    ],
  };

  return (
    <div>
      <Card className='relative overflow-x-hidden flex flex-col pb-0'>
        <p className="mb-4 text-star-dust-300 uppercase font-medium text-xs"> Team Gold Advantage </p>
        <Line ref={chartRef} options={options} data={lineData}/>
        <p className="mt-4 mb-2 text-star-dust-300 font-medium text-xs"> Events </p>
        <div className='h-28 w-full flex'>
        <Line options={{
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: {
              right: sizing.right,
              left: sizing.left
            }
          },
          scales: {
            x: {
              // max: data.frames.length - 1,
              border: {
                display: false
              },
              grid: {
                color: '#202328',
                lineWidth: 1
              },
              ticks: {
                color: '#99999900',
              }
            },
            y: {
              min: -1,
              max: 4,
              display: false
            }
          }
        }} data={{
          labels: labels,
          datasets: [
            {
              data: data.frames.map(() => {
                return {
                  x: 0,
                  r: 0,
                  y: 0
                }
              }),
              backgroundColor: red,
              borderWidth: 0,
              pointRadius: () => Math.random() * 10
            },
            {
              data: data.frames.map(() => {
                return {
                  x: 0,
                  r: 0,
                  y: 2
                }
              }),
              backgroundColor: blue,
              borderWidth: 0,
              pointRadius: () => Math.random() * 10
            }
          ] 
        }} />
        </div>
      </Card>
    </div>
  )
}

export default Timeline;