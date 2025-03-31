const accountId = 12345;
// accountId = 2; // not allowed
// we can not change or update the value of a same constant variable
let accountEmail = "abc@gmail.com";
accountEmail = 2; // allowed
// we can change or update the value of a let variable
var accountPassword = "12345";
accountPassword = "212121"; // allowed

accountCity= "vas"; // allowed
// we can create a variable without var, let or const
// but it is not recommended

console.log(accountId, accountEmail, accountPassword);
console.table([accountId, accountEmail, accountPassword]);

// in previous time javascript does not know what is scope 
{
    let blockScopedVariable = "I am inside a block";
    console.log(blockScopedVariable);
}
// console.log(blockScopedVariable); // ReferenceError: blockScopedVariable is not defined
// let and const are block scoped variables
// var is function scoped variable
// there was a issue in var that is we can redeclare a variable with var keyword 
// but we can not redeclare a variable with let and const keywor