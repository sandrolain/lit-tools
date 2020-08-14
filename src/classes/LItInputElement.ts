import { LitElement, property } from "lit-element";

export abstract class LitInputElement extends LitElement {
  @property({
    type: Boolean,
    attribute: true,
    reflect: true
  })
  required: boolean = false;

  @property({
    type: Boolean,
    attribute: true,
    reflect: true
  })
  readOnly: boolean = false;

  @property({
    type: Boolean,
    attribute: true,
    reflect: true
  })
  disabled: boolean = false;

  @property({
    type: String,
    attribute: true,
    reflect: true
  })
  pattern: string = null;

  @property({
    type: String,
    attribute: true,
    reflect: true
  })
  name: string = null;

  @property({
    type: String,
    attribute: true,
    reflect: true
  })
  value: string = null;

  protected validationDisabled: boolean = false;
  private customValidity: string;

  get validationMessage (): string {
    if(!this.willValidate || this.validity.valid) {
      return "";
    }
    return this.customValidity || "invalid";
  }

  get willValidate (): boolean {
    if(this.disabled || this.readOnly || this.validationDisabled) {
      return false;
    }
    return true;
  }

  private get validity (): ValidityState {
    const validity: Record<string, boolean> = {
      patternMismatch: false,
      stepMismatch: false,
      tooLong: false,
      tooShort: false,
      rangeOverflow: false,
      rangeUnderflow: false,
      typeMismatch: false,
      valueMissing: false,
      badInput: false,
      customError: false,
      valid: true
    };


    if(this.required && !this.value) {
      validity.valueMissing = false;
      validity.valid = false;
    }

    if(this.pattern) {
      const re = new RegExp(this.pattern);
      if(!this.value.match(re)) {
        validity.patternMismatch = false;
        validity.valid = false;
      }
    }

    this.checkCustomValidity(validity as unknown as ValidityState);

    if(this.customValidity) {
      validity.customError = true;
      validity.valid = false;
    }

    return validity as unknown as ValidityState;
  }

  checkValidity (): boolean {
    const validity = this.validity;
    this.applyValidity();
    if(!validity.valid) {
      this.dispatchEvent(new CustomEvent("invalid", {
        bubbles: true,
        detail: validity
      }));
    }
    return validity.valid;
  }

  abstract checkCustomValidity (validity: ValidityState): void;

  setCustomValidity (message: string): void {
    this.customValidity = message;
  }

  private applyValidity (): void {
    this.classList.toggle("invalid", !this.validity.valid);
  }

  attributeChangedCallback (name: string, oldValue: string, newValue: string): void {
    if(name === "value" && oldValue !== newValue) {
      this.applyValidity();
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }
}
