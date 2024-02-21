import Card from "@renderer/core/Card";
import { Asset } from "@renderer/util/asset";
import { ResponsiveContainer, BarChart as ReBarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell } from "recharts";


type Data = {
  label: string,
  value: number,
  color: string
}

export type BarChartProps = {
  label: string,
  data: Data[],
  height: number
}

export const BarChart = ({ data, height, label }: BarChartProps) => {

  const CustomTick = (props: { x: number, y: number, payload: { index: number, value: string } }) => {
    const { x, y, payload } = props;
  
    return (
      <g transform={`translate(${x},${y})`}>
        <defs >
          <clipPath id="rounded">
            <rect width={36} height={36} rx={18} ry={18} x={-18} y={8}/>
          </clipPath>
        </defs>
        <image x={-18} y={8} width={36} height={36} href={Asset.champion(payload.value)} clipPath="url(#rounded)"/>
        <circle cx="0" cy="26" r="18" fill="none" stroke={data[payload.index].color} strokeWidth="2"/>
      </g>
    );
  };

  const tickFormatter = (num: number) => num >= 1000 ? `${Math.round(num / 1000)}K` : num.toString();

  return (
    <Card className="pl-0">
      <p className="pl-5 mb-4 text-star-dust-300 uppercase font-medium text-xs"> { label } </p>
      <ResponsiveContainer width="100%" height={height}>
        <ReBarChart data={data} margin={{ bottom: 32, top: 16, right: 8 }} maxBarSize={16}>
          <CartesianGrid vertical={false} stroke="#202328"/>
          <XAxis dataKey="label" tickLine={false} tick={CustomTick} interval={0} axisLine={false}/>
          <YAxis interval={0} tickLine={false} axisLine={false} tick={{ fill: '#999999' }} tickFormatter={tickFormatter}/>
          <Tooltip
          cursor={{ fill: '#1D2024' }}
          itemStyle={{
            color: "#D1D1D1",
            fontWeight: 400
          }}
          contentStyle={{
            backgroundColor: "#22262B",
            borderRadius: 8,
            border: "none",
            color: "#D1D1D1",
            fontSize: 14,
            fontWeight: 700
          }}/>
          <Bar dataKey="value">
            { data.map((_, index) => (
              <Cell key={index} fill={data[index].color}/>
            ))}
          </Bar>
        </ReBarChart>
      </ResponsiveContainer>
    </Card>
  )
}
