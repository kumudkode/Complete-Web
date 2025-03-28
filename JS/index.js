/******************************************************************************
 * JavaScript Fundamentals - A Complete Guide
 * This file contains examples and explanations of JavaScript concepts
 * from basic to advanced.
 ******************************************************************************/

// =====================================================================
// 1. JAVASCRIPT BASICS
// =====================================================================

/*
 * Variables and Data Types
 * JavaScript has three ways to declare variables: var, let, and const
 */

// 1.1 Variable Declaration
var oldWay = "Using var (avoid this in modern code)"; // Function-scoped, can be redeclared
let modern = "Using let"; // Block-scoped, can be reassigned
const constant = "Using const"; // Block-scoped, cannot be reassigned

// 1.2 Data Types
// Primitive Types
const stringExample = "This is a string"; // Strings - for text
const numberExample = 42; // Numbers - for numeric values
const booleanExample = true; // Booleans - true or false
const nullExample = null; // Null - intentional absence of value
let undefinedExample; // Undefined - unassigned variable
const symbolExample = Symbol('unique'); // Symbol - unique identifier

// Reference Types
const objectExample = { 
    name: "Object Example",
    type: "Object",
    isComplex: true
}; // Objects - collections of properties

const arrayExample = [1, 2, 3, 4, 5]; // Arrays - ordered collections

// 1.3 Type Coercion and Conversion
console.log("5" + 5); // "55" (string concatenation)
console.log("5" - 5); // 0 (numeric subtraction)
console.log(Number("5")); // 5 (explicit conversion)
console.log(String(5)); // "5" (explicit conversion)
console.log(Boolean(0)); // false
console.log(Boolean("hello")); // true

// 1.4 Template Literals (string interpolation)
const name = "JavaScript";
console.log(`Hello, ${name}!`); // "Hello, JavaScript!"

// =====================================================================
// 2. CONTROL FLOW
// =====================================================================

// 2.1 Conditional Statements
const score = 85;

// If-else statement
if (score >= 90) {
    console.log("Grade: A");
} else if (score >= 80) {
    console.log("Grade: B");
} else if (score >= 70) {
    console.log("Grade: C");
} else {
    console.log("Grade: F");
}

// Switch statement
const day = new Date().getDay();
switch (day) {
    case 0:
        console.log("Sunday");
        break;
    case 6:
        console.log("Saturday");
        break;
    default:
        console.log("Weekday");
}

// Ternary operator (inline conditional)
const status = score >= 70 ? "Passing" : "Failing";
console.log(`Student status: ${status}`);

// 2.2 Loops
// For loop
for (let i = 0; i < 5; i++) {
    console.log(`Iteration ${i + 1}`);
}

// While loop
let counter = 0;
while (counter < 3) {
    console.log(`While loop count: ${counter}`);
    counter++;
}

// Do-while loop (runs at least once)
let doCounter = 0;
do {
    console.log(`Do-while count: ${doCounter}`);
    doCounter++;
} while (doCounter < 3);

// For...of loop (iterating over iterable objects like arrays)
const colors = ["Red", "Green", "Blue"];
for (const color of colors) {
    console.log(`Color: ${color}`);
}

// For...in loop (iterating over object properties)
const person = { name: "John", age: 30, job: "Developer" };
for (const key in person) {
    console.log(`${key}: ${person[key]}`);
}

// =====================================================================
// 3. FUNCTIONS
// =====================================================================

// 3.1 Function Declaration
function greet(name) {
    return `Hello, ${name}!`;
}
console.log(greet("World")); // "Hello, World!"

// 3.2 Function Expression
const sayHello = function(name) {
    return `Hello, ${name}!`;
};
console.log(sayHello("JavaScript")); // "Hello, JavaScript!"

// 3.3 Arrow Functions
const welcome = (name) => `Welcome, ${name}!`;
console.log(welcome("User")); // "Welcome, User!"

// Arrow function with multiple statements
const calculateArea = (width, height) => {
    const area = width * height;
    return area;
};
console.log(calculateArea(5, 10)); // 50

// 3.4 Default Parameters
function createUser(name, role = "Member") {
    return { name, role };
}
console.log(createUser("John")); // { name: "John", role: "Member" }
console.log(createUser("Admin", "Administrator")); // { name: "Admin", role: "Administrator" }

// 3.5 Rest Parameters
function sum(...numbers) {
    return numbers.reduce((total, num) => total + num, 0);
}
console.log(sum(1, 2, 3, 4, 5)); // 15

