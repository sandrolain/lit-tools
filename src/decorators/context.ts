import { LitElement } from "lit-element";

export type Constructor<T> = {
  // tslint:disable-next-line:no-any
  new (...args: any[]): T
};

export type ContextReceiverHandler = (contextData: any, instance: LitElement) => Record<string, any> | false;

export type ContextListenerFunction = (event: CustomEvent) => void;

export interface ContextReceiverConfig {
  [key: string]: boolean | ContextReceiverHandler;
}

function plainContextHandler (contextData: any): any {
  return contextData;
}

const contextsDataStorage: Map<string, Record<string, any>> = new Map();

export function emitContext<T=any> (contextName: string, contextData: Record<string, any>): void {
  const oldData = contextsDataStorage.has(contextName) ? contextsDataStorage.get(contextName) : {};
  contextsDataStorage.set(contextName, Object.assign(oldData, contextData));
  const event = new CustomEvent(`context:${contextName}`, {
    detail: contextData
  });
  window.dispatchEvent(event);
}

export function contextReceiver (config: ContextReceiverConfig) {
  return function (constructor: typeof LitElement): typeof LitElement {
    return class extends constructor {
      private contextsListeners: Map<string, ContextListenerFunction> = new Map();

      private applyContextData (contextData: Record<string, any>): void {
        for(const [name, value] of Object.entries(contextData)) {
          (this as any)[name] = value;
        }
      }

      connectedCallback (): void {
        super.connectedCallback();

        for(const contextName in config) {
          const contextConfig = (config[contextName] === true) ? plainContextHandler : config[contextName];

          const listener: ContextListenerFunction = (event: CustomEvent) => {
            const contextData = (contextConfig as ContextReceiverHandler)(event.detail, this);
            if(contextData) {
              this.applyContextData(contextData);
            }
          };

          this.contextsListeners.set(contextName, listener);

          window.addEventListener(`context:${contextName}`, listener);

          if(contextsDataStorage.has(contextName)) {
            const contextData = (contextConfig as ContextReceiverHandler)(contextsDataStorage.get(contextName), this);
            if(contextData) {
              this.applyContextData(contextData);
            }
          }

        }
      }

      disconnectedCallback (): void {
        super.disconnectedCallback();

        this.contextsListeners.forEach((listener, contextName) => {
          window.removeEventListener(`context:${contextName}`, listener);
        });

        this.contextsListeners = new Map();
      }
    };
  };
}
