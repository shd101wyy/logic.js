# logic.js
JavaScript implementation of modified version of miniKanren.  

Check this [presentation](https://rawgit.com/shd101wyy/logic.js/master/docs/miniKanren.html).  

## Install
node.js
```sh
npm install logic_js --save
```

browser
```html
<script src="logic.js"></script>
```
where `logic.js` is located at `./lib` folder.  

## Usages
### Core
```javascript
const {lvar, run, and, or, eq} = require('logic_js') // or `logic` in browser

const x = lvar('x') // define logic variable with id 'x'

run(1, [x], eq(x, 1)) // query 'x' => [{x: 1}]
run(1, [x], (y=lvar()=> and(
  eq(y, 1),
  eq(x, y)
))) // => [{x: 1}]

run([x], or(eq(x, 1), eq(x, 2)))    // [{x: 1}, {x: 2}]
run([x], or(1, eq(x, 1), eq(x, 2))) // [{x: 1}]
```

### Facts
```javascript
const {facts} = require('logic_js')
// FACT
const parent = facts(['Steve', 'Bob'],      // Steve is Bob's parent
                   ['Steve', 'Henry'],    // Steve is Henry's parent
                   ['Henry', 'Alice'])    // Henry is Alice's parent
const x = lvar()
run(1, [x], parent(x, 'Alice'))      // who is Alice's parent => ['Henry']
run(2, [x], parent('Steve', x))      // who are Steve's children => ['Bob', 'Henry']

// RULE
const grandparent = (x, y)=> {
  let z = lvar()
  return and(parent(x, z), parent(z, y)) // x is z's parent and z is y's parent => x is y's parent
}

run(1, [x], grandparent(x, 'Alice'))  // who is Alice's grandparent => ['Steve']
```

### Array manipulation
```javascript
const {conso, firsto, resto,
      emptyo, membero, appendo} = require('logic_js')

const x = lvar('x'),
      y = lvar('y')

run([x], membero(x, [1, 2, 3]))
// [{x: 1}, {x: 2}, {x: 3}]

run([x, y], conso(x, y, [1, 2, 3]))
// [{x: 1, y: [2, 3]}]

run([x, y], appendo(x, y, [1, 2]))
/*
[ {x: [], y: [1, 2]},
  {x: [1], y: [2]}
  {x: [1, 2], y: []} ]
*/
```

### Arithmetic & Comparison
```javascript
const { add, sub, mul, div,
        lt, le, gt, ge } = require('logic_js')

run([x], add(2, x, 5))
// [{x: 3}]
```

### Extra
```javascript
const {succeed, fail, anyo} = require('logic_js')

run([x], and(eq(x, 1), succeed()))
// [{x: 1}]

run([x], and(eq(x, 1), fail()))
// []

run(4, [x], anyo(or(eq(x, 1), eq(x, 2), eq(x, 3))))
// [{x: 1}, {x: 2}, {x: 3}, {x: 1}]
```


## References
[microKanren](http://webyrd.net/scheme-2013/papers/HemannMuKanren2013.pdf)  
[microLogic](http://mullr.github.io/micrologic/literate.html)  
[cKanren](https://github.com/clojure/core.logic)  
[aKanren](http://webyrd.net/)  
[JavaScript stream](http://blog.jeremyfairbank.com/javascript/functional-javascript-streams-2/)  
[core.logic](https://github.com/clojure/core.logic/wiki/A-Core.logic-Primer#Introduction)