import * as React from "react";
import { cn } from "@/lib/utils";
import { StepCtx, StepItemProps, StepperRootProps, StepStatus, StepValue } from "@/types/components/stepper";

const StepperCtx = React.createContext<StepCtx | null>(null);

function useStepperCtx() {
  const ctx = React.useContext(StepperCtx);
  if (!ctx) throw new Error("StepItem must be used inside StepperRoot");
  return ctx;
}

export function StepperRoot({ value, onValueChange, allowStepClick = true, labelHorizontal = false, orientation = "horizontal", className, steps, children }: StepperRootProps) {
  const stepsOrder = React.useMemo(() => {
    if (steps?.length) return steps.map((s) => s.value);

    const arr: StepValue[] = [];
    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) return;
      // @ts-expect-error leer prop value del StepItem
      const v = child.props?.value as StepValue | undefined;
      if (v !== undefined) arr.push(v);
    });
    return arr;
  }, [steps, children]);

  React.useEffect(() => {
    if (steps?.length && React.Children.count(children) > 0) {
      console.warn("[Stepper] Se recibieron 'steps' y 'children'. Se usará 'steps' y se ignorarán los children.");
    }
  }, [steps, children]);

  const ctx = React.useMemo<StepCtx>(
    () => ({
      value,
      onValueChange,
      allowStepClick,
      labelHorizontal,
      orientation,
      stepsOrder,
    }),
    [value, onValueChange, allowStepClick, labelHorizontal, orientation, stepsOrder],
  );

  const renderedChildren = React.useMemo(() => {
    const nodes = React.Children.toArray(children).filter(Boolean);
    const out: React.ReactNode[] = [];

    nodes.forEach((node, i) => {
      out.push(node);
      if (i !== nodes.length - 1) out.push(<StepperConnector key={`c-${i}`} index={i} />);
    });

    return out;
  }, [children]);

  const cols = Math.max(1, stepsOrder.length * 2 - 1);
  const isVertical = orientation === "vertical";

  return (
    <StepperCtx.Provider value={ctx}>
      <div className={cn("w-full", className)}>
        <ol className={cn("w-full gap-3", isVertical ? "grid grid-cols-1" : "grid items-center")} style={isVertical ? undefined : { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {steps?.length
            ? steps.flatMap((s, i) => [
                <StepItem key={s.value} value={s.value} title={s.title} description={s.description} icon={s.icon} disabled={s.disabled} onClick={s.onClick} status={s.status} />,
                i !== steps.length - 1 ? <StepperConnector key={`${s.value}-c`} index={i} /> : null,
              ])
            : renderedChildren}
        </ol>
      </div>
    </StepperCtx.Provider>
  );
}

export const Stepper = StepperRoot;

function StepperConnector({ index }: { index: number }) {
  const ctx = useStepperCtx();
  const currentIndex = Math.max(
    0,
    ctx.stepsOrder.findIndex((v) => v === ctx.value),
  );
  const done = index < currentIndex;
  const isVertical = ctx.orientation === "vertical";

  return <span aria-hidden="true" className={cn("rounded bg-muted", done && "bg-primary", isVertical ? "mx-auto h-8 w-0.5" : "h-0.5 w-full")} />;
}

export function StepItem({ value, title, description, icon, disabled, onClick, status, className }: StepItemProps) {
  const ctx = useStepperCtx();

  const currentIndex = Math.max(
    0,
    ctx.stepsOrder.findIndex((v) => v === ctx.value),
  );
  const myIndex = ctx.stepsOrder.findIndex((v) => v === value);

  const derived: StepStatus = myIndex < 0 ? "todo" : myIndex < currentIndex ? "done" : myIndex === currentIndex ? "active" : "todo";

  const state: StepStatus = status ?? derived;
  const clickable = ctx.allowStepClick && !!ctx.onValueChange && !disabled;
  const isVertical = ctx.orientation === "vertical";

  return (
    <li className={cn("min-w-0", className)}>
      <button
        type="button"
        disabled={!clickable}
        aria-current={state === "active" ? "step" : undefined}
        onClick={() => {
          if (!clickable) return;
          onClick?.();
          ctx.onValueChange?.(value);
        }}
        className={cn(
          "w-full h-full flex items-center gap-3 p-3 rounded-2xl",
          clickable && "hover:bg-primary/20",
          isVertical ? "justify-center items-center text-center" : ctx.labelHorizontal ? "justify-start text-left" : "flex-col justify-center text-center",
          disabled && "opacity-50",
        )}
      >
        <span
          className={cn(
            "grid place-items-center rounded-full border text-sm font-medium shrink-0 text-foreground",
            icon ? "p-1" : "size-9",
            state === "done" && "bg-primary text-primary-foreground border-primary",
            state === "active" && "bg-secondary text-secondary-foreground",
            state === "todo" && "text-muted-foreground",
            state === "error" && "bg-destructive text-destructive-foreground border-destructive",
          )}
        >
          {icon ?? (myIndex >= 0 ? myIndex + 1 : 1)}
        </span>

        <span className={cn("min-w-0", isVertical || ctx.labelHorizontal ? "text-left" : "text-center")}>
          {title ? <span className="block text-sm font-medium text-foreground!">{title}</span> : null}
          {description ? <span className="block text-xs text-muted-foreground truncate">{description}</span> : null}
        </span>
      </button>
    </li>
  );
}
