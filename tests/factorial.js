const {lvar, run, eq, and, or, add, mul, gt} = require ('../lib/logic.js')

function factorial(N, F) {
  return or(
    and(eq(N, 0), eq(F, 1)),
    (N1=lvar(), F1=lvar())=> and(
      gt(N, 0),
      add(N1, 1, N),
      factorial(N1, F1),
      mul(F1, N, F)
    )
  )
}

const x = lvar('x')
console.log(run([x], factorial(6, x)))