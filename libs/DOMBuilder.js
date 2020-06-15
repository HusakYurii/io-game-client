export class DOMBuilder {
  static render(elements) {
    return elements.map(({ type = "div", children = [], attrebutes = [], text = "" }) => {
      const htmlEl = document.createElement(type);

      attrebutes.forEach(({ name, value }) => {
        htmlEl.setAttribute(name, value);
      });

      text && htmlEl.append(document.createTextNode(text));
      children && htmlEl.append(...this.render(children));

      return htmlEl;
    });
  }
}