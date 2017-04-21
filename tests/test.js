const {lvar, run, eq, and, or, membero, numbero, stringo, add, succeed, fail, conso, firsto, resto, emptyo, appendo, anyo, gt, lt, le, ge} = require ('../lib/logic.js')

const x = lvar('x')
const y = lvar('y')

// console.log(run(2, [x, y], or(and(eq(x, y), eq(x, 3)), eq(x, 2))))
// console.log(run([x], membero(x, [1, 2])))
// console.log(run(1, [x], and(eq(x, 1), membero(x, [3, 2, 1])))) // [{x: 1}]
// console.log(run(1, [x], and(membero(x, [3, 2, 1]), eq(x, 1)))) // [{x: 1}]
// console.log(run([x], and(eq(y, [1, 2, 3]), membero(x, y))))

// the example below will cause infinite loop
// this behavior is correct (checked with core.logic)
// console.log(run([x], and(membero(x, y), eq(y, [1, 2, 3]))))

// console.log(run([x], and(eq(y, 4), add(y, x, 2))))
// console.log(run(1, [x, y], and(eq(x, y), eq(y, 3))))
// console.log(run(1, [y], and(eq(x, y), eq(x, 1))))
// console.log(run(1, [x, y], and(eq(x, [1, 2, y]), eq(y, 3))))
// console.log(run([x, y], appendo(x, y, [1, 2, 3, 4, 5])))
// console.log(run([x], appendo([1, 2, 3], [4, 5], x)))
// console.log(run([x], appendo([1, 2], x, [1, 2, 3, 4, 5])))
// console.log(run(1, [x, y], and(emptyo(x), eq(y, [1, 2, 3, 4, 5]))))
// console.log(run(1, [x], membero(x, [1, 2])))
// console.log(run(1, [x], mul(x, 2, 7)))
// console.log(run(1, [x], sub(15, x, 12)))
// console.log(run([x], and(membero(x, [1, 2, 3]), membero(x, [2, 3, 4]))))
// console.log(run([x], and(membero(x, y), eq(y, [1, 2, 3]))))
// console.log(run(4, [x], anyo(or(eq(x, 1), eq(x, 2), eq(x, 3)))))
// console.log(run(1, [x, y], conso(x, y, [1, 2, 3])))
// console.log(run(1, [x], firsto(x, [])))
// console.log(run(1, [x], resto(x, [])))
// console.log(run(1, [x], emptyo(x)))
// console.log(run(1, [x], and(eq(x, []), emptyo(x))))
// console.log(run([x], add(x, y, 5)))
// console.log(run([x], and(eq(x, 2), gt(x, 1)))) // [{x: 2}])
// console.log(run([x], and(eq(x, 2), lt(x, 1)))) // []
// console.log(run(10, [x], anyo(or(eq(x, 1), eq(x, 2), eq(x, 3)))))
// console.log(run([x], or(eq(x, 1), (x=lvar())=> eq(x, 2))))
// console.log(run([x], and(gt(x, 1), eq(x, 2)))) // []
// console.log(run([x], and(eq(x, 2), gt(x, 1)))) // [ { x: 2 } ]
/*
function parent(x, y) {
  return or(
    and(eq(x, 'amy'), eq(y, 'bob')),
    and(eq(x, 'bob'), eq(y, 'marco')),
    and(eq(x, 'bob'), eq(y, 'mike'))
  )
}
function grandparent(x, z) {
  const y = lvar()
  return and(parent(x, y), parent(y, z))
}
console.log(run([x,y], grandparent(x, y)))
// [ { x: 'amy', y: 'marco' }, { x: 'amy', y: 'mike' } ]
*/