import { createElement, forwardRef } from "react";
import type {
  ComponentPropsWithRef,
  ElementType,
  ReactElement,
} from "react";
import clsx, { type ClassValue } from "clsx";

const BASE_KEY = "base" as const;

export type GroupedClassList = Record<string, ClassValue>;

export type ComponentFactoryConfig = {
  [BASE_KEY]?: GroupedClassList;
} & Record<string, GroupedClassList>;

type VariantKeys<Variants extends ComponentFactoryConfig> = Exclude<keyof Variants, typeof BASE_KEY> & string;

type Simplify<T> = { [Key in keyof T]: T[Key] } & {};

type VariantProps<Variants extends ComponentFactoryConfig> = Simplify<
  Partial<Record<VariantKeys<Variants>, boolean>>
>;

type PolymorphicComponentProps<
  Variants extends ComponentFactoryConfig,
  Element extends ElementType
> = Simplify<
  VariantProps<Variants> &
    Omit<ComponentPropsWithRef<Element>, keyof VariantProps<Variants> | "as" | "className"> & {
      as?: Element;
      className?: string;
    }
>;

export type ComponentFactory<
  Variants extends ComponentFactoryConfig,
  DefaultElement extends ElementType
> = {
  <Element extends ElementType = DefaultElement>(
    props: PolymorphicComponentProps<Variants, Element>
  ): ReactElement | null;
  displayName?: string;
};

function collectClasses(config?: GroupedClassList): ClassValue[] {
  if (!config) {
    return [];
  }

  return Object.values(config);
}

export function c<
  Variants extends ComponentFactoryConfig,
  DefaultElement extends ElementType = "div"
>(config: Variants, defaultElement?: DefaultElement): ComponentFactory<Variants, DefaultElement> {
  const variantKeys = (Object.keys(config) as Array<keyof Variants>).filter(
    (key): key is VariantKeys<Variants> => key !== BASE_KEY
  );
  const variantKeySet = new Set<string>(variantKeys as string[]);
  const defaultTag = defaultElement ?? ("div" as DefaultElement);

  const Component = forwardRef<unknown, PolymorphicComponentProps<Variants, ElementType>>(
    ({ as, className, ...rest }, ref) => {
      const element = (as ?? defaultTag) as ElementType;
      const variantProps: Partial<Record<VariantKeys<Variants>, boolean>> = {};
      const otherProps: Record<string, unknown> = {};

      for (const key of Object.keys(rest)) {
        if (variantKeySet.has(key)) {
          variantProps[key as VariantKeys<Variants>] = Boolean(
            (rest as Record<string, unknown>)[key]
          );
        } else {
          otherProps[key] = (rest as Record<string, unknown>)[key];
        }
      }

      const classes: ClassValue[] = [
        ...collectClasses(config[BASE_KEY]),
      ];

      for (const key of variantKeys) {
        if (variantProps[key]) {
          classes.push(...collectClasses(config[key]));
        }
      }

      const finalClassName = clsx(classes, className);

      return createElement(element, {
        ...otherProps,
        ref,
        className: finalClassName || undefined,
      });
    }
  );

  Component.displayName = "ComponentFactory";

  return Component as ComponentFactory<Variants, DefaultElement>;
}

export type { ClassValue } from "clsx";
