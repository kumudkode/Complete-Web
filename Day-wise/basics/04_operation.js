let value=2;
let negValue=-value;
console.log(negValue); // -2
console.log(2+2); // 4
console.log(2-2); // 0
console.log(2*2); // 4
console.log(2**5); // 32 cause its square of 2^5 = 2*2*2*2*2 = 32
console.log(2/2); // 1
console.log(2%2); // 0
console.log(2**3**2); // 512 cause its square of 2^3 = 2*2*2 = 8 and then 8^2 = 64 and then 64^2 = 512

let str1="hello";
let str2=" world";
console.log(str1+str2); // hello world
console.log("1"+2); // 12
console.log(1+"2"); // 12
console.log("1"+2+2); // 122 //Here if we use string before any number it will treat all as a String ....ToPrimitive means convert to string
console.log(1+2+"2"); // 32 //Here if we use number before any string it will treat numbers as a Number and String as a String lastly...... ToPrimitive means convert to number
// https://tc39.es/ecma262/multipage/abstract-operations.html#sec-toprimitive for more details

console.log(1+2*(2*2)+(3/3)) // using paranthesis is good sign ()
console.log(+true) // true
//console.log(true+) // error not allowed
console.log(+""); // 0 but dont do in operations

let num1, num2, num3;
num1=num2=num3=2;
let numall=num1+num2+num3;
console.log("\n"+numall);

let gameCounter=100;
gameCounter++; //postfix
console.log(gameCounter); //101
++gameCounter; //prefix
console.log(gameCounter); //101

//link to study
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators

//-----------------------------------------
//-----------------------------------------
//Comparison
// console.log(2>4);
// console.log(4>2);
// console.log(2>=4);
// console.log(4>=2);
// console.log(2<4);
// console.log(4<2);
// console.log(2<=4);
// console.log(4<=2);
// console.log(2==4);
// console.log(4==2);
// console.log(2!=4);
// console.log(4!=2);

// never compare different datatypes e.g
console.log("2"<4);
console.log("02">3);

console.log(null>0);
console.log(null>null);
console.log(null==0);
console.log(null>=0);
console.log("\n");
// the reason is that an equality check == and comparisons > < >= <= work differently.
// comparison convert null to a number, trating it as 0.
//that's why(3) null>=0 is true and(1) null>0 is false;

console.log(undefined>0);
console.log(undefined>null);
console.log(null>undefined);



