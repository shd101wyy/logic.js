---
presentation:
  enableSpeakerNotes: true
---

<!-- slide -->
# miniKanren -
## Relational (Logic) programming     

Yiyi Wang  

<!-- slide vertical:true -->
### What is miniKanren?
http://minikanren.org/  

miniKanren is an embeded Domain Specific Language for logic programming.  

It was originally written in Scheme, and has been ported to dozens of other host languages over the past decade..         

The core miniKanren language is very simple, with only three logical operators (`eq`, `and`, `or`) and one interface operator `run`.  

<aside class="notes">
miniKanren is heavily influenced by Prolog. One of the differences is that, while a typical Prolog implementation might be thousands of lines of C code, a miniKanren lan- guage is usually implemented in somewhere under 1000 lines. The original published implementation of miniKanren was 265 lines of Scheme code. Recently the core of miniKanren implementation has been simplified even furtuher, resulting in a tiny 'micro kernel' called `microKanren`, which consists of only 40 lines of Scheme code. 
</aside>

<!-- slide vertical:true -->
## logic.js  
&nbsp;&nbsp;is a **JavaScript** implementation of a modified version of *miniKanren*.   

@import "./javascript.md"

@import "./logic.js.md"