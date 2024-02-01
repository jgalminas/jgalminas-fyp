import Card from '@renderer/core/Card';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  ChartData,
  ChartOptions,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

export const options: ChartOptions<"line"> = {
  responsive: true,
  // maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    }
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
        callback: (value) => Number(value) / 1000 + "K",
        color: '#999999'
      }
    }
  }
};

const Timeline = () => {

  const labels = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  const teamBlue = "#0068CA";
  const teamRed = "#FF3B3A";

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
      const [col_p0, col_p1] =
        y0 > 0 ? [teamBlue, teamRed] : [teamRed, teamBlue];
      gradient.addColorStop(0, col_p0);
      gradient.addColorStop(frac, col_p0);
      gradient.addColorStop(frac, col_p1);
      gradient.addColorStop(1, col_p1);
      return gradient;
    }
    return ctx.p0.parsed.y >= 0 ? teamBlue : teamRed;
  };


  const data: ChartData<"line", number[], string> = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: [0, 100, 0, 3000, -1000, 500, -400, -200, 0],
        segment: {
          borderColor: caculateLineColor
        },
        pointBackgroundColor: (context) => {
          const y = context.parsed.y;
          if (y > 0) {
            return teamBlue;
          } else if (y < 0) {
            return teamRed;
          } else {
            return '#6D6D6D'
          }          
        },
        pointRadius: 4,
        fill: {
          target: 'origin',
          below: '#FF3B3A11',
          above: '#0068CA11'
        }
      }
    ],
  };

  return (
    <div>
      <Card className='relative flex overflow-x-hidden aspect-video flex flex-col'>
        <p className="mb-4 text-star-dust-300 uppercase font-medium text-xs"> Team Damage Distribution </p>
        <Line options={options} data={data}/>
      </Card>
    </div>
  )
}

export default Timeline;