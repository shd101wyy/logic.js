# Relational Programming using logic.js
`logic.js` is a JavaScript implementation of modified version of miniKanren.

`logic.js` introduces many useful functions (operators), and they can be loaded in `nodejs` like below:
```javascript
const {lvar, eq, and, or, run} = require('logic.js')
```

Where `lvar` denotes `logic variable`  
```javascript
const q = lvar('q') // {id: "q"}
const x = lvar()    // {id: "~.0"}
const y = lvar()    // {id: "~.1"}
```

Below is an anonymous function.  
`x`, `y`, `z` are initialized as logic variables. And it returns a relation.  
```javascript
function() {
  const x = lvar(), // ~.0
        y = lvar(), // ~.1
        z = lvar()  // ~.2
  return and(eq(x, y), eq(z, 3))
}
```

The anonymous function can be written as `ES6 arrow function` like below.
```javascript
(x=lvar(), y=lvar(), z=lvar())=> and(eq(x, y), eq(z, 3))
// #function
```

Here comes the `run` function, which has 3 parameters.    
```javascript
const q = lvar('q') // q
run(1, [q], (x=lvar(), y=lvar(), z=lvar())=>
    and(eq(x, y),
        eq(z, 3)))
// [{q: q}]
```

We can get back more interesting values by unifying the query variable with another term.
```javascript
const q = lvar('q')
run(1, [q], (x=lvar(), y=lvar())=>
  and(eq(q, 3),
      eq(x, y)))
// [{y: 3}]
```

```javascript
const q = lvar('q')
run(1, [q], (x=lvar(), z=lvar())=>
  and(eq(x, z),
      eq(3, z),
      eq(q, x)))
// [{q: 3}]
```

```javascript
const y = lvar('y')
run(1, [y], and(
  (x=lvar(), y=lvar())=> and(eq(4, x), eq(x, y))
  eq(3, y)
))
// [{y: 3}]
```
In the code above, `y` introduced in anonymous function is different from the `y` defined at start.  

A `run` expression can return the empty list, indicating that the body of the expression is logically inconsistent.
```javascript
run(1, [x], eq(4, 5))
// []
```

```javascript
run(1, [x], and(eq(x, 5), eq(x, 6)))
// []
```

We say that a logically inconsistent relation *fails*, while a logically consistent relation, such as `eq(3, 3)`, *succeed*.  

`or`, can be used to produce multiple answers. it can be thought of as disjunctive normal form: each clause represents a disjunct, and is independent of the other clause. For example, the expression produces two answers.  
```javascript
run(2, [x], or(
  eq(x, 1),
  eq(x, 2)
))
// [{x: 1}, {x: 2}]
```   

I extend core miniKanren with the following operators.  
```javascript
const {membero, neq, plus, minus} = require('logic.js')
```

It is very easy to define `fact` and `rules` using `logic.js` library.  
The code below defines a fact `parent`.

```javascript
// FACT
const parents = facts(
  ['Steve', 'Bob'],      // Steve is Bob's parent
  ['Steve', 'Henry'],    // Steve is Henry's parent
  ['Henry', 'Alice']    // Henry is Alice's parent
)
```

and a rule `grandparent`
```javascript
// RULE
const grandparent = function(x, y) {
  const z = lvar()
  return and(parent(x, z), parent(z, y)) // x is z's parent and z is y's parent => x is y's parent
}
```

therefore   
```javascript
run(1, [x], grandparent(x, 'Alice'))
// [{x: 'Steve'}]
```


## References
[miniKanren official website](http://minikanren.org/)  
[miniKanren tutorial](http://io.livecode.ch/learn/webyrd/webmk)