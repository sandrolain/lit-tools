import { LitElement, html, css, customElement, property, TemplateResult, CSSResult, query   } from "lit-element";
import { LitInputElement } from "../src/classes/LItInputElement";

if(window.customElements.get("test-input")) {
  location.reload();
}


@customElement("test-input")
class TestInput extends LitInputElement {

  @query("input")
  private input: HTMLInputElement;

  static get styles (): CSSResult {
    return css`
      :host(.invalid) div { border: 1px dotted red; }
    `;
  }

  checkCustomValidity (): void {
    if(this.value.length > 0 && !this.value.match(/5/)) {
      this.setCustomValidity("Must have 5");
    } else {
      this.setCustomValidity(null);
    }
  }

  render (): TemplateResult {
    return html`
      <div><input type="text" value=${this.value} @input=${this.updateValue}</div>
    `;
  }

  updateValue (): void {
    this.value = this.input.value;
  }
}


export default {
  title: "InputElement"
};

export const InputElement = (): Node => {
  const $f = document.createDocumentFragment();

  const testEl = document.createElement("test-input") as TestInput;
  testEl.value = "Foo";
  testEl.pattern = "2";
  $f.appendChild(testEl);

  const btn = document.createElement("button");
  btn.addEventListener("click", () => {
    testEl.value = Math.random().toFixed(3);
  });
  btn.innerText = "Change value";
  $f.appendChild(btn);


  return $f;
};
