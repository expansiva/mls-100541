/// <mls shortName="litDecorators" project="100541" enhancement="_blank" />
				
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { ReactiveElement, PropertyDeclaration } from '_100541_litReactiveElement';

type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

export type Constructor<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): T;
};

// From the TC39 Decorators proposal
export interface ClassDescriptor {
  kind: 'class';
  elements: ClassElement[];
  finisher?: <T>(clazz: Constructor<T>) => void | Constructor<T>;
}

// From the TC39 Decorators proposal
export interface ClassElement {
  kind: 'field' | 'method';
  key: PropertyKey;
  placement: 'static' | 'prototype' | 'own';
  initializer?: Function;
  extras?: ClassElement[];
  finisher?: <T>(clazz: Constructor<T>) => void | Constructor<T>;
  descriptor?: PropertyDescriptor;
}

export const legacyPrototypeMethod = (
  descriptor: PropertyDescriptor,
  proto: Object,
  name: PropertyKey
) => {
  Object.defineProperty(proto, name, descriptor);
};

export const standardPrototypeMethod = (
  descriptor: PropertyDescriptor,
  element: ClassElement
) => ({
  kind: 'method',
  placement: 'prototype',
  key: element.key,
  descriptor,
});

/**
 * Helper for decorating a property that is compatible with both TypeScript
 * and Babel decorators. The optional `finisher` can be used to perform work on
 * the class. The optional `descriptor` should return a PropertyDescriptor
 * to install for the given property.
 *
 * @param finisher {function} Optional finisher method; receives the element
 * constructor and property key as arguments and has no return value.
 * @param descriptor {function} Optional descriptor method; receives the
 * property key as an argument and returns a property descriptor to define for
 * the given property.
 * @returns {ClassElement|void}
 */
export const decorateProperty =
  ({
    finisher,
    descriptor,
  }: {
    finisher?:
      | ((ctor: typeof ReactiveElement, property: PropertyKey) => void)
      | null;
    descriptor?: (property: PropertyKey) => PropertyDescriptor;
  }) =>
  (
    protoOrDescriptor: ReactiveElement | ClassElement,
    name?: PropertyKey
    // Note TypeScript requires the return type to be `void|any`
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): void | any => {
    // TypeScript / Babel legacy mode
    if (name !== undefined) {
      const ctor = (protoOrDescriptor as ReactiveElement)
        .constructor as typeof ReactiveElement;
      if (descriptor !== undefined) {
        Object.defineProperty(protoOrDescriptor, name, descriptor(name));
      }
      finisher?.(ctor, name!);
      // Babel standard mode
    } else {
      // Note, the @property decorator saves `key` as `originalKey`
      // so try to use it here.
      const key =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (protoOrDescriptor as any).originalKey ??
        (protoOrDescriptor as ClassElement).key;
      const info: ClassElement =
        descriptor != undefined
          ? {
              kind: 'method',
              placement: 'prototype',
              key,
              descriptor: descriptor((protoOrDescriptor as ClassElement).key),
            }
          : {...(protoOrDescriptor as ClassElement), key};
      if (finisher != undefined) {
        info.finisher = function <ReactiveElement>(
          ctor: Constructor<ReactiveElement>
        ) {
          finisher(ctor as unknown as typeof ReactiveElement, key);
        };
      }
      return info;
    }
  };

/**
 * Allow for custom element classes with private constructors
 */
type CustomElementClass = Omit<typeof HTMLElement, 'new'>;

const legacyCustomElement = (tagName: string, clazz: CustomElementClass) => {
  customElements.define(tagName, clazz as any);
  // Cast as any because TS doesn't recognize the return type as being a
  // subtype of the decorated class when clazz is typed as
  // `Constructor<HTMLElement>` for some reason.
  // `Constructor<HTMLElement>` is helpful to make sure the decorator is
  // applied to elements however.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return clazz as any;
};

const standardCustomElement = (
  tagName: string,
  descriptor: ClassDescriptor
) => {
  const {kind, elements} = descriptor;
  return {
    kind,
    elements,
    // This callback is called once the class is otherwise fully defined
    finisher(clazz: Constructor<HTMLElement>) {
      customElements.define(tagName, clazz);
    },
  };
};

/**
 * Class decorator factory that defines the decorated class as a custom element.
 *
 * ```js
 * @customElement('my-element')
 * class MyElement extends LitElement {
 *   render() {
 *     return html``;
 *   }
 * }
 * ```
 * @category Decorator
 * @param tagName The tag name of the custom element to define.
 */
