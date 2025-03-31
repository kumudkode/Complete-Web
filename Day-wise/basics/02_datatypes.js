"use strict"; 
/* its often used by js dev for  treating all js code as newer version
=> but nowadays it is not needed as all browsers support the latest version of js
=> but still its a good practice to use it
Primitive data types in JS
=> we are using node js for running js files command node )02_datatypes.js
---------------------------------------------------------
Data Types in javascript
*/
let name= "raj"
let age= 5333 // number range is often from 2 to power 53 = 9007199254740991
let isLoggedIn= true
let state; // state is undefined
console.log(typeof name, typeof age, typeof isLoggedIn, typeof state);
console.log(name, age, isLoggedIn, state);
console.log(typeof null); // object
// null is an object in js
// null is a special value in js which means no value or empty value
// null is a falsy value in js

/*===========================================================
number= 2 to power 53
bigint= 2 to power 53
string= " "
boolean= true/false

null= standalone value 
we can intenitionally assign null as a value e.g if we want temp of something but if they say 0 it means its a 0 temp but if we say null it means we dont know the temp of that thing 
********console.log( typeof null=object ) **************
// undefined= value is not assigned to a variable
// undefined is a special value in js which means no value or empty value

undefined= value is not assigned to a variable
symbol= unique value and its not used in our day to day life
// object= collection of key value pairs
// array= collection of values in a single variable
// its a special type of object
// object and array are reference data types
*/

