(function() {
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

  class ImmutableMap {
    constructor(data = []) {
      this.data = data // [[key, val]]
    }

    set(key, val) {
      let find = false,
          data = []
      for (let i = 0; i < this.data.length; i++) {
        const pair = this.data[i]
        if (key !== pair[0]) {
          data.push(pair)
        }
      }
      data.push([key, val])
      return new ImmutableMap(data)
    }

    get(key) {
      for (let i = 0; i < this.data.length; i++) {
        const pair = this.data[i]
        if (key === pair[0]) return pair[1]
      }
      return undefined
    }

    toMap() {
      return new Map(this.data)
    }

    pprint() {
      console.log(this.toMap())
    }

    toString() {
      return this.toMap().toString()
    }
  }

  /*
  class Domain {
    constructor(min, max) {
      this.min = min
      this.max = max
    }

    equal(v) {
      if (isDomain(v)) {
        return this.min === v.min && this.max === v.max
      } else if (typeof(v) === 'number') {
        return v >= this.min && v <= this.max
      } else {
        return v === this
      }
    }

    toNumber() {
      if (this.min === this.max)
        return this.min
      else
        return this
    }
  }
  const REAL_DOMAIN = new Domain(-Infinity, Infinity)

  function isDomain(x) {
    return x && x.constructor === Domain
  }
  */

  function isLVar(x) {
    return x && x.constructor === LVar
  }

  function isArray(x) {
    return x && x.constructor === Array
  }

  function pprint(x) {
    if (x && x.constructor === ImmutableMap) {
      x.pprint()
    } else {
      console.log(x)
    }
  }

  const dot = function(){}

  /**
   * Walk
   * x, {x=>12}        => 12
   * x, {x=>y}         => y
   * x, {x=>y, y=>13}  => 13
   * x, {y=>12}        => x
   */
  function walk(key, sMap) {
    if (isLVar(key)) {
      const val = sMap.get(key)
      if (val === undefined) return key // not found
      return walk(val, sMap) // continue
    } else {
      return key
    }
  }

  function deepwalk(key, sMap) {
    const val = walk(key, sMap)
    if (isArray(val)) {
      // return val.map((x) => deepwalk(x, sMap))
      let o = []
      for (let i = 0; i < val.length; i++) {
        const x = val[i]
        if (x === dot) {
          const rest = deepwalk(val[i+1], sMap)
          o = o.concat(rest)
          break
        } else {
          o.push(deepwalk(x, sMap))
        }
      }
      return o
    } else {
      return val
    }
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
    const xIsLVar = isLVar(x),
          yIsLVar = isLVar(y)

    if (x === y) {
      return sMap
    } else if (xIsLVar) {
      return sMap.set(x, y)
    } else if (yIsLVar) {
      return sMap.set(y, x)
    } else if (isArray(x) && isArray(y)) {
      return unifyArray(x, y, sMap)
    } else { // failed to unify
      return null
    }
  }

  // x and y are arrays
  function unifyArray(x, y, sMap) {
    if (!x.length && !y.length) return sMap
    if (x[0] === dot) {
      return unify(x[1], y, sMap)
    } else if (y[1] === dot) {
      return unify(y[1], x, sMap)
    } else if ((x.length && !y.length) ||
               (!x.length && y.length)) {
      return null
    }

    const s = unify(x[0], y[0], sMap)
    return s && unify(x.slice(1), y.slice(1), s)
  }

  function succeed() {
    return function*(sMap) {
      yield sMap
    }
  }

  function fail() {
    return function*(sMap) {
      yield null
    }
  }

  /**
   * and
   */
  function and(...clauses) {
    return function*(sMap) {
      function* helper(offset, sMap) {
        if (offset === clauses.length) return

        let clause = clauses[offset]
        if (clause.constructor.name !== 'GeneratorFunction') {
          clause = clause()
        }

        let gen = clause(sMap)
        while (true) {
          let res = gen.next(),
              sMap = res.value
          if (res.done) break
          if (sMap) {
            if (offset === clauses.length - 1) {
              yield sMap
            } else {
              yield* helper(offset + 1, sMap)
            }
          } else {     // error
            yield null // failed
          }
        }
      }

     yield* helper(0, sMap)
    }
  }

  /**
   * or
   */
  function or(...clauses) {
    return function*(sMap) {
      function* helper(offset, sMap) {
        if (offset === clauses.length) return

        let clause = clauses[offset]
        if (clause.constructor.name !== 'GeneratorFunction') {
          clause = clause()
        }

        const gen = clause(sMap)
        while (true) {
          const res = gen.next(),
                sMap = res.value
          if (res.done) break
          if (sMap) yield sMap
        }

        yield* helper(offset + 1, sMap)
      }

      yield* helper(0, sMap)
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
    lvarCounter = 0 // reset counter
    if (arguments.length === 2) {
      goal = vars
      vars = num
      num = -1 // get all possible results
    }

    if (goal.constructor.name !== 'GeneratorFunction') {
      goal = goal()
    }

    if (!(vars instanceof Array)) {
      vars = [vars]
    }

    const results = []
    let sMap = new ImmutableMap(),
          gen = goal(sMap)

    while (num) {
      const res = gen.next(),
            sMap = res.value
      if (res.done) break
      if (sMap) {
        num--
        const r = new Map()
        vars.forEach((v)=> {
          r[v] = deepwalk(v, sMap)
        })
        results.push(r)
      }
    }
    // console.log(sMap)
    return results
  }

  function conso(first, rest, out) {
    if (isLVar(rest)) {
      return eq([first, dot, rest], out)
    } else {
      return eq([first, ...rest], out)
    }
  }

  function firsto(first, out) {
    return function(rest=lvar()) {
      return conso(first, rest, out)
    }
  }

  function resto(rest, out) {
    return function(first=lvar()) {
      return conso(first, rest, out)
    }
  }

  function emptyo(x) {
    return eq(x, [])
  }

  function membero(x, arr) {
    return or(
      (first=lvar())=> and(
        firsto(first, arr),
        eq(first, x)
      ),
      (rest=lvar()) => and(
        resto(rest, arr),
        membero(x, rest)
      )
    )
  }

  function appendo(seq1, seq2, out) {
    return or(
      and(emptyo(seq1), eq(seq2, out)),
      (first=lvar(), rest=lvar(), rec=lvar())=> and(
            conso(first, rest, seq1),
            conso(first, rec, out),
            appendo(rest, seq2, rec)))
  }

  /*
    Constraints has to be sequential
   */
  // a + b = c
  function add(a, b, c) {
    return function*(sMap) {
      let numOfLVars = 0,
          lvar_ = null

      a = walk(a, sMap)
      b = walk(b, sMap)
      c = walk(c, sMap)

      const aIsLVar = isLVar(a),
            bIsLVar = isLVar(b),
            cIsLVar = isLVar(c)

      if (aIsLVar) { lvar_ = a; numOfLVars++ }
      if (bIsLVar) { lvar_ = b; numOfLVars++ }
      if (cIsLVar) { lvar_ = c; numOfLVars++ }

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
        yield null
      }
    }
  }

  // a - b = c
  function sub(a, b, c) {
    return add(b, c, a)
  }

  // a * b = c
  function mul(a, b, c) {
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
        if (a * b === c) yield sMap
        else yield null
      } else if (numOfLVars === 1) {
        if (lvar_ === a) {
          if (typeof(c) === 'number' && typeof(b) === 'number')
            yield* eq(a, c / b)(sMap)
          else
            yield null
        } else if (lvar_ === b) {
          if (typeof(c) === 'number' && typeof(a) === 'number' )
            yield* eq(b, c / a)(sMap)
          else
            yield null
        } else { // c
          if (typeof(a) === 'number' && typeof(b) === 'number')
            yield* eq(c, a * b)(sMap)
          else
            yield null
        }
      } else {
        yield null
      }
    }
  }

  // a / b = c
  function div(a, b, c) {
    return mul(b, c, a)
  }

  function lt(x, y) {
    return function*(sMap) {
      x = walk(x, sMap)
      y = walk(y, sMap)
      if (typeof(x) === 'number' && typeof(y) === 'number' && x < y) yield sMap
      yield null
    }
  }

  function le(x, y) {
    return function*(sMap) {
      x = walk(x, sMap)
      y = walk(y, sMap)
      if (typeof(x) === 'number' && typeof(y) === 'number' && x <= y) yield sMap
      yield null
    }
  }

  function gt(x, y) {
    return lt(y, x)
  }

  function ge(x, y) {
    return le(y, x)
  }

  function stringo(x) {
    return function*(sMap) {
      const val = walk(x, sMap)
      if (typeof(val) === 'string') yield sMap
      yield null // not of type string
    }
  }

  function numbero(x) {
    return function*(sMap) {
      const val = walk(x, sMap)
      if (typeof(val) === 'number') yield sMap
      yield null // not of type number
    }
  }

  function arrayo(x) {
    return function*(sMap) {
      const val = walk(x, sMap)
      if (isArray(val)) yield sMap
      yield null // not of type array
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

  const logic = { lvar, run, and, or, eq, facts,
                  conso, firsto, resto, emptyo, membero, appendo,
                  numbero, stringo, arrayo,
                  add, sub, mul, div,
                  lt, le, gt, ge,
                  succeed, fail }

  if (typeof(module) !== 'undefined')
    module.exports = logic

  if (typeof(window) !== 'undefined')
    window.logic = logic
}())
