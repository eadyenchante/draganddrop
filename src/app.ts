import { ProjectInput } from "./components/project-input";
import { ProjectList } from "./components/project-list";
import "reflect-metadata";
import {Product} from "./product.model";
import {plainToClass} from "class-transformer";

new ProjectInput();
new ProjectList("active");
new ProjectList("finished");

const products = [
  { title: "a carpet", price: 29.99 },
  { title: "a book", price: 10.99 },
];

// const loadedProducts = products.map((prod) => {
//   return new Product(prod.title, prod.price);
// });

const loadedProducts = plainToClass(Product, products)

for (const prod of loadedProducts) {
  console.log(prod.getInfo());
}

// const p1 = new Product("a book,", 12.99);
