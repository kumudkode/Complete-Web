const userName ='raj'
const repoCount = 50
console.log(userName + repoCount + " Value"); // using String Concatenation
// but its outdated and not use in modern days

console.log(` Hello my name is ${userName} and my repo count is ${repoCount}`); // using strings Interpolation by making placeholders and 'injecting variables inside it using $'

// we can insert methods inside it like uppercase or lowercase
console.log(`My name is ${userName.toUpperCase()}`)

const gameName = new String('raj-game') // here we are creating a string object using "new"
console.log(gameName[0]); // here we are accessing the first element of the string i.e an object not array
console.log(gameName.__proto__); // here we are accessing the prototype of the string i.e object

//if we have to master string we have to master these methods
// 1.length
console.log(gameName.length)

// 2.charAt
console.log(gameName.charAt(2))
// 3.indexOf
console.log(gameName.indexOf('a'))
// 4.slice
console.log(gameName.slice(2,4)) // 

console.log(gameName.slice(-8, -6))

// 5.substring
console.log(gameName.substring(0,6)) // substring(-5,6)=> substring(0,6) negative value consider as 0

// 6. trim and replace methods
// sometimes we dont need spaces while storing values like in password
const newStringOne="    hilt"
console.log(newStringOne)
console.log(newStringOne.trim())

// const url ='https://kumud.com/kumud raj' // browser dont understand spaces and add%20 instead of space so what will we do to replace it 
const url ='https://kumud.com//kumud%20raj'
console.log(url.replace('%20','_'))

//lets find out if something is include in that const value
console.log(url.includes('kumud')) // true
console.log(url.includes('Kumud')) // false

console.log(gameName.split('-')); // before raj-game after 'raj' 'game'