// 3.6 Closures
function createCounter() {
    let count = 0;  // This variable is "closed over"
    
    return function() {
        count += 1;
        return count;
    };
}

const incrementCounter = createCounter();
console.log(incrementCounter()); // 1
console.log(incrementCounter()); // 2
console.log(incrementCounter()); // 3

// 3.7 Immediately Invoked Function Expression (IIFE)
(function() {
    const privatVariable = "This is private";
    console.log(privatVariable);
})(); // This function executes immediately

// =====================================================================
// 4. ARRAYS AND OBJECTS
// =====================================================================

// 4.1 Array Methods
const fruits = ["Apple", "Banana", "Cherry"];

// Adding and removing elements
fruits.push("Date"); // Add to end: ["Apple", "Banana", "Cherry", "Date"]
console.log(fruits);

fruits.pop(); // Remove from end: ["Apple", "Banana", "Cherry"]
console.log(fruits);

fruits.unshift("Apricot"); // Add to start: ["Apricot", "Apple", "Banana", "Cherry"]
console.log(fruits);

fruits.shift(); // Remove from start: ["Apple", "Banana", "Cherry"]
console.log(fruits);

// Slicing and splicing
const citrus = fruits.slice(1, 2); // ["Banana"] (non-destructive)
console.log(citrus);

fruits.splice(1, 1, "Blueberry", "Blackberry"); // Replace elements (destructive)
console.log(fruits); // ["Apple", "Blueberry", "Blackberry", "Cherry"]

// 4.2 Higher-order Array Methods
const numbers = [1, 2, 3, 4, 5];

// map - transform each element
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// filter - keep elements that pass a test
const evenNumbers = numbers.filter(num => num % 2 === 0);
console.log(evenNumbers); // [2, 4]

// reduce - accumulate values
const total = numbers.reduce((sum, num) => sum + num, 0);
console.log(total); // 15

// find - get first matching element
const firstEven = numbers.find(num => num % 2 === 0);
console.log(firstEven); // 2

// some/every - test conditions
const hasEven = numbers.some(num => num % 2 === 0);
console.log(hasEven); // true

const allPositive = numbers.every(num => num > 0);
console.log(allPositive); // true

// 4.3 Object Methods and Properties
const user = {
    firstName: "John",
    lastName: "Doe",
    age: 30,
    
    // Method definition
    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }
};

console.log(user.getFullName()); // "John Doe"

// Object methods
const keys = Object.keys(user); // ["firstName", "lastName", "age", "getFullName"]
const values = Object.values(user); // ["John", "Doe", 30, ƒ]
const entries = Object.entries(user); // [["firstName", "John"], ["lastName", "Doe"], ...]

// Object.assign - merge objects
const defaults = { role: "user", active: true };
const mergedUser = Object.assign({}, user, defaults);
console.log(mergedUser);

// Spread operator with objects (ES6+)
const spreadMergedUser = { ...user, ...defaults };
console.log(spreadMergedUser);

// =====================================================================
// 5. ASYNCHRONOUS JAVASCRIPT
// =====================================================================

// 5.1 Callbacks
function fetchDataWithCallback(callback) {
    // Simulating an API call with setTimeout
    setTimeout(() => {
        const data = { id: 1, name: "Sample Data" };
        callback(null, data); // null means no error
    }, 1000);
}

fetchDataWithCallback((error, data) => {
    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Data received:", data);
    }
});

// 5.2 Promises
function fetchDataWithPromise() {
    return new Promise((resolve, reject) => {
        // Simulating an API call
        setTimeout(() => {
            const success = true;
            
            if (success) {
                resolve({ id: 2, name: "Promise Data" });
            } else {
                reject(new Error("Failed to fetch data"));
            }
        }, 1500);
    });
}

fetchDataWithPromise()
    .then(data => console.log("Promise resolved:", data))
    .catch(error => console.error("Promise rejected:", error));

// Promise chaining
fetchDataWithPromise()
    .then(data => {
        console.log("First then:", data);
        return { ...data, processed: true };
    })
    .then(processedData => {
        console.log("Second then:", processedData);
    })
    .catch(error => console.error(error));

// 5.3 Async/Await
async function fetchAndProcessData() {
    try {
        // Await suspends execution until the promise resolves
        const data = await fetchDataWithPromise();
        console.log("Async/await data:", data);
        
        // Process the data
        const processed = { ...data, processedWithAsync: true };
        console.log("Processed:", processed);
        
        return processed;
    } catch (error) {
        console.error("Async/await error:", error);
    }
}

