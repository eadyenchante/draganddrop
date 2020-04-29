// validation logic
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(ValidatableInput: Validatable) {
  let isValid = true;
  if (ValidatableInput.required) {
    // set isvalid to true if isValid is required and value of string length is not 0
    isValid = isValid && ValidatableInput.value.toString().trim().length !== 0;
  }
  // check if isValid has a min length that is not a falsy value and is of type string, if so is the value length greater than the min length
  if (
    ValidatableInput.minLength != null &&
    typeof ValidatableInput.value === "string"
  ) {
    isValid =
      isValid && ValidatableInput.value.length >= ValidatableInput.minLength;
  }
  // check if isValid has a max length that is not a falsy value and is of type string, if so is the value length greater than or equall to the min length
  if (
    ValidatableInput.maxLength != null &&
    typeof ValidatableInput.value === "string"
  ) {
    isValid =
      isValid && ValidatableInput.value.length <= ValidatableInput.maxLength;
  }
  // check if isValid is of type number and greater or equall to min
  if (
    ValidatableInput.min != null &&
    typeof ValidatableInput.value === "number"
  ) {
    isValid = isValid && ValidatableInput.value >= ValidatableInput.min;
  }
  // check if isValid is of type number and greater than or equall to min
  if (
    ValidatableInput.max != null &&
    typeof ValidatableInput.value === "number"
  ) {
    isValid = isValid && ValidatableInput.value <= ValidatableInput.max;
  }
  return isValid;
}

// autobind decorator
function autobind(
  // hint for ts that we are not going to use the target and the methodName values but will accept them to use the argument thereafter
  _: any,
  _2: string,
  descriptor: PropertyDescriptor
) {
  // access and store the original method that we defined
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    // getter to call this on the original function and set to bndFn
    // return tthe bound function
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  // overall return the adjDescriptor method decorator
  return adjDescriptor;
}

// project input class
class ProjectInput {
  // fields in the class to assign to
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

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
    // access user-input from css file
    this.element.id = "user-input";
    // call private method attach to make this execute
    // populate fields in the constructor by using the querySelector on each form element to query for the form fields and cast as HTMLInputElement. This gives us access to all elements in objects created based on the class
    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;

    // call methods from inside the class to ensure code runs
    this.configure();
    this.attach();
  }

  // method to gather user input value and store in constants this will return a tuple or a union type to allow for potentially void
  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeopleNo = this.peopleInputElement.value;

    // validation check to show alert or return tuple
    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    };
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };
    const peopleValidatable: Validatable = {
      value: +enteredPeopleNo,
      required: true,
      min: 1,
      max: 5
    };

    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert("invalid input , please try again");
    } else {
      // convert enteredPeopleNo to
      return [enteredTitle, enteredDescription, +enteredPeopleNo];
    }
  }

  // method to clear input fields after submit
  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  @autobind
  // this method should trigger whenever the form is submitted
  private submitHandler(event: Event) {
    // prevent an http request being sent here
    event.preventDefault();
    this.gatherUserInput();
    // console.log(this.titleInputElement.value);
    // if check using array method to establish if it returns an array and if true, destructuring to get the values out of userInput and log to console
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      console.log(title, desc, people);
      this.clearInputs();
    }
  }
  // private method added to add listener element to form  and bind to private method
  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  //    private method added to split the seltion and rendering logic
  //   using insertAdjacentElement method to insert an element after the targeted elements opening tags
  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const prjInput = new ProjectInput();
