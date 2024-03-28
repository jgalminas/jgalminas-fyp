import { FunctionComponent, SVGProps } from "react";

export type SVGRIcon = FunctionComponent<SVGProps<SVGSVGElement>> & { title?: string | undefined };

export type HTMLDataAttributes = {
  [key in `data-${string}`]: string | number | boolean
}
