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

const logic = {lvar, run, and, or, eq}
module.exports = logic