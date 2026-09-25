// Barrel export para @repo/ui.
//
// AGENTS.md §8: lo compartible vive aquí, no en apps/site/components/ui.
// Los subcomponentes compuestos (`Card.Header`, `Field.Group`, etc.) se
// exportan junto al componente principal en su archivo, así que este
// barrel solo necesita reexportar el símbolo principal.

export { UIProvider } from "./provider";
export { antdTheme } from "./theme";

// Wrappers (default) — preferir estos en apps/site.
export { Button } from "./button";
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "./card";
export { Input, TextArea } from "./input";
export { Select } from "./select";
export { UIDropdown } from "./dropdown";
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Collapse,
  CollapsePanel,
} from "./accordion";
export { Separator } from "./separator";
export {
  Field,
  FieldGroup,
  FieldSet,
  FieldLegend,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldTitle,
  FieldContent,
  FieldSeparator,
} from "./field";
export { cn } from "./utils";

// Crudos de antd — usar solo cuando el wrapper no llegue (charts, casos
// avanzados). Esto evita imports directos desde "antd" en apps/site.
export {
  AntButtonRaw,
  AntInputRaw,
  AntSelectRaw,
  AntDropdownRaw,
  AntCollapseRaw,
  AntDividerRaw,
} from "./index-raw";
