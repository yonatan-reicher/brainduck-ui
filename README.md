<h1 align="center">🧠🦆</h1>

# High Performance Online BrainFuck Debugger

BrainDuck UI is an online interface for a brainfuck interpreter that let's you
use advanced debugging features not available in other tools.

The site is hosted on [this link](https://yonatan-reicher.github.io/brainduck-ui/)

## Table of Contents

- [High Performance Online BrainFuck Debugger](#high-performance-online-brainfuck-debugger)
    - [Table of Contents](#table-of-contents)
    - [Features](#features)
    - [Getting Started](#getting-started)
    - [Building Locally](#building-locally)
    - [Todo](#todo)

## Features

- Code editing
- Debugging
    - Step by step execution
    - Stepping over to skip up to the end of the next or the current loop
    - Stepping backward
- Runtime state
    - Memory view
    - Highlight current instruction

## Getting Started

Go to [the link](https://yonatan-reicher.github.io/brainduck-ui/) and enter
your code. Press the run button and start debugging!

## Building Locally

For building and running this project locally you need to have git, cargo, elm,
wasm-pack and any web server installed (you can use the web-server built into
python)

1. Clone the repo - in a terminal, write `git clone https://github.com/yonatan-reicher/brainduck-ui.git`
2. Build the wasm code - run `wasm-pack build --target no-modules`
3. Build the rest of the page - run `elm make src/Main.elm --output build/elm.js`
4. Run a web server in the build directory - run `python -m http.server` or any other web server

**Important**: If you want to use upload this to push to this repo, or publish it
to your own github pages, you need to tell git explictly to track the `/pkg`
directory (This is because the `/pkg` directory is ignored by default by
wasm-pack). To do this, after step 2, run `git add pkg -f`.

## Todo
- [ ] Input instruction
- [ ] Publish the brianduck library and add it as a `Cargo.toml` dependency
- [ ] Allow exploring the memory
- [ ] Add a continue button
- [ ] Add breakpoints
- [ ] Step over groups of `+`, `-`, `<`, `>`