export const customElement =
  (tagName: string) =>
  (classOrDescriptor: CustomElementClass | ClassDescriptor) =>
    typeof classOrDescriptor === 'function'
      ? legacyCustomElement(tagName, classOrDescriptor)
      : standardCustomElement(tagName, classOrDescriptor as ClassDescriptor);

      
/**
 * Adds event listener options to a method used as an event listener in a
 * lit-html template.
 *
 * @param options An object that specifies event listener options as accepted by
 * `EventTarget#addEventListener` and `EventTarget#removeEventListener`.
 *
 * Current browsers support the `capture`, `passive`, and `once` options. See:
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters
 *
 * ```ts
 * class MyElement {
 *   clicked = false;
 *
 *   render() {
 *     return html`
 *       <div @click=${this._onClick}>
 *         <button></button>
 *       </div>
 *     `;
 *   }
 *
 *   @eventOptions({capture: true})
 *   _onClick(e) {
 *     this.clicked = true;
 *   }
 * }
 * ```
 * @category Decorator
 */
export function eventOptions(options: AddEventListenerOptions) {
  return decorateProperty({
    finisher: (ctor: typeof ReactiveElement, name: PropertyKey) => {
      Object.assign(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ctor.prototype[name as keyof ReactiveElement] as any,
        options
      );
    },
  });
}

const standardProperty = (
  options: PropertyDeclaration,
  element: ClassElement
) => {
  // When decorating an accessor, pass it through and add property metadata.
  // Note, the `hasOwnProperty` check in `createProperty` ensures we don't
  // stomp over the user's accessor.
  if (
    element.kind === 'method' &&
    element.descriptor &&
    !('value' in element.descriptor)
  ) {
    return {
      ...element,
      finisher(clazz: typeof ReactiveElement) {
        clazz.createProperty(element.key, options);
      },
    };
  } else {
    // createProperty() takes care of defining the property, but we still
    // must return some kind of descriptor, so return a descriptor for an
    // unused prototype field. The finisher calls createProperty().
    return {
      kind: 'field',
      key: Symbol(),
      placement: 'own',
      descriptor: {},
      // store the original key so subsequent decorators have access to it.
      originalKey: element.key,
      // When @babel/plugin-proposal-decorators implements initializers,
      // do this instead of the initializer below. See:
      // https://github.com/babel/babel/issues/9260 extras: [
      //   {
      //     kind: 'initializer',
      //     placement: 'own',
      //     initializer: descriptor.initializer,
      //   }
      // ],
      initializer(this: {[key: string]: unknown}) {
        if (typeof element.initializer === 'function') {
          this[element.key as string] = element.initializer.call(this);
        }
      },
      finisher(clazz: typeof ReactiveElement) {
        clazz.createProperty(element.key, options);
      },
    };
  }
};

const legacyProperty = (
  options: PropertyDeclaration,
  proto: Object,
  name: PropertyKey
) => {
  (proto.constructor as typeof ReactiveElement).createProperty(name, options);
};

/**
 * A property decorator which creates a reactive property that reflects a
 * corresponding attribute value. When a decorated property is set
 * the element will update and render. A {@linkcode PropertyDeclaration} may
 * optionally be supplied to configure property features.
 *
 * This decorator should only be used for public fields. As public fields,
 * properties should be considered as primarily settable by element users,
 * either via attribute or the property itself.
 *
 * Generally, properties that are changed by the element should be private or
 * protected fields and should use the {@linkcode state} decorator.
 *
 * However, sometimes element code does need to set a public property. This
 * should typically only be done in response to user interaction, and an event
 * should be fired informing the user; for example, a checkbox sets its
 * `checked` property when clicked and fires a `changed` event. Mutating public
 * properties should typically not be done for non-primitive (object or array)
 * properties. In other cases when an element needs to manage state, a private
 * property decorated via the {@linkcode state} decorator should be used. When
 * needed, state properties can be initialized via public properties to
 * facilitate complex interactions.
 *
 * ```ts
 * class MyElement {
 *   @property({ type: Boolean })
 *   clicked = false;
 * }
 * ```
 * @category Decorator
 * @ExportDecoratedItems
 */
export function property(options?: PropertyDeclaration) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (protoOrDescriptor: Object | ClassElement, name?: PropertyKey): any =>
    name !== undefined
      ? legacyProperty(options!, protoOrDescriptor as Object, name)
      : standardProperty(options!, protoOrDescriptor as ClassElement);
}

