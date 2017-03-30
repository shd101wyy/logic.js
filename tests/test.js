const {lvar, run, eq, and, or} = require ('../lib/logic.js')

const x = lvar('x')
const y = lvar('y')
console.log(
  run(2, [x, y], or(
    and(eq(x, y), eq(x, 3)),
    eq(x, 2)))
)