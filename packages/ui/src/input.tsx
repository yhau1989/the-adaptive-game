"use client";

// Input: envoltorio sobre antd Input. Conserva la API shadcn (pass-through
// de className y props estándar de <input>) y expone subcomponentes
// (.Password, .TextArea, .Search, .OTPCode) para que los call sites no
// tengan que importar "antd" directamente (AGENTS.md §6).

import type { ComponentProps } from "react";
import { Input as AntInput } from "antd";
import { cn } from "./utils";

type AntInputProps = ComponentProps<typeof AntInput>;

function InputRoot({ className, ...props }: AntInputProps) {
  return <AntInput className={cn("w-full", className)} {...props} />;
}

/**
 * API consolidada. Úsalo como:
 *   <Input />
 *   <Input.Password />
 *   <Input.TextArea />
 *   <Input.Search />
 */
export const Input = Object.assign(InputRoot, {
  Password: AntInput.Password,
  TextArea: AntInput.TextArea,
  Search: AntInput.Search,
  OTP: AntInput.OTP,
});

// Re-export directo de TextArea para los call sites que ya lo importan con
// ese nombre (game-create-form.tsx usa `<Textarea />` con la "a" minúscula).
export const TextArea = AntInput.TextArea;

// Raw de antd para usos avanzados (charts, casos especiales).
export { AntInput as AntInputRaw };
