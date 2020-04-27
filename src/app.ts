class ProjectInput {
  // fields in the class to assign to
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;

  constructor() {
    // get access to elements and where they should be rendered
    // ! to tell ts that this will not be null and will be typecast to HTMLElemnts

    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    // import content from template element using importNode method on the DOM then
    // pass in a pointer/ref to the content which is a property that exists on the HTMLElement
    // true is also passed in to to state that deep clone is required (all levels of nesting)
    const importNode = document.importNode(this.templateElement.content, true);
    // render the content to the DOM
    this.element = importNode.firstElementChild as HTMLFormElement;
    // call private method attach to make this execute
    this.attach();
  }
  // private method added to split the seltion and rendering logic
  //using insertAdjacentElement method to insert an element after the targeted elements opening 
  // tags
  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const prjInput = new ProjectInput();
