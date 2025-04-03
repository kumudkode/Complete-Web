/**
 * @fileoverview Summary of data types in JavaScript.
 * Datatypes are the classification of data items.
 * In JavaScript, there are two types of data types: primitive and reference or non-primitive.
 * Primitive data types are the most basic data types in JavaScript.
 * Reference data types are more complex and can hold multiple values or objects.
 * Examples of reference data types include arrays, functions, and objects.
 ------------------------------------------------------
 * Primitive data types include string, number, boolean, null, undefined, and symbol.
 * Primitive data types are immutable, meaning they cannot be changed.
 * String ="okay","ok10" and others
 * Number= 10, 20, 30, 40, 50, 60, 70, 80, 90, 100
 * Boolean = true, false
 * null = null but not 0 or undefined 
 * undefined = undefined is sth that we did not assign any
   value to it
 * symbol 
   const id = Symbol("id"); // Symbol is a built-in object that is used to create unique identifiers.
   symbol is a unique and immutable value that    
   can be used as an identifier for object properties.
  Symbol is a new data type introduced in ES6.
  It is used to create unique identifiers for object properties.
 * 
 *  
 *
 -------------------------------------------------------
 * Reference data types are mutable, meaning they can be changed.
 * Reference data types include objects, arrays, functions, and more complex structures.
 * 
 * Array = ["ok","okay",10,20,30]
 * Object = {name:"raj",age:20} 
 * Function = function() { return "Hello, World!"; }
 * Date = new Date()
 */
// Javascript is a dynamically typed language or statically typed language lets find out
// what is the difference between them
/* Dynamically typed language means that the type of a variable is determined at runtime
 and can change as the program executes. This means that you don't have to explicitly declare the type of a variable when you create it.    
*/
const fruit="apple"; // string
const fruit1=10; // number 
const fruit2=15.2; // number
const fruit3=true; // boolean
const fruit4=null; // null
const fruit5=undefined; // undefined
// so here we didnt tell that its string or number but js automatically detects it
// so basically js is a dynamically typed language

// In summary, JavaScript's dynamic typing allows for flexibility in variable types, 
// making it easier to work with different data types without strict declarations.

//symbol examples
const id=Symbol("id"); 
const id1=Symbol("id");
console.log(id===id1); // false
console.log(id); // Symbol(id)
console.log(id1); // Symbol(id)

// Array examples
const array=[1,2,3,4,5];

// object examples
const obj={ name: "raj", age: 20 }; // object is a collection of key-value pairs that is stored in memory and under {} brackets
console.log(obj);

// function examples
const func=function() { return "Hello, World!"; }; // function is a block of code that performs a specific task
console.log(func()); // Hello, World!
// 

// for finding datatypes in js we can use typeof operator
console.log(typeof fruit); // string
console.log(typeof fruit1); // number
console.log(typeof fruit2); // number
console.log(typeof fruit3); // boolean
console.log(typeof fruit4); // object
console.log(typeof fruit5); // undefined
console.log(typeof id); // symbol
console.log(typeof array); // object
console.log(typeof obj); // object
console.log(typeof func); // function
// This concludes the summary of data types in JavaScript. 
// If you wanna master JavaScript then you should work more on objects and browser web events or browser events.
// This is the end of the file.
// Happy coding!