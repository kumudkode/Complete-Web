// Conversion and Operations
let score=33;
console.log(typeof score); // number
console.log(typeof (score)); // number
score="33";
console.log(typeof score); // string
console.log(typeof (score)); // string
let value= Number(score);
console.log(typeof value); // number
//but what if change the value of score to "33abc"
score="33abc";
console.log(typeof score); // string
let value1= Number(score);
console.log(typeof value1); // number
console.log(value1); // NaN 
// NaN is a special value in js which means not a number 
// why it happened? cause the value is not a number but it is a string
// NaN is a falsy value in js
console.log(value1==NaN); // false
// NaN is not equal to anything including itself
let num=33;
let str=String(num);
console.log(typeof str); // string
console.log(str); // 33
// we can convert a number to a string
// we can convert a string to a number, boolean, object, array, etc
let number=100;
console.log(typeof number); 

let string= "name";
console.log(typeof string+"\n"); //+"\n" is just for new line

let bool= true;
console.log(typeof bool); // boolean 
console.log(bool); // true
let value2= Number(bool);
console.log(value2+"\n"); // 1

// boolean to number conversion
// true = 1 and false = 0
let numb=1;
console.log(typeof numb); // number
let value5=Boolean(numb);
console.log(value5+"\n");
numb="";
console.log(typeof numb); // string 
let value6=Boolean(numb);
console.log(value6+"\n"); // false
numb="ok";
console.log(typeof numb); // string
let value7=Boolean(numb);
console.log(value7+"\n"); // true
// for tab space in console use \t

let object= {name:"raj"};
console.log(typeof object); // object
console.log(object+"\n"); // { name: 'raj' }

let un=undefined;
console.log(typeof un); // undefined
console.log(un); // undefined
let value3=Number(un);
console.log(value3+"\n"); // NaN

let nul=null;
console.log(typeof nul); // object
console.log(nul); // null
let value4=Number(nul);
console.log(value4); // 0

