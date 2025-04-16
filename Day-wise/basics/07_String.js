const userName ='raj'
const repoCount = 50
console.log(userName + repoCount + " Value"); // using String Concatenation
// but its outdated and not use in modern days

console.log(` Hello my name is ${userName} and my repo count is ${repoCount}`); // using strings Interpolation by making placeholders and 'injecting variables inside it using $'

// we can insert methods inside it like uppercase or lowercase
console.log(`My name is ${userName.toUpperCase()}`)

const gameName = new String('raj_game') // here we are creating a string object using "new"
console.log(gameName[0]); // here we are accessing the first element of the string i.e an object not array
console.log(gameName.__proto__); // here we are accessing the prototype of the string object

//if we have to master string we have to master these methods
// 1.length
console.log(gameName.length)

// 2.charAt
console.log(gameName.charAt(2))
// 3.indexOf
console.log(gameName.indexOf('a'))
// 4.slice
console.log(gameName.slice(2,4))
console.log(gameName.slice(-8, -6))
// 5.substring
console.log(gameName.substring(2,4))
// 6.replace
console.log(gameName.replace('raj', 'Raj'))
// 7.split
console.log(gameName.split('_'))
// 8.trim
console.log(gameName.trim())
// 9.toUpperCase
console.log(gameName.toUpperCase())
// its original value did not change 
// 10.toLowerCase
console.log(gameName.toLowerCase())
// 11.concat
console.log(gameName.concat(' is a good boy'))
