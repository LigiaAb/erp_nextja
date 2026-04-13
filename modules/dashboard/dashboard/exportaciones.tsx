"use client";

import React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const treeChartData = [
  { name: "Ventas", size: 40000, fill: "var(--color-chart-1)" },
  { name: "Compras", size: 3000, fill: "var(--color-chart-2)" },
  { name: "RRHH", size: 2000, fill: "var(--color-chart-3)" },
  { name: "Inventario", size: 2780, fill: "var(--color-chart-4)" },
  { name: "Finanzas", size: 1890, fill: "var(--color-chart-5)" },
  { name: "TI", size: 2390, fill: "var(--color-chart-6)" },
  { name: "TI", size: 2390, fill: "var(--color-chart-7)" },
  { name: "TI", size: 2390, fill: "var(--color-chart-8)" },
  { name: "TI", size: 2390, fill: "var(--color-chart-9)" },
  { name: "TI", size: 2390, fill: "var(--color-chart-10)" },
  { name: "TI", size: 2390, fill: "var(--color-chart-11)" },
  { name: "TI", size: 2390, fill: "var(--color-chart-12)" },
];

const donutChartData = [
  { estado: "Pendiente", valor: 24, fill: "var(--color-pendiente)" },
  { estado: "Aprobado", valor: 48, fill: "var(--color-aprobado)" },
  { estado: "Rechazado", valor: 12, fill: "var(--color-rechazado)" },
  { estado: "Finanzas", valor: 18, fill: "var(--color-chart-5)" },
  { estado: "TI", valor: 20, fill: "var(--color-chart-6)" },
  { estado: "TI1", valor: 20, fill: "var(--color-chart-7)" },
  { estado: "TI2", valor: 20, fill: "var(--color-chart-8)" },
  { estado: "TI3", valor: 20, fill: "var(--color-chart-9)" },
  { estado: "TI4", valor: 23, fill: "var(--color-chart-10)" },
  { estado: "TI5", valor: 20, fill: "var(--color-chart-11)" },
  { estado: "TI6", valor: 20, fill: "var(--color-chart-12)" },
];

const lineChartData = [
  { mes: "Ene", ventas: 120, compras: 80, gastos: 60, test: 123 },
  { mes: "Feb", ventas: 210, compras: 140, gastos: 90, test: 23 },
  { mes: "Mar", ventas: 180, compras: 160, gastos: 110, test: 123 },
  { mes: "Abr", ventas: 260, compras: 170, gastos: 120, test: 13 },
  { mes: "May", ventas: 300, compras: 200, gastos: 150, test: 123 },
  { mes: "Jun", ventas: 300, compras: 200, gastos: 150, test: 13 },
];

const donutChartConfig = {
  valor: {
    label: "Cantidad",
  },
  pendiente: {
    label: "Pendiente",
    color: "var(--color-chart-1)",
  },
  aprobado: {
    label: "Aprobado",
    color: "var(--color-chart-2)",
  },
  rechazado: {
    label: "Rechazado",
    color: "var(--color-chart-3)",
  },
} satisfies ChartConfig;

const lineChartConfig = {
  ventas: {
    label: "Ventas",
    color: "var(--color-chart-1)",
  },
  compras: {
    label: "Compras",
    color: "var(--color-chart-2)",
  },
  gastos: {
    label: "Gastos",
    color: "var(--color-chart-3)",
  },
  test: {
    label: "Test",
    color: "var(--color-chart-4)",
  },
} satisfies ChartConfig;

type SerieKey = "ventas" | "compras" | "gastos" | "test";

type TreemapNodeProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  fill?: string;
};

