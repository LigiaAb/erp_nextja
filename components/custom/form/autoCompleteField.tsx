"use client";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import clsx from "clsx";

import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";

type Key = string | number;

type Props<T> = {
  id: string;
  label: string;
  options: T[];
  value: T | null;
  onChange: (value: T | null) => void;

  getOptionValue: (option: T) => Key;
  getOptionLabel: (option: T) => string;

  placeholder?: string;
  errors?: { message: string }[];
  searchFields?: (keyof T)[];

  // ✅ libertad de diseño (pero sin romper handlers)
  fieldProps?: React.ComponentProps<typeof Field>;
  labelProps?: React.ComponentProps<typeof FieldLabel>;
  errorProps?: Omit<React.ComponentProps<typeof FieldError>, "errors">;

  inputGroupProps?: React.ComponentProps<typeof InputGroup>;
  inputProps?: Omit<React.ComponentProps<typeof InputGroupInput>, "id" | "readOnly" | "value" | "placeholder">;
  addonProps?: React.ComponentProps<typeof InputGroupAddon>;

  popoverProps?: Omit<React.ComponentProps<typeof Popover>, "open" | "onOpenChange">;
  popoverContentProps?: React.ComponentProps<typeof PopoverContent>;

  commandProps?: React.ComponentProps<typeof Command>;
  commandInputProps?: React.ComponentProps<typeof CommandInput>;
  commandGroupProps?: React.ComponentProps<typeof CommandGroup>;
  commandEmptyProps?: React.ComponentProps<typeof CommandEmpty>;
};

export const AutoCompleteField = <T,>({
  id,
  label,
  options,
  value,
  onChange,
  getOptionValue,
  getOptionLabel,
  searchFields = [],
  placeholder = "Seleccionar...",
  errors = [],

  fieldProps,
  labelProps,
  errorProps,

  inputGroupProps,
  inputProps,
  addonProps,

  popoverProps,
  popoverContentProps,

  commandProps,
  commandInputProps,
  commandGroupProps,
  commandEmptyProps,
}: Props<T>) => {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const selectedLabel = value ? getOptionLabel(value) : "";

  // helper para mergear handlers sin pisarlos
  const callAll =
    <E,>(...fns: Array<((e: E) => void) | undefined>) =>
    (e: E) =>
      fns.forEach((fn) => fn?.(e));

  const norm = (s: unknown) =>
    String(s ?? "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const filteredOptions = React.useMemo(() => {
    const q = norm(query).trim();
    if (!q) return options;

    return options.filter((opt) => {
      const key = String(getOptionValue(opt));
      const optLabel = getOptionLabel(opt);
      const extras = searchFields.map((f) => String(opt[f] ?? ""));
      const haystack = norm([optLabel, key, ...extras].join(" "));
      return haystack.includes(q);
    });
  }, [options, query, getOptionValue, getOptionLabel, searchFields]);

  return (
    <Field {...fieldProps}>
      <FieldLabel htmlFor={id} {...labelProps}>
        {label}
      </FieldLabel>

      <Popover open={open} onOpenChange={setOpen} {...popoverProps}>
        {/* anchor */}
        <PopoverAnchor asChild>
          <div>
            <InputGroup {...inputGroupProps}>
              <InputGroupInput
                id={id}
                readOnly
                value={selectedLabel}
                placeholder={placeholder}
                // ✅ tu lógica intacta + permite custom handler
                onMouseDown={callAll<React.MouseEvent<HTMLInputElement>>((e) => {
                  e.preventDefault();
                  setOpen(true);
                }, inputProps?.onMouseDown)}
                {...inputProps}
              />

              <InputGroupAddon
                className={clsx("cursor-pointer", addonProps?.className)}
                // ✅ tu lógica intacta + permite custom handler
                onMouseDown={callAll<React.MouseEvent<HTMLDivElement>>((e) => {
                  e.preventDefault();
                  setOpen((prev) => !prev);
                }, addonProps?.onMouseDown)}
                {...addonProps}
              >
                {addonProps?.children ?? <ChevronsUpDown className="h-4 w-4" />}
              </InputGroupAddon>
            </InputGroup>
          </div>
        </PopoverAnchor>

        <PopoverContent
          align="start"
          className={clsx("w-[--radix-popover-trigger-width] p-0", popoverContentProps?.className)}
          onOpenAutoFocus={callAll<Event>((e) => e.preventDefault(), popoverContentProps?.onOpenAutoFocus)}
          onCloseAutoFocus={callAll<Event>((e) => e.preventDefault(), popoverContentProps?.onCloseAutoFocus)}
          {...popoverContentProps}
        >
          <Command {...commandProps} shouldFilter={false}>
            <div className="flex items-center border-b px-3">
              <CommandInput placeholder="Buscar..." {...commandInputProps} value={query} onValueChange={(v: string) => setQuery(v)} />
            </div>

            <CommandEmpty {...commandEmptyProps}>No encontrado</CommandEmpty>

            <CommandGroup {...commandGroupProps}>
              {filteredOptions.map((opt) => {
                const key = String(getOptionValue(opt));
                const isSelected = value ? String(getOptionValue(value)) === key : false;

                return (
                  <CommandItem
                    key={key}
                    value={key}
                    // ✅ tu preventDefault intacto + permite custom handler
                    onMouseDown={callAll<React.MouseEvent>(
                      (e) => e.preventDefault(),
                      undefined, // (CommandItem no siempre tipa onMouseDown; lo dejo explícito abajo)
                    )}
                    onSelect={(currentValue: string) => {
                      const selected = options.find((o) => String(getOptionValue(o)) === currentValue) ?? null;
                      onChange(selected);
                      setOpen(false);
                      setQuery("");
                    }}
                  >
                    {getOptionLabel(opt)}
                    {isSelected && <Check className="ml-auto h-4 w-4" />}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <FieldError errors={errors} {...errorProps} />
    </Field>
  );
};

export default AutoCompleteField;
