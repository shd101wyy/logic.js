<!-- slide -->
## Brief introduction of
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/480px-Unofficial_JavaScript_logo_2.svg.png" width="200" />

<aside class="notes">
JavaScript is a high level, dynamic, untyped, and interpreted programming language created originally for web browsers. Nowadays, JavaScript can also be run on the server-side by using Node.js.  
Node.js is an open-source, cross-platform JavaScript run-time environment for executing JavaScript code server-side, and uses the Chrome V8 JavaScript engine.
</aside>

<!-- slide vertical:true -->  
## ECMAScript 2016 (ES6)  
<aside class="notes">
What is the relationship between JavaScript and ECMAScript?  
ECMAScript is a Standard for scripting language. Languages such as JavaScript, JScript, and ActionScript are based on the ECMAScript standard.  
ECMAScript 2016 (ES6) is the newest version of ECMAScript.  
And my implementation of miniKanren uses a lot of features of ES6.    
</aside>

<!-- slide vertical:true -->
## Why JavaScript - Pros  
* easy syntax  
* higher order function
* independent from any big company  
* the only native web browser language  
* big community  
* lots of tools, libraries, and framworks   

<!-- slide vertical:true -->
## Variables  
```javascript
var x  // x = undefined
var y = "Hello JS"
```

<!-- slide vertical:true -->
## Function
```javascript
function add(x, y) {
  return x + y
}

// or

var add = function(x, y) {
  return x + y
}
```
<!-- slide vertical:true -->
## Data types
* primitive
  * String
  * Number  
  * Boolean  
  * Undefined  
  * Null  
* non-primitive  
  * Array  
  * Object  
  * RegExp  

<!-- slide vertical:true -->
## String
```javascript
var x = "a"
var y = 'a'
x === y // true
```
<aside class="notes">
String can be represented by single quotes or double quotes.
And we use triple equal sign to compare strings.  
</aside>

<!-- slide vertical:true -->
## Array  
```javascript  
var x = [1, 2]
console.log(x.length) // 2
x.push(3) // x = [1, 2, 3]
```

<!-- slide vertical:true -->
## Object
```javascript
var x = {a: 1}
console.log(x.a)     // 1  
console.log(x['a'])  // 1
x.b = 2              // {a: 1, b: 2}
x.a = 3              // {a: 3, b: 2}
```

<!-- slide vertical:true -->  
## Why use ES6  
(the newest version of JavaScript)
<aside class="notes">
The old version of JavaScript has a lot of pitfalls
</aside>

<!-- slide vertical:true -->  
```javascript  
var foo = 'OUT'

if (true) {
  var foo = 'IN'
}

console.log(foo) // IN
```  
<aside class="notes">
the keyword var is function-scoped but not block-scoped.
</aside>

<!-- slide vertical:true -->  
# let - A new <strike>Hope</strike> Scope  
```javascript  
let foo = 'OUT'

if (true) {
  let foo = 'IN'
}

console.log(foo) // OUT
```  

<!-- slide vertical:true -->
# const
```javascript
const x = 1
x = 2 // cause error.
```
<aside class="notes">
Constants are block-scoped, much like variables defined using the let statement. The value of a constant cannot change through re-assignment, and it can't be redeclared.
</aside>

<!-- slide vertical:true -->  
# Arrow function  
```javascript
function(x, y) {
  return x + y
}

(x, y) => {
  return x + y
}

(x, y) => x + y
```

<!-- slide vertical:true -->  
# Default Parameters
```javascript
function add(x=1, y=2) {
  return x + y
}

var add = (x=1, y=2)=> x + y

add()  // 3
add(3) // 5
add(undefined, 3) // 4
```

<!-- slide vertical:true -->  
# Rest Parameters
```javascript
function add(first, second, ...rest) {
  console.log('first: ', first)
  console.log('second: ', second)
  console.log('rest: ', rest)
}
add(1, 2, 3, 4, 5)
// first: 1
// second: 2
// rest: [3, 4, 5]
```


<!-- slide vertical:true -->
# Generator
```javascript
function* genFour() {
  yield 1
  yield 2
  console.log('Hello World')
  yield 3
}
let four = genFour()
four.next()  
// Object { value: 1, done: false }
four.next()  
// Object { value: 2, done: false }
four.next()  
// Hello World
// Object { value: 3, done: false }
four.next()
// Object { value: undefined, done: true }
```

<aside class="notes">
Generator can stop and resume the execution of a function.  
</aside>


<!-- slide vertical:true -->
```JavaScript
function* anotherGenerator(i) {
  yield i + 1;
  yield i + 2;
  yield i + 3;
}

function* generator(i) {
  yield i;
  yield* anotherGenerator(i);
  yield i + 10;
}

var gen = generator(10);

console.log(gen.next().value); // 10
console.log(gen.next().value); // 11
console.log(gen.next().value); // 12
console.log(gen.next().value); // 13
console.log(gen.next().value); // 20
```

<!-- slide vertical:true -->
$\longrightarrow$ miniKanren in JavaScript.  