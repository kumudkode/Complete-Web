//memory is a crucial aspect of programming, as it determines how data is stored and accessed in a program.

// Stack and  heap are two types of  memory management are important concepts in programming that help manage memory efficiently and effectively.

// Stack memory is used for static memory allocation, while heap memory is used for dynamic memory allocation.

// Stack memory is faster than heap memory, but has limited size and is used for storing local variables and function calls.

// Heap memory is slower than stack memory, but has larger size and is used for storing objects and data structures.

// Memory management is the process of allocating and deallocating memory in a program to optimize performance and prevent memory leaks.

// It involves techniques such as garbage collection, reference counting, and memory pooling to manage memory efficiently and effectively.

// Creating visual representations of stack and heap memory
//--------------------------------------------------------------
//----------------------------------------------------------------
// memory have two types:
// 1. stack memory(primitive) ---- variable copy 
// 2. heap memory(Non-primitive) ---- reference of original value so whenever we change something then original value will also change

// PRIMITIVES (Passed by Value)
// When we declare a variable with a primitive value (like string, number, boolean),
// JavaScript allocates memory and stores the actual value there

let firstName = "hitesh"; // Value "hitesh" is stored in memory
let anotherName = firstName; // A COPY of the value is created and stored separately
anotherName = "chai"; // This changes only the copy, not the original

// That's why they show different values
console.log(firstName); // hitesh - original value is unchanged
console.log(anotherName); // chai - only the copy was modified

// OBJECTS (Passed by Reference)
// When we create an object, JavaScript allocates memory for the object
// and stores a REFERENCE to that memory location in the variable

let userOne = {
    email: "user@google.com",
    upi: "user@ybl"
}
let userTwo = userOne; // Both variables now point to the SAME object in memory
userTwo.email = "hitesh@google.com"; // Changes the single shared object

// Both variables access the same modified object
console.log(userOne.email); // hitesh@google.com - object was modified
console.log(userTwo.email); // hitesh@google.com - same object, same value