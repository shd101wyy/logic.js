// linked list
// lisp style
class List {
  constructor(first, rest) {
    this.first = first
    this.rest = rest
  }
}

let cons = (a, b)=> new List(a, b)
let car = (x)=> x.first
let cdr = (x)=> x.rest
let emptyMap = [] // just an object representing empty map
let map = ()=> emptyMap
// let x = map()
// let x1 = mapSet(x, 'a', 1)
// let x2 = mapSet(x1, 'b', 2)
let mapSet = (m, key, value)=> {
  if (m === emptyMap) return cons(cons(key, value), m)
  let findKey = false,
      output = emptyMap
  while (m !== emptyMap) {
    let pair = car(m)
    if (car(pair) === key) {
      findKey = true
      output = cons(cons(key, value), output)
    } else {
      output = cons(pair, output)
    }
    m = cdr(m)
  }

  if (!findKey) {
    output = cons(cons(key, value), output)
  }

  return output
}
let mapGet = (m, key)=> {
  while (m !== emptyMap) {
    let pair = car(m)
    if (car(pair) === key) return cdr(pair)
    m = cdr(m)
  }
  return null
}
let mapKeys = (m)=> {
  let output = []
  while (m !== emptyMap) {
    let key = car(car(m))
    output.push(key)
    m = cdr(m)
  }
  return output
}

/**
 *  Logic Variable
 */
class LVar {
  constructor(id) {
    this.id = id
  }

  toString() {
    return this.id
  }
}

let lvar = (id)=> {
  return new LVar(id)
}

let isLVar = (x)=> {
  return x.constructor === LVar
}

/*
  x, {x=>12}        => 12
  x, {x=>y}         => y
  x, {x=>y, y=>13}  => 13
  x, {y=>12}        => x
 */
let walk = (key, sMap)=> {
  let mark = new Map()

  let helper = (key, sMap)=> {
    if (key == null) {
      return null
    } else if (mark.has(key)) { // already visited
      return key
    } else if (isLVar(key)) {
      mark.set(key, true)  // mark as visited
      let val = mapGet(sMap, key)
      if (val == null) return key
      return helper(val, sMap)
    } else {
      return key
    }
  }
  return helper(key, sMap)
}

/*

  @params: x, y, sMap
  @goal: make x and y equal in sMap

  x, 12, {} => {x=>12}
  x, y, {} => {x=>y}
  x, m, {x=>12, m=>n} => {x=>12, m=>n, n=>x}

*/
let unify = (x, y, sMap)=> {
  let xVal = walk(x, sMap),
      yVal = walk(y, sMap),
      xValIsLVar = isLVar(xVal),
      yValIsLVar = isLVar(yVal)

  if (xVal === yVal) {
    return sMap
  } else if (xValIsLVar) {
    return mapSet(sMap, xVal, y)
  } else if (yValIsLVar) {
    return mapSet(sMap, yVal, x)
  } else {
    return null
  }
}

let and = (...args)=> {
  return function*(sMap) {
    function* helper(sMap, args, offset) {
      if (offset === args.length) return
      let arg = args[offset],
          gen = arg(sMap)
      while (true) {
        let res = gen.next(),
            vMap = res.value
        if (vMap) {
          if (offset === args.length - 1) {
            yield vMap
          } else {
            yield* helper(vMap, args, offset + 1)
          }
        } else {     // error
          yield null // failed
        }
        if (res.done) {
          break
        }
      }
    }
    /*
    for(let i = 0; i < args.length; i++) {
      sMap = args[i](sMap)
    }
    yield sMap
    */
   yield* helper(sMap, args, 0)
  }
}

let or = (...args)=> {
  return function*(sMap) {
    function* helper(sMap, args, offset) {
      if (offset === args.length) return
      let arg = args[offset],
          gen = arg(sMap)
      while (true) {
        let res = gen.next(),
            vMap = res.value
        if (vMap) {
          yield vMap
        }
        if (res.done) break
      }
      yield* helper(sMap, args, offset + 1)
    }
    /*
    for(let i = 0; i < args.length; i++) {
      let resultMap = args[i](sMap)
      if (resultMap !== null) {
        yield resultMap
      }
    }
    return null
    */
   yield* helper(sMap, args, 0)
  }
}

/*
  eq

  x = lvar('x')
  eq(x, 1)

 */
let eq = (x, y)=> {
  return function*(sMap) {
    yield unify(x, y, sMap)
  }
}

/*
  run

  let x = lvar('x'),
      y = lvar('y').
      ...
  run(1, x, eq(x, 5)) => [5]

  run(1, x, and(eq(x, y),
                eq(y, 12))) => [12]

  run(2, x, or(eq(x, 1), eq(x, 2), eq(x, 3))) => [1, 2]

 */
let run = (num, var_, arg)=> {
  let output = [],
      gen = arg(map())
  while (num) {
    let res = gen.next(),
        sMap = res.value
    if (res.done) break
    if (sMap) {
      num--
      output.push(walk(var_, sMap))
    }
  }
  return output
}

// define facts
let facts = (...facs)=> {
  return function(...args) {
    return or.apply(null,
                    facs.map(fac => and.apply(null,
                                               fac.map((facArg, i)=> eq(facArg, args[i])))))
  }
}

// x is a member of arr
// x ∈ arr
let membero = (x, arr)=> {
  // return or(eq(x, arr[0]), eq(x, arr[1]), ...)
  return or.apply(null, arr.map(elem => eq(x, elem)))
}

let logic = { lvar, run, eq, and, or, membero, facts }
export { lvar, run, eq, and, or, membero, facts }
export default logic
