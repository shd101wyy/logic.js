/**
 * Logic Variable
 */

class LVar {
  constructor(id) {
    this.id = id
  }

  toString() {
    return this.id
  }
}

let lvarCounter = 0 // global counter
function lvar(id) {
  if (!id) {
    id = `~.${lvarCounter}`
    lvarCounter += 1
  }
  return new LVar(id)
}

function isLVar(x) {
  return x.constructor === LVar
}

/**
 * Walk
 * x, {x=>12}        => 12
 * x, {x=>y}         => y
 * x, {x=>y, y=>13}  => 13
 * x, {y=>12}        => x
 */
function walk(key, sMap) {

  function helper(key, sMap) {
    if (key === undefined) {
      return undefined
    } else if (isLVar(key)) {
      const val = sMap[key]
      if (val === undefined) return key // not found
      return helper(val, sMap) // continue
    } else {
      return key
    }
  }

  return helper(key, sMap)
}

/**
 * Unify
 *
 * @params: x, y, sMap
 * @goal: make x and y equal in sMap
 *
 * x, 12, {} => {x=>12}
 * x, y, {} => {x=>y}
 * x, m, {x=>12, m=>n} => {x=>12, m=>n, n=>x}
 */
function unify(x, y, sMap) {
  x = walk(x, sMap)
  y = walk(y, sMap)
  xIsLVar = isLVar(x)
  yIsLVar = isLVar(y)

  if (x === y) {
    return sMap
  } else if (xIsLVar) {
    sMap[x] = y
    return sMap
  } else if (yIsLVar) {
    sMap[y] = x
    return sMap
  } else { // failed to unify
    return null
  }
}

/**
 * and
 */
function and(...clauses) {
  return function*(sMap) {
    sMap = new Map(sMap) // clone old map
    function* helper(offset) {
      if (offset === clauses.length) return
      let gen = clauses[offset](sMap)
      while (true) {
        let res = gen.next(),
            map = res.value
        if (res.done) break
        if (map) {
          if (offset === clauses.length - 1) {
            yield map
          } else {
            yield* helper(offset + 1)
          }
        } else {     // error
          yield null // failed
        }
      }
    }

   yield* helper(0)
  }
}

/**
 * or
 */
function or(...clauses) {
  return function*(sMap) {
    function* helper(offset) {
      if (offset === clauses.length) return
      const gen = clauses[offset](new Map(sMap))
      while (true) {
        const res = gen.next(),
              map = res.value
        if (res.done) break
        if (map) yield map
      }

      yield* helper(offset + 1)
    }

    yield* helper(0)
  }
}

/**
 * eq
 */
function eq(x, y) {
  return function*(sMap) {
    yield unify(x, y, sMap)
  }
}

/**
 * run
 */
function run(num, vars, goal) {
  if (arguments.length === 2) {
    goal = vars
    vars = num
    num = -1 // get all possible results
  }
  if (!(vars instanceof Array)) {
    vars = [vars]
  }

  const results = [],
        sMap = new Map(),
        gen = goal(sMap)

  while (num) {
    const res = gen.next(),
          map = res.value
    if (res.done) break
    if (map) {
      num--
      const r = new Map()
      vars.forEach((v)=> {
        r[v] = walk(v, map)
      })
      results.push(r)
    }
  }
  return results
}

function typeof$(x, type) {
  return function*(sMap) {
    const val = walk(x, sMap)
    if (typeof(val) === type) {
      yield sMap // success
    } else {
      yield null // failed
    }
  }
}

/**
 * numbero
 * check if a logical variable is number
 */
function numbero(x) {
  return typeof$(x, 'number')
}


/**
 * stringo
 * check if a logical variable is string
 */
function stringo(x) {
 return typeof$(x, 'string')
}

/**
 * add
 * a + b = c
 */
function add(a, b, c) {
  return function*(sMap) {
    let numOfLVars = 0,
        lvar_ = null

    a = walk(a, sMap)
    b = walk(b, sMap)
    c = walk(c, sMap)

    if (isLVar(a)) { lvar_ = a; numOfLVars++ }
    if (isLVar(b)) { lvar_ = b; numOfLVars++ }
    if (isLVar(c)) { lvar_ = c; numOfLVars++ }

    if (numOfLVars === 0) {
      if (a + b === c) yield sMap
      else yield null
    } else if (numOfLVars === 1) {
      if (lvar_ === a) {
        if (typeof(c) === 'number' && typeof(b) === 'number')
          yield* eq(a, c - b)(sMap)
        else
          yield null
      } else if (lvar_ === b) {
        if (typeof(c) === 'number' && typeof(a) === 'number' )
          yield* eq(b, c - a)(sMap)
        else
          yield null
      } else { // c
        if (typeof(a) === 'number' && typeof(b) === 'number')
          yield* eq(c, a + b)(sMap)
        else
          yield null
      }
    } else {
      yield sMap
    }
  }
}


/**
 * fact
 */
function facts(...facs) {
 return function(...args) {
   return or.apply(null,
                   facs.map(fac => and.apply(null,
                                              fac.map((facArg, i)=> eq(facArg, args[i])))))
                                            }
}

/**
 * membero
 */
function membero(x, arr) {
  return or.apply(null, arr.map(elem => eq(elem, x)))
}

const logic = {lvar, run, and, or, eq, facts, membero, numbero, stringo, add}
module.exports = logic