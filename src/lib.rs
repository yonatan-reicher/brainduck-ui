use std::ops::{Deref, DerefMut};

use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};

#[wasm_bindgen]
extern "C" {
    fn on_input() -> u8;

    fn on_output(ch: u8);

    fn on_undo_output();

    fn on_clear_output();
}

#[derive(Serialize, Deserialize)]
pub struct Input;

impl brainduck::Input for Input {
    fn read(&mut self) -> u8 {
        on_input()
    }
}

#[derive(Serialize, Deserialize)]
pub struct Output;

impl brainduck::Output for Output {
    fn write(&mut self, ch: u8) {
        on_output(ch);
    }

    fn undo(&mut self) {
        on_undo_output();
    }

    fn clear(&mut self) {
        on_clear_output();
    }
}

type BDInterpreter = brainduck::Interpreter<Input, Output, true>;

#[wasm_bindgen]
pub struct Interpreter(*mut BDInterpreter);

impl Deref for Interpreter {
    type Target = BDInterpreter;

    fn deref(&self) -> &Self::Target {
        unsafe { &*self.0 }
    }
}

impl DerefMut for Interpreter {
    fn deref_mut(&mut self) -> &mut Self::Target {
        unsafe { &mut *self.0 }
    }
}

#[wasm_bindgen]
impl Interpreter {
    #[wasm_bindgen(constructor)]
    pub fn new(code: &str) -> Self {
        let interpreter = BDInterpreter::new(code.as_bytes(), Input, Output);
        let ptr = Box::into_raw(Box::new(interpreter));
        Self(ptr)
    }

    // TODO: Find out if this can be replaced with a Drop impl
    pub fn free(self) {
        unsafe {
            let _ = Box::from_raw(self.0);
        }
    }

    pub fn step(&mut self) -> bool {
        self.deref_mut().step()
    }

    pub fn back(&mut self) -> bool {
        self.deref_mut().back()
    }

    pub fn step_over(&mut self) {
        self.deref_mut().step_over()
    }

    pub fn reset(&mut self) {
        self.deref_mut().reset();
    }

    pub fn pc(&self) -> usize {
        self.deref().pc
    }

    pub fn memory_view(&self, size: isize) -> Vec<u8> {
        let ptr = self.deref().memory.ptr;
        (-size ..= size).map(|i| self.deref().memory.get_at(ptr + i)).collect()
    }
}
