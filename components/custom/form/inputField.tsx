"use client";

import React from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { X } from "lucide-react";
import clsx from "clsx";

type Props = {
  id: string;
  label: string;

  value: string;
  onChange: (value: string) => void;

  color?: string;

  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;

  errors?: { message: string }[];

  fieldProps?: React.ComponentProps<typeof Field>;
  labelProps?: React.ComponentProps<typeof FieldLabel>;
  errorProps?: Omit<React.ComponentProps<typeof FieldError>, "errors">;

  inputGroupProps?: React.ComponentProps<typeof InputGroup>;
  inputProps?: Omit<React.ComponentProps<typeof InputGroupInput>, "id" | "value" | "onChange" | "type" | "placeholder">;

  // izquierda
  addonProps?: React.ComponentProps<typeof InputGroupAddon>;

  // derecha (addon contenedor)
  endAddonProps?: React.ComponentProps<typeof InputGroupAddon>;

  // props del botón clear
  clearButtonProps?: React.ComponentProps<typeof InputGroupButton>;

  // permite apagar el clear
  clearable?: boolean;

  // permite el autofoco
  autoFocus?: boolean;

  // permite el evento de foco
  onFocus?: (ev: React.FocusEvent<HTMLInputElement>) => void;
  // permite el evento de blur
  onBlur?: (ev: React.FocusEvent<HTMLInputElement>) => void;
};

const InputField = ({
  id,
  label,

  value,
  onChange,

  color,

  type = "text",
  placeholder,

  errors = [],

  fieldProps,
  labelProps,
  errorProps,

  inputGroupProps,
  inputProps,
  addonProps,

  endAddonProps,
  clearButtonProps,

  clearable = true,

  autoFocus,

  onFocus,
  onBlur,
}: Props) => {
  const canClear = clearable && value.length > 0;

  const [isFocused, setIsFocused] = React.useState(false);

  const float = isFocused || canClear;

  const clearInput = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    onChange("");
  };

  const labelConfig = {
    base: [
      "pointer-events-none absolute z-10",
      `top-1/2 -translate-y-1/2`,
      "inline-flex w-fit max-w-[calc(100%-3.25rem)] truncate",
      "px-1 text-sm text-muted-foreground",
      "transition-all duration-300 rounded-[3px]",
      "left-[var(--icon-space)] w-full",
    ].join(" "),
    floating: [`left-2 -top-4 -translate-y-1/4 text-xs`, `text-[color:var(--label-tx)]`, `bg-[var(--label-bg)]`].join(" "),
  };

  const labelStyle = React.useMemo(
    () =>
      ({
        "--label-bg": color ? `color-mix(in srgb, var(--color-${color}) 100%, transparent)` : "transparent",
        "--label-tx": color ? `var(--color-${color}-foreground)` : "currentColor",
        "--icon-space": addonProps?.children ? "2.5rem" : "0.5rem",
      }) as React.CSSProperties,
    [color, addonProps?.children],
  );

  // React.useEffect(() => {
  //   console.log(value);
  // }, [value]);

  return (
    <Field {...fieldProps} className={`relative ${fieldProps?.className}`}>
      <InputGroup {...inputGroupProps}>
        <FieldLabel htmlFor={id} style={labelStyle} className={[labelConfig.base, float ? labelConfig.floating : "", labelProps?.className ?? ""].join(" ")} {...labelProps}>
          {label}
        </FieldLabel>
        <InputGroupInput
          autoFocus={autoFocus}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          id={id}
          name={id}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          {...inputProps}
        />

        {/* left addon */}
        {addonProps?.children ? <InputGroupAddon {...addonProps} /> : null}

        {/* right addon */}
        <InputGroupAddon {...endAddonProps} className={clsx(endAddonProps?.className, "gap-1")} align="inline-end">
          {endAddonProps?.children}
          <InputGroupButton
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="Clear input"
            // ✅ evita blur / efectos raros
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              clearButtonProps?.onClick?.(e);
              clearInput(e);
            }}
            disabled={!canClear || clearButtonProps?.disabled}
            {...clearButtonProps}
            className={` hover:bg-transparent hover:text-destructive cursor-pointer ${clearButtonProps?.className}`}
          >
            <X className="h-4 w-4" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      <FieldError {...errorProps} errors={errors} />
    </Field>
  );
};

export default InputField;