// Call the async function
fetchAndProcessData().then(result => {
    console.log("Final result:", result);
});

// 5.4 Promise.all - handle multiple promises
const promise1 = Promise.resolve("One");
const promise2 = new Promise(resolve => setTimeout(() => resolve("Two"), 100));
const promise3 = Promise.resolve("Three");

Promise.all([promise1, promise2, promise3])
    .then(values => console.log("Promise.all result:", values)) // ["One", "Two", "Three"]
    .catch(error => console.error(error));

// =====================================================================
// 6. DOM MANIPULATION (uncomment when used in a browser)
// =====================================================================

/*
// 6.1 Selecting Elements
const heading = document.getElementById('main-title');
const paragraphs = document.getElementsByTagName('p');
const highlights = document.getElementsByClassName('highlight');
const firstBtn = document.querySelector('button');
const allLinks = document.querySelectorAll('a');

// 6.2 Modifying Content
if (heading) {
    heading.textContent = 'New Title'; // Change text content
    heading.innerHTML = 'New <span>Title</span>'; // Change HTML content
}

// 6.3 Modifying Attributes
if (firstBtn) {
    firstBtn.setAttribute('disabled', 'true');
    firstBtn.removeAttribute('disabled');
    
    console.log(firstBtn.getAttribute('class'));
}

// 6.4 Styling Elements
if (heading) {
    heading.style.color = 'blue';
    heading.style.fontSize = '24px';
    heading.style.fontWeight = 'bold';
    
    // Add/remove classes
    heading.classList.add('active');
    heading.classList.remove('hidden');
    heading.classList.toggle('highlight');
    heading.classList.contains('active'); // true
}

// 6.5 Creating and Removing Elements
const newParagraph = document.createElement('p');
newParagraph.textContent = 'This is a dynamically created paragraph.';

// Append to DOM
document.body.appendChild(newParagraph);

// Insert before another element
if (heading) {
    document.body.insertBefore(newParagraph, heading);
}

// Remove element
if (newParagraph.parentNode) {
    newParagraph.parentNode.removeChild(newParagraph);
}

// Modern way
newParagraph.remove();
*/

// =====================================================================
// 7. EVENT HANDLING (uncomment when used in a browser)
// =====================================================================

/*
// 7.1 Adding Event Listeners
const button = document.querySelector('button');
if (button) {
    button.addEventListener('click', function(event) {
        console.log('Button clicked!', event);
        alert('Button was clicked!');
    });
}

// 7.2 Event Object
document.addEventListener('mousemove', function(event) {
    console.log(`Mouse position: ${event.clientX}, ${event.clientY}`);
});

// 7.3 Event Propagation
const parent = document.querySelector('.parent');
const child = document.querySelector('.child');

if (parent && child) {
    // Event bubbling (default)
    parent.addEventListener('click', function() {
        console.log('Parent clicked (bubble phase)');
    });
    
    child.addEventListener('click', function(event) {
        console.log('Child clicked (bubble phase)');
        
        // Stop propagation
        // event.stopPropagation();
    });
    
    // Event capturing
    parent.addEventListener('click', function() {
        console.log('Parent clicked (capture phase)');
    }, true); // true enables capturing phase
    
    child.addEventListener('click', function() {
        console.log('Child clicked (capture phase)');
    }, true);
}

// 7.4 Preventing Default Behavior
const link = document.querySelector('a');
if (link) {
    link.addEventListener('click', function(event) {
        event.preventDefault(); // Prevents the link from navigating
        console.log('Link click prevented');
    });
}

// 7.5 Event Delegation (efficient way to handle many elements)
const list = document.querySelector('ul');
if (list) {
    list.addEventListener('click', function(event) {
        // Check if the clicked element is a list item
        if (event.target.tagName === 'LI') {
            console.log('List item clicked:', event.target.textContent);
        }
    });
}
*/

// =====================================================================
// 8. OBJECT-ORIENTED JAVASCRIPT
// =====================================================================

// 8.1 Constructor Functions (ES5)
function Person(firstName, lastName, age) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    
    this.getFullName = function() {
        return `${this.firstName} ${this.lastName}`;
    };
}

const john = new Person('John', 'Doe', 30);
console.log(john.getFullName()); // "John Doe"

