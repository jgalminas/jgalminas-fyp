import { MatchWithGoldFrames } from "@fyp/types";
import { msToLength } from "@renderer/util/time";
import {
  ChartData,
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  ChartOptions,
  ScriptableLineSegmentContext,
  Chart
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

export type GoldAdvantageChartProps = {
  data: MatchWithGoldFrames
}

export const GoldAdvantageChart = ({ data }: GoldAdvantageChartProps) => {

  const blue = data.winningTeam === 'BLUE' ? "#0068CA" : '#FF3B3A';
  const red = data.winningTeam !== 'BLUE' ? "#0068CA" : '#FF3B3A';

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      tooltip: {
        backgroundColor: '#22262B',
        padding: 16,
        callbacks: {
          title: (data) => {
            if (data.length <= 0) return;
            return `At minute ${data[0].label}`;
          },
          label: (context) => {
            const red = data.winningTeam === "BLUE" ? "Blue" : "Red";
            const blue = data.winningTeam !== "BLUE" ? "Blue" : "Red";
            const value = context.raw as number;
            return `${value > 0 ? red : blue} team was ahead by ${context.formattedValue.replace("-", "")} gold`
          }
        }
      },
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
          color: (context) => {
            if (context.tick.value === 0) {
              return '#3C3E42';
            }
            return '#202328'
          }
        },
        ticks: {
          callback: (value) => value !== 0 ? Number(value) / 1000 + "K": "0",
          color: '#999999'
        }
      }
    }
  };

  const caculateLineColor = (ctx: ScriptableLineSegmentContext & { chart: Chart<"line">}) => {
    if (ctx.p0.parsed.y * ctx.p1.parsed.y < 0) {
      const x0 = ctx.p0.parsed.x,
        x1 = ctx.p1.parsed.x,
        y0 = ctx.p0.parsed.y,
        y1 = ctx.p1.parsed.y,
        dataset = ctx.chart.data.datasets[ctx.datasetIndex],
        //identify the correct axes used for the dataset
        xAxisId = dataset.xAxisID ?? "x",
        yAxisId = dataset.yAxisID ?? "y",
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

  const chartData: ChartData<"line", number[], string> = {
    labels: data.frames.map((fr) => msToLength(fr.timestamp)),
    datasets: [
      {
        data: data.frames.map((fr) => data.winningTeam === 'RED' ? fr.redGold - fr.blueGold : fr.blueGold - fr.redGold),
        segment: {
          // @ts-expect-error
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
    <Line options={options} data={chartData}/>
  )
}
