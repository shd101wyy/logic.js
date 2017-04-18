const {lvar, run, eq, and, or, membero, numbero, stringo, add, succeed, fail} = require ('../lib/logic.js')

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
  run([x], and(eq(x, 'abc'), stringo(x), stringo(x), eq(x, 'abc')))
)
*/

// console.log(run([x], membero(x, [1, 2])))
console.log(run([x], and(eq(y, [1, 2, 3]), membero(x, y))))

// the example below will cause infinite loop
// this behavior is correct (checked with core.logic)
console.log(run([x], and(membero(x, y), eq(y, [1, 2, 3]))))
/*
console.log(
  run([x], and(eq(y, 4), add(y, x, 2)))
)
*/



/*
console.log(run([x], (y=lvar())=>
  and(eq(y, [1, 2]),
      eq(x, y))
    ))
*/

/* console.log(run([x], and(eq([1, x], y), eq(y, [1, 3])))) */
/*
console.log(run([x],
  and(
    eq(x, 2),
    (y=lvar())=> and(eq(y, 2), eq(x, y))
  )))
*/

// console.log(run(1, [x, y], and(eq(x, y), eq(y, 3))))
// console.log(run(1, [y], and(eq(x, y), eq(x, 1))))
// console.log(run(1, [x, y], and(eq(x, [1, 2, y]), eq(y, 3))))
// console.log(run([x, y], appendo(x, y, [1, 2, 3, 4, 5])))
// console.log(run([x], appendo([1, 2], x, [1, 2, 3, 4, 5])))
// console.log(run(1, [x, y], and(emptyo(x), eq(y, [1, 2, 3, 4, 5]))))
// console.log(run(1, [x], membero(x, [1, 2])))
// console.log(run(1, [x], mul(x, 2, 7)))
// console.log(run(1, [x], sub(15, x, 12)))