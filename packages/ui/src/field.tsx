"use client";

// Field: layout-only wrappers (sin antd). Replican la API shadcn para que
// el form (react-hook-form) siga siendo presentacional: spacing, label,
// descripción y mensaje de error. La integración con Form.Item de antd
// queda fuera de scope — react-hook-form ya gestiona la validación.
//
// Cada sub-componente aplica solo clases Tailwind; nada se monta sobre
// antd aquí, así el `Field` funciona aunque antd no haya terminado de
// hidratarse.

import type { ComponentProps, ReactNode } from "react";
import { useMemo } from "react";
import { cn } from "./utils";

type FieldProps = ComponentProps<"div"> & {
  orientation?: "vertical" | "horizontal" | "responsive";
  children?: ReactNode;
};

function FieldRoot({
  className,
  orientation = "vertical",
  children,
  ...props
}: FieldProps) {
  const orientationClass =
    orientation === "horizontal"
      ? "flex-row items-center"
      : orientation === "responsive"
        ? "flex-col @md:flex-row @md:items-center"
        : "flex-col";

  return (
    <div
      role="group"
      data-orientation={orientation}
      className={cn(
        "group/field flex w-full gap-3",
        orientationClass,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type FieldGroupProps = ComponentProps<"div"> & {
  children?: ReactNode;
};

function FieldGroup({ className, children, ...props }: FieldGroupProps) {
  return (
    <div className={cn("flex w-full flex-col gap-7", className)} {...props}>
      {children}
    </div>
  );
}

type FieldSetProps = ComponentProps<"fieldset"> & {
  children?: ReactNode;
};

function FieldSet({ className, children, ...props }: FieldSetProps) {
  return (
    <fieldset
      className={cn(
        "flex flex-col gap-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </fieldset>
  );
}

type FieldLegendProps = ComponentProps<"legend"> & {
  children?: ReactNode;
};

function FieldLegend({ className, children, ...props }: FieldLegendProps) {
  return (
    <legend
      className={cn("mb-3 text-base font-medium text-slate-900", className)}
      {...props}
    >
      {children}
    </legend>
  );
}

type FieldLabelProps = ComponentProps<"label"> & {
  children?: ReactNode;
};

function FieldLabel({ className, children, ...props }: FieldLabelProps) {
  return (
    <label
      className={cn(
        "text-sm font-medium leading-none text-slate-700",
        className,
      )}
      {...props}
    >
      {children}
    </label>
  );
}

type FieldDescriptionProps = ComponentProps<"p"> & {
  children?: ReactNode;
};

function FieldDescription({
  className,
  children,
  ...props
}: FieldDescriptionProps) {
  return (
    <p
      className={cn("text-sm font-normal text-slate-500", className)}
      {...props}
    >
      {children}
    </p>
  );
}

type FieldErrorProps = ComponentProps<"div"> & {
  children?: ReactNode;
  errors?: Array<{ message?: string } | undefined>;
};

function FieldError({
  className,
  children,
  errors,
  ...props
}: FieldErrorProps) {
  const content = useMemo(() => {
    if (children) return children;
    if (!errors?.length) return null;
    const unique = [
      ...new Map(errors.map((e) => [e?.message, e])).values(),
    ] as Array<{ message?: string } | undefined>;
    if (unique.length === 1) return unique[0]?.message ?? null;
    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {unique.map(
          (error, i) => error?.message && <li key={i}>{error.message}</li>,
        )}
      </ul>
    );
  }, [children, errors]);

  if (!content) return null;

  return (
    <div
      role="alert"
      className={cn("text-xs font-normal text-red-600", className)}
      {...props}
    >
      {content}
    </div>
  );
}

type FieldTitleProps = ComponentProps<"div"> & {
  children?: ReactNode;
};

function FieldTitle({ className, children, ...props }: FieldTitleProps) {
  return (
    <div
      className={cn(
        "flex w-fit items-center gap-2 text-sm font-medium leading-snug",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type FieldContentProps = ComponentProps<"div"> & {
  children?: ReactNode;
};

function FieldContent({ className, children, ...props }: FieldContentProps) {
  return (
    <div
      className={cn("flex flex-1 flex-col gap-1.5 leading-snug", className)}
      {...props}
    >
      {children}
    </div>
  );
}

type FieldSeparatorProps = ComponentProps<"div"> & {
  children?: ReactNode;
};

function FieldSeparator({
  className,
  children,
  ...props
}: FieldSeparatorProps) {
  return (
    <div className={cn("relative -my-2 h-5 text-sm", className)} {...props}>
      <div className="absolute inset-x-0 top-1/2 border-t border-slate-200" />
      {children ? (
        <span className="relative mx-auto block w-fit bg-white px-2 text-slate-500">
          {children}
        </span>
      ) : null}
    </div>
  );
}

export const Field = Object.assign(FieldRoot, {
  Group: FieldGroup,
  Set: FieldSet,
  Legend: FieldLegend,
  Label: FieldLabel,
  Description: FieldDescription,
  Error: FieldError,
  Title: FieldTitle,
  Content: FieldContent,
  Separator: FieldSeparator,
});

export {
  FieldGroup,
  FieldSet,
  FieldLegend,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldTitle,
  FieldContent,
  FieldSeparator,
};
