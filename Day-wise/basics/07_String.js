const userName ='raj'
const repoCount = 50
console.log(userName + repoCount + " Value"); // using String Concatenation
// but its outdated and not use in modern days

console.log(` Hello my name is ${userName} and my repo count is ${repoCount}`); // using strings Interpolation by making placeholders and 'injecting variables inside it using $'

// we can insert methods inside it like uppercase or lowercase
console.log(`My name is ${userName.toUpperCase()}`)

