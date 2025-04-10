// JavaScript Strings

// 1. Creating Strings
let singleQuotes = 'Hello';
let doubleQuotes = "World";
let backticks = `Hello World`; // Template literals (ES6)

// 2. String Length
const name = "JavaScript";
console.log(name.length); // 10

// 3. Accessing Characters
console.log(name[0]); // "J"
console.log(name.charAt(4)); // "S"

// 4. String Immutability
// Strings are immutable - individual characters cannot be changed
let str = "Hello";
str[0] = "h"; // This doesn't work
console.log(str); // Still "Hello"

// 5. String Methods
const text = "JavaScript is amazing";

// Changing case
console.log(text.toUpperCase()); // "JAVASCRIPT IS AMAZING"
console.log(text.toLowerCase()); // "javascript is amazing"

// Finding substrings
console.log(text.indexOf("Script")); // 4
console.log(text.includes("amazing")); // true
console.log(text.startsWith("Java")); // true
console.log(text.endsWith("ing")); // true

// Extracting substrings
console.log(text.slice(0, 10)); // "JavaScript"
console.log(text.substring(11, 13)); // "is"
console.log(text.substr(11, 2)); // "is" (deprecated)

// Modifying strings
console.log(text.replace("amazing", "awesome")); // "JavaScript is awesome"
console.log(text.concat(" and fun to learn")); // "JavaScript is amazing and fun to learn"
console.log(text.trim()); // Removes whitespace from both ends

// Splitting strings
console.log("a,b,c".split(",")); // ["a", "b", "c"]

// 6. Template Literals
const language = "JavaScript";
const year = 1995;
console.log(`${language} was created in ${year}`); // "JavaScript was created in 1995"
console.log(`${language} is ${2023 - year} years old`); // "JavaScript is 28 years old"

// 7. Escape Characters
console.log("This is a \"quoted\" text"); // This is a "quoted" text
console.log("This is a line\nThis is a new line"); // Line break
console.log("This is a tab\tafter tab");

// 8. String Comparison
console.log("a" < "b"); // true (lexicographical comparison)
console.log("apple" < "banana"); // true

// 9. String to Number conversion
console.log(Number("42")); // 42
console.log(parseInt("42px", 10)); // 42
console.log(parseFloat("3.14")); // 3.14

// 10. Number to String conversion
console.log(String(42)); // "42"
console.log((42).toString()); // "42"

// 11. Padding (ES2017)
console.log("5".padStart(3, "0")); // "005"
console.log("5".padEnd(3, "0")); // "500"

// 12. Trimming (ES2019)
console.log("  Hello  ".trimStart()); // "Hello  "
console.log("  Hello  ".trimEnd()); // "  Hello"

// 13. Advanced: Regular Expressions with Strings
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
console.log(emailPattern.test("test@example.com")); // true
console.log("test@example.com".match(emailPattern)); // Match object

const sentence = "The quick brown fox jumps over the lazy dog";
console.log(sentence.replace(/[aeiou]/gi, '*')); // Replace all vowels