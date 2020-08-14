import { LitElement, html, customElement, property, TemplateResult, css, CSSResult  } from "lit-element";
import { styleMap } from "lit-html/directives/style-map";
import { contextReceiver, emitContext } from "../src/decorators/context";

if(window.customElements.get("test-receiver")) {
  location.reload();
}

@customElement("test-receiver")
@contextReceiver({
  myctx: true,
  otherctx: (ctx) => {
    return {
      color: ctx.borderColor
    }
  }
})
class TestReceiver extends LitElement {

  static get styles (): CSSResult {
    return css`
      div {
        border: 1px solid #000000;
      }
    `;
  }

  @property({
    type: String,
    attribute: true,
    reflect: true
  })
  text: string = "";

  @property({
    type: String,
    attribute: true,
    reflect: true
  })
  color: string = "#FF0000";

  render (): TemplateResult {
    return html`
      <div style=${styleMap({ borderColor: this.color })}>
        ${this.text}
      </div>
    `;
  }
}



export default {
  title: "Context"
};

export const Context = (): Node => {
  const $f = document.createElement("div");

  const testEl = document.createElement("test-receiver");
  testEl.setAttribute("text", "Foo");
  $f.appendChild(testEl);

  const btn = document.createElement("button");
  btn.addEventListener("click", () => {
    emitContext("myctx", {
      text: "Bar 1"
    });
  });
  btn.innerText = "Emit myctx 1";
  $f.appendChild(btn);

  const btn2 = document.createElement("button");
  btn2.addEventListener("click", () => {
    emitContext("myctx", {
      text: "Bar 2"
    });
  });
  btn2.innerText = "Emit myctx 2";
  $f.appendChild(btn2);

  const btn3 = document.createElement("button");
  btn3.addEventListener("click", () => {
    emitContext("otherctx", {
      borderColor: "#0000FF"
    });
  });
  btn3.innerText = "Emit otherctx 2";
  $f.appendChild(btn3);

  const btnAdd = document.createElement("button");
  btnAdd.addEventListener("click", () => {
    const testEl = document.createElement("test-receiver");
    $f.appendChild(testEl);
  });
  btnAdd.innerText = "Add context el";
  $f.appendChild(btnAdd);

  return $f;
};