// Adding methods to prototype (more efficient)
Person.prototype.greet = function() {
    return `Hello, my name is ${this.firstName}`;
};

console.log(john.greet()); // "Hello, my name is John"

// 8.2 Classes (ES6+)
class User {
    constructor(username, email) {
        this.username = username;
        this.email = email;
        this.createdAt = new Date();
    }
    
    getInfo() {
        return `${this.username} (${this.email})`;
    }
    
    // Static method - called on the class, not instances
    static countUsers(users) {
        return users.length;
    }
    
    // Getter
    get emailDomain() {
        return this.email.split('@')[1];
    }
    
    // Setter
    set displayName(name) {
        this.username = name;
    }
}

const alice = new User('alice', 'alice@example.com');
console.log(alice.getInfo()); // "alice (alice@example.com)"
console.log(User.countUsers([alice, john])); // 2
console.log(alice.emailDomain); // "example.com"

alice.displayName = 'alice_new';
console.log(alice.username); // "alice_new"

// 8.3 Inheritance
class Admin extends User {
    constructor(username, email, role) {
        super(username, email); // Call parent constructor
        this.role = role;
        this.permissions = ['read', 'write', 'delete'];
    }
    
    hasPermission(permission) {
        return this.permissions.includes(permission);
    }
    
    // Override parent method
    getInfo() {
        return `${super.getInfo()} - ${this.role}`;
    }
}

const admin = new Admin('admin', 'admin@example.com', 'superuser');
console.log(admin.getInfo()); // "admin (admin@example.com) - superuser"
console.log(admin.hasPermission('write')); // true

// =====================================================================
// 9. ES6+ FEATURES
// =====================================================================

// 9.1 Destructuring
// Array destructuring
const rgb = [255, 100, 50];
const [red, green, blue] = rgb;
console.log(`R: ${red}, G: ${green}, B: ${blue}`); // "R: 255, G: 100, B: 50"

// Object destructuring
const { firstName: fname, lastName: lname } = john;
console.log(`Name: ${fname} ${lname}`); // "Name: John Doe"

// 9.2 Spread and Rest operators
// Spread - expand an iterable
const firstThreeNumbers = [1, 2, 3];
const moreNumbers = [...firstThreeNumbers, 4, 5]; // [1, 2, 3, 4, 5]

// Spread with objects
const baseConfig = { apiVersion: 'v1', timeout: 3000 };
const extendedConfig = { ...baseConfig, debug: true }; // { apiVersion: 'v1', timeout: 3000, debug: true }

// 9.3 Map and Set
// Map - key-value pairs where keys can be any type
const userRoles = new Map();
userRoles.set(john, 'admin');
userRoles.set(alice, 'editor');

console.log(userRoles.get(john)); // "admin"
console.log(userRoles.has(alice)); // true
console.log(userRoles.size); // 2

// Set - collection of unique values
const uniqueNumbers = new Set([1, 2, 3, 3, 4, 4, 5]);
console.log(uniqueNumbers); // Set(5) {1, 2, 3, 4, 5}
uniqueNumbers.add(6);
console.log(uniqueNumbers.has(4)); // true

// 9.4 Modules (comment these when not using ES modules)
/*
// Exporting (in another file)
export const add = (a, b) => a + b;
export default class Calculator {...}

// Importing (in this file)
import { add } from './math.js';
import Calculator from './math.js';
*/

// 9.5 Optional Chaining
const employee = {
    details: {
        name: {
            first: 'Jane',
            last: 'Smith'
        }
    }
};

// Without optional chaining - prone to errors
// const middleName = employee.details.name.middle; // Error if middle doesn't exist

// With optional chaining - safer
const middleName = employee?.details?.name?.middle; // undefined if any part doesn't exist
console.log(middleName); // undefined

// 9.6 Nullish Coalescing
const defaultPages = 1;
const userPreference = 0; // Valid preference

// With OR operator - treats 0 as falsy
const pagesWithOr = userPreference || defaultPages; // 1

// With nullish coalescing - only uses default for null/undefined
const pagesWithNullish = userPreference ?? defaultPages; // 0
console.log({ pagesWithOr, pagesWithNullish });

// =====================================================================
// 10. MODERN JAVASCRIPT PATTERNS
// =====================================================================

