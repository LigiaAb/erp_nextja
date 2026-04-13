# Stepper Basico (`StepperRoot` + `StepItem`)

## Que Resuelve

Construir flujos por pasos con control de paso activo y click entre pasos.

## Snippet

```tsx
"use client";

import * as React from "react";
import { StepperRoot, StepItem } from "@/components/custom/Stepper";

export function StepperEjemplo() {
  const [step, setStep] = React.useState("datos");

  return (
    <StepperRoot value={step} onValueChange={setStep} allowStepClick>
      <StepItem value="datos" title="Datos" description="Informacion general" />
      <StepItem value="revision" title="Revision" description="Validar datos" />
      <StepItem value="confirmacion" title="Confirmacion" description="Finalizar proceso" />
    </StepperRoot>
  );
}
```

## Variante Con `steps`

```tsx
<StepperRoot
  value={step}
  onValueChange={setStep}
  steps={[
    { value: "datos", title: "Datos" },
    { value: "revision", title: "Revision" },
    { value: "confirmacion", title: "Confirmacion" },
  ]}
/>
```

