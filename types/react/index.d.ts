export type ElementType = string | ((props: any) => any);
export type ComponentPropsWithRef<T extends ElementType> = any;
export type ReactElement = any;
export function createElement(type: any, props: any, ...children: any[]): ReactElement;
export function forwardRef<T, P = {}>(render: (props: P, ref: any) => ReactElement): any;