// 10.1 Factory Functions
function createEmployee(name, position, salary) {
    // Private variables (through closure)
    const taxRate = 0.2;
    const calculateTax = () => salary * taxRate;
    
    // Return an object with public methods and properties
    return {
        name,
        position,
        getSalary() {
            return salary;
        },
        getNetSalary() {
            return salary - calculateTax();
        },
        raiseSalary(percent) {
            salary = salary * (1 + percent / 100);
            return salary;
        }
    };
}

const developer = createEmployee('Sarah', 'Frontend Developer', 75000);
console.log(developer.getNetSalary()); // 60000
developer.raiseSalary(10);
console.log(developer.getNetSalary()); // 66000

// 10.2 Module Pattern (IIFE + Closure)
const counterModule = (function() {
    // Private variables
    let count = 0;
    
    // Return public API
    return {
        increment() {
            return ++count;
        },
        decrement() {
            return --count;
        },
        getValue() {
            return count;
        },
        reset() {
            count = 0;
            return count;
        }
    };
})();

console.log(counterModule.increment()); // 1
console.log(counterModule.increment()); // 2
console.log(counterModule.getValue()); // 2
console.log(counterModule.reset()); // 0

// 10.3 Composition over Inheritance
// Creating behavior functions
const canSwim = (state) => ({
    swim: () => console.log(`${state.name} is swimming.`)
});

const canFly = (state) => ({
    fly: () => console.log(`${state.name} is flying.`)
});

const canWalk = (state) => ({
    walk: () => console.log(`${state.name} is walking.`)
});

// Composing objects with behaviors
function createDuck(name) {
    const state = { name };
    return {
        ...state,
        ...canSwim(state),
        ...canWalk(state),
        ...canFly(state)
    };
}

function createPenguin(name) {
    const state = { name };
    return {
        ...state,
        ...canSwim(state),
        ...canWalk(state)
    };
}

const duck = createDuck('Donald');
duck.swim(); // "Donald is swimming."
duck.fly(); // "Donald is flying."

const penguin = createPenguin('Pingu');
penguin.swim(); // "Pingu is swimming."
// penguin.fly(); // Error: penguin.fly is not a function

// =====================================================================
// SUMMARY OF BEST PRACTICES
// =====================================================================

/*
1. Use const by default, let when needed, avoid var
2. Prefer arrow functions when "this" context doesn't matter
3. Use template literals for string interpolation
4. Use destructuring to extract values from objects and arrays
5. Use spread/rest operators for working with arrays and objects
6. Use async/await for cleaner asynchronous code
7. Use optional chaining (?.) for safer property access
8. Favor composition over inheritance for code reuse
9. Use modules to organize code
10. Write functional programming where possible (map, filter, reduce)
*/

// This file is meant to serve as a reference and learning resource.
// Explore these examples to strengthen your JavaScript knowledge!

//Apart from that, you can also refer to the following resources:
// - MDN Web Docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript
// 2. Eloquent JavaScript: https://eloquentjavascript.net/
// 3. You Don't Know JS: https://github.com/getify/You-Dont-Know-JS
// 4. JavaScript.info: https://javascript.info/
// 5. JavaScript30: https://javascript30.com/
// 6. The Modern JavaScript Tutorial
// 7. JavaScript Patterns: https://www.oreilly.com/library/view/javascript-patterns/9781449394908/
// 8. JavaScript: The Good Parts
// 9. JavaScript Allongé: https://leanpub.com/javascript-allonge
// 10. JavaScript: The Definitive Guide
//--------------------------------------------
// // =====================================================================
// 11. REGULAR EXPRESSIONS
// =====================================================================

// 11.1 Creating Regular Expressions
const patternLiteral = /hello/i; // i flag for case-insensitive
const patternConstructor = new RegExp('hello', 'i');

// 11.2 RegExp Methods
const text = "Hello, World!";
console.log(patternLiteral.test(text)); // true
console.log(patternLiteral.exec(text)); // ["Hello", index: 0, input: "Hello, World!"]

// 11.3 String Methods with RegExp
console.log(text.match(patternLiteral)); // ["Hello"]
console.log(text.search(patternLiteral)); // 0
console.log(text.replace(patternLiteral, 'Hi')); // "Hi, World!"

// 11.4 Common Patterns
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
console.log(emailPattern.test('user@example.com')); // true
console.log(emailPattern.test('invalid-email')); // false
// 11.5 Flags
// i - case-insensitive
// g - global search
// m - multi-line search
// s - dot matches newline
// u - unicode
// y - sticky
//
// =====================================================================
// 12. ERROR HANDLING & DEBUGGING
// =====================================================================