/**
 * A property decorator that converts a class property into a getter
 * that executes a querySelectorAll on the element's renderRoot.
 *
 * @param selector A DOMString containing one or more selectors to match.
 *
 * See:
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll
 *
 * ```ts
 * class MyElement {
 *   @queryAll('div')
 *   divs: NodeListOf<HTMLDivElement>;
 *
 *   render() {
 *     return html`
 *       <div id="first"></div>
 *       <div id="second"></div>
 *     `;
 *   }
 * }
 * ```
 * @category Decorator
 */
export function queryAll(selector: string) {
  return decorateProperty({
    descriptor: (_name: PropertyKey) => ({
      get(this: ReactiveElement) {
        return this.renderRoot?.querySelectorAll(selector) ?? [];
      },
      enumerable: true,
      configurable: true,
    }),
  });
}

// Note, in the future, we may extend this decorator to support the use case
// where the queried element may need to do work to become ready to interact
// with (e.g. load some implementation code). If so, we might elect to
// add a second argument defining a function that can be run to make the
// queried element loaded/updated/ready.
/**
 * A property decorator that converts a class property into a getter that
 * returns a promise that resolves to the result of a querySelector on the
 * element's renderRoot done after the element's `updateComplete` promise
 * resolves. When the queried property may change with element state, this
 * decorator can be used instead of requiring users to await the
 * `updateComplete` before accessing the property.
 *
 * @param selector A DOMString containing one or more selectors to match.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
 *
 * ```ts
 * class MyElement {
 *   @queryAsync('#first')
 *   first: Promise<HTMLDivElement>;
 *
 *   render() {
 *     return html`
 *       <div id="first"></div>
 *       <div id="second"></div>
 *     `;
 *   }
 * }
 *
 * // external usage
 * async doSomethingWithFirst() {
 *  (await aMyElement.first).doSomething();
 * }
 * ```
 * @category Decorator
 */
export function queryAsync(selector: string) {
  return decorateProperty({
    descriptor: (_name: PropertyKey) => ({
      async get(this: ReactiveElement) {
        await this.updateComplete;
        return this.renderRoot?.querySelector(selector);
      },
      enumerable: true,
      configurable: true,
    }),
  });
}

/**
 * A property decorator that converts a class property into a getter that
 * executes a querySelector on the element's renderRoot.
 *
 * @param selector A DOMString containing one or more selectors to match.
 * @param cache An optional boolean which when true performs the DOM query only
 *     once and caches the result.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
 *
 * ```ts
 * class MyElement {
 *   @query('#first')
 *   first: HTMLDivElement;
 *
 *   render() {
 *     return html`
 *       <div id="first"></div>
 *       <div id="second"></div>
 *     `;
 *   }
 * }
 * ```
 * @category Decorator
 */
export function query(selector: string, cache?: boolean) {
  return decorateProperty({
    descriptor: (name: PropertyKey) => {
      const descriptor = {
        get(this: ReactiveElement) {
          return this.renderRoot?.querySelector(selector) ?? null;
        },
        enumerable: true,
        configurable: true,
      };
      if (cache) {
        const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
        descriptor.get = function (this: ReactiveElement) {
          if (
            (this as unknown as {[key: string]: Element | null})[
              key as string
            ] === undefined
          ) {
            (this as unknown as {[key: string]: Element | null})[
              key as string
            ] = this.renderRoot?.querySelector(selector) ?? null;
          }
          return (this as unknown as {[key: string]: Element | null})[
            key as string
          ];
        };
      }
      return descriptor;
    },
  });
}

export interface InternalPropertyDeclaration<Type = unknown> {
  /**
   * A function that indicates if a property should be considered changed when
   * it is set. The function should take the `newValue` and `oldValue` and
   * return `true` if an update should be requested.
   */
  hasChanged?(value: Type, oldValue: Type): boolean;
}

/**
 * Declares a private or protected reactive property that still triggers
 * updates to the element when it changes. It does not reflect from the
 * corresponding attribute.
 *
 * Properties declared this way must not be used from HTML or HTML templating
 * systems, they're solely for properties internal to the element. These
 * properties may be renamed by optimization tools like closure compiler.
 * @category Decorator
 */
export function state(options?: InternalPropertyDeclaration) {
  return property({
    ...options,
    state: true,
  });
}

// Shoelace Decorators

// @defaultValue decorator
//
// Runs when the corresponding attribute of the observed property changes, e.g. after calling Element.setAttribute or after updating
// the observed property.
//
// The decorator checks whether the value of the attribute is different from the value of the property and in that case
// it saves the new value.
//
//
// Usage:
//
//  @property({ type: Boolean, reflect: true }) checked = false;
//
//  @defaultValue('checked') defaultChecked = false;
//
