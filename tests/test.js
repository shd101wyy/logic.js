const {lvar, run, eq, and, or, membero, numbero, stringo, add} = require ('../lib/logic.js')

const x = lvar('x')
const y = lvar('y')
/*
console.log(
  run(2, [x, y], or(
    and(eq(x, y), eq(x, 3)),
    eq(x, 2)))
)*/
/*
console.log(
  run([x], membero(x, [1, 2, 3]))
)
*/

// this is wrong
/*
console.log(
  run([x], and(stringo(x), eq(x, 'abc')))
)
*/

console.log(
  run([x], and(eq(y, 4), add(y, x, 2)))
)