export type StepValue = string | number;
export type StepStatus = "done" | "active" | "todo" | "error";

export type Step = {
  value: StepValue;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  status?: StepStatus;
  [key: string]: unknown;
};

export type StepOrientation = "horizontal" | "vertical";

export type StepCtx = {
  value: StepValue;
  onValueChange?: (value: StepValue) => void;
  allowStepClick: boolean;
  labelHorizontal: boolean;
  orientation: StepOrientation;
  stepsOrder: StepValue[];
};

export type StepperRootProps = {
  value: StepValue;
  onValueChange?: (value: StepValue) => void;
  allowStepClick?: boolean;
  labelHorizontal?: boolean;
  orientation?: "horizontal" | "vertical";
  className?: string;
  steps?: Step[];
  children?: React.ReactNode;
};

export type StepItemProps = {
  value: StepValue;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  status?: StepStatus;
  className?: string;
};