// 12.1 Try...Catch...Finally
function divide(a, b) {
    try {
        if (b === 0) {
            throw new Error("Division by zero");
        }
        return a / b;
    } catch (error) {
        console.error("Error caught:", error.message);
        return Infinity; // Fallback value
    } finally {
        console.log("Division operation attempted");
    }
}

console.log(divide(10, 2)); // 5
console.log(divide(10, 0)); // Infinity

// 12.2 Custom Error Types
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}

function validateUser(user) {
    if (!user.name) {
        throw new ValidationError("User name is required");
    }
}
// =====================================================================
// 13. WEB STORAGE & ADDITIONAL WEB APIS
// =====================================================================

/*
// 13.1 localStorage and sessionStorage
// localStorage - persists even after browser close
localStorage.setItem('username', 'john_doe');
const savedUsername = localStorage.getItem('username');
localStorage.removeItem('username');
localStorage.clear(); // Clear all items

// sessionStorage - only for current session
sessionStorage.setItem('tempData', JSON.stringify({id: 123}));
const tempData = JSON.parse(sessionStorage.getItem('tempData'));

// 13.2 Fetch API
fetch('https://api.example.com/data')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => console.log('Data:', data))
    .catch(error => console.error('Fetch error:', error));

// POST request with fetch
fetch('https://api.example.com/users', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com'
    })
})
.then(response => response.json())
.then(data => console.log('User created:', data));

// 13.3 Geolocation API
navigator.geolocation.getCurrentPosition(
    position => {
        console.log(`Latitude: ${position.coords.latitude}`);
        console.log(`Longitude: ${position.coords.longitude}`);
    },
    error => {
        console.error('Geolocation error:', error.message);
    }
);
*/
// =====================================================================
// 14. JAVASCRIPT PERFORMANCE OPTIMIZATION
// =====================================================================

// 14.1 Debouncing
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// Usage example
const debouncedSearch = debounce(function(query) {
    console.log(`Searching for: ${query}`);
    // API call or heavy operation here
}, 300);

// 14.2 Throttling
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Usage example
const throttledScroll = throttle(function() {
    console.log('Scroll event throttled');
}, 500);

// 14.3 Memoization
function memoize(func) {
    const cache = new Map();
    return function(...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = func.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

// Usage example
const expensiveCalculation = (n) => {
    console.log(`Calculating fibonacci for ${n}...`);
    if (n <= 1) return n;
    return expensiveCalculation(n - 1) + expensiveCalculation(n - 2);
};

const memoizedCalculation = memoize(function(n) {
    if (n <= 1) return n;
    return memoizedCalculation(n - 1) + memoizedCalculation(n - 2);
});
// =====================================================================
// 15. MODERN FRAMEWORK BASICS
// =====================================================================

/*
// 15.1 React Basics
// Component in React (JSX syntax)
function Welcome(props) {
    return <h1>Hello, {props.name}</h1>;
}

// Using state with hooks
import React, { useState, useEffect } from 'react';

function Counter() {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        document.title = `You clicked ${count} times`;
    }, [count]);
    
    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
                Click me
            </button>
        </div>
    );
}

// 15.2 Vue Basics
// Vue component example
Vue.component('hello-world', {
    props: ['name'],
    template: '<h1>Hello, {{ name }}</h1>'
});

new Vue({
    el: '#app',
    data: {
        count: 0
    },
    methods: {
        increment() {
            this.count++;
        }
    }
});

// 15.3 Angular Basics
// Angular component example
@Component({
    selector: 'app-counter',
    template: `
        <div>
            <p>Count: {{ count }}</p>
            <button (click)="increment()">Increment</button>
        </div>
    `
})
export class CounterComponent {
    count = 0;
    
    increment() {
        this.count++;
    }
}
*/
// =====================================================================
// 16. TESTING JAVASCRIPT
// =====================================================================

/*
// 16.1 Unit Testing with Jest
// Example test for a sum function
function sum(a, b) {
    return a + b;
}

// Test case in Jest syntax
test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});

// Testing asynchronous code
test('data is retrieved successfully', async () => {
    const data = await fetchDataWithPromise();
    expect(data).toHaveProperty('id');
});

// 16.2 Mocking
// Mocking a function
const mockCallback = jest.fn(x => x + 1);
[0, 1].forEach(mockCallback);
expect(mockCallback.mock.calls.length).toBe(2);
expect(mockCallback.mock.results[0].value).toBe(1);
*/