export function TreemapExample() {
  const renderCustomNode = (props: TreemapNodeProps) => {
    const { x = 0, y = 0, width = 0, height = 0, name = "", fill } = props;

    const rx = Math.round(x);
    const ry = Math.round(y);
    const rwidth = Math.round(width);
    const rheight = Math.round(height);

    if (rwidth < 40 || rheight < 24) return null;

    return (
      <g>
        <rect x={rx} y={ry} width={rwidth} height={rheight} fill={fill ?? "var(--color-chart-1)"} stroke="white" rx={4} />
        <text x={rx + 8} y={ry + 18} fill="#ffffff" stroke="transparent" fontSize={14} fontWeight={200} textRendering="geometricPrecision">
          {name}
        </text>
      </g>
    );
  };

  return (
    <div className="h-80 w-full rounded-xl border p-4">
      <ResponsiveContainer width="100%" height="100%">
        <Treemap isAnimationActive={false} data={treeChartData} dataKey="size" nameKey="name" aspectRatio={4 / 3} stroke="hsl(var(--border))" fill="hsl(var(--primary))" content={renderCustomNode}>
          <Tooltip />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
}

export function DonutExample() {
  return (
    <ChartContainer config={donutChartConfig} className="w-200">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="estado" />} />
        <ChartLegend content={<ChartLegendContent nameKey="estado" />} />
        <Pie isAnimationActive={false} data={donutChartData} dataKey="valor" nameKey="estado" innerRadius={70} outerRadius={110} paddingAngle={4}>
          <Cell fill="var(--color-pendiente)" />
          <Cell fill="var(--color-aprobado)" />
          <Cell fill="var(--color-rechazado)" />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
type TailwindHeight = "h-auto" | "h-full" | "h-screen" | `h-${number}` | `h-[${string}]`;

export function GraficaLineas({ className, height = "h-[200px]" }: { className?: string; height?: TailwindHeight }) {
  const [visible, setVisible] = React.useState<Record<SerieKey, boolean>>({
    ventas: true,
    compras: true,
    gastos: true,
    test: true,
  });

  const toggleSerie = (key: SerieKey) => {
    setVisible((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className={cn("w-[90%]", className)}>
      <div className="flex flex-wrap gap-2">
        {(["ventas", "compras", "gastos", "test"] as SerieKey[]).map((key) => (
          <Button
            key={key}
            type="button"
            onClick={() => toggleSerie(key)}
            className={["rounded-md px-3 py-1.5 bg-transparent hover:bg-transparent text-sm transition", visible[key] ? "text-foreground" : ""].join(" ")}
          >
            <span className="px-5 py-1 border-4" style={{ borderColor: lineChartConfig[key].color }} /> <span className={visible[key] ? "" : "line-through"}>{lineChartConfig[key].label}</span>
          </Button>
        ))}
      </div>

      <ChartContainer config={lineChartConfig} className={cn("w-full", height)}>
        <LineChart data={lineChartData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="mes" tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip content={<ChartTooltipContent />} />

          <Line isAnimationActive={false} dataKey="ventas" type="monotone" stroke="var(--color-ventas)" strokeWidth={3} dot={false} hide={!visible.ventas} />

          <Line isAnimationActive={false} dataKey="compras" type="monotone" stroke="var(--color-compras)" strokeWidth={3} dot={false} hide={!visible.compras} />

          <Line isAnimationActive={false} dataKey="gastos" type="monotone" stroke="var(--color-gastos)" strokeWidth={3} dot={false} hide={!visible.gastos} />

          <Line isAnimationActive={false} dataKey="test" type="monotone" stroke="var(--color-test)" strokeWidth={3} dot={false} hide={!visible.test} />
        </LineChart>
      </ChartContainer>
    </div>
  );
}

export function GraficaVentas() {
  return (
    <div className="flex min-w-full max-w-full px-5 flex-col justify-center items-center">
      <div className="flex-5">
        <GraficaLineas className="w-[90%] " />
        <div className="flex w-full">filtro Tipo transporte</div>
        <div className="flex w-full">
          <GraficaLineas className="w-[50%]" height="h-90" />
          <DonutExample />
        </div>
        <div className="flex w-full">
          <TreemapExample />
        </div>
      </div>
    </div>
  );
}
