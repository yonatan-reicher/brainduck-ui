declare namespace wasm_bindgen {
	/* tslint:disable */
	/* eslint-disable */
	/**
	*/
	export class Interpreter {
	  free(): void;
	/**
	* @param {string} code
	*/
	  constructor(code: string);
	/**
	*/
	  free(): void;
	/**
	* @returns {boolean}
	*/
	  step(): boolean;
	/**
	* @returns {boolean}
	*/
	  back(): boolean;
	/**
	*/
	  step_over(): void;
	/**
	*/
	  reset(): void;
	/**
	* @returns {number}
	*/
	  pc(): number;
	/**
	* @param {number} size
	* @returns {Uint8Array}
	*/
	  memory_view(size: number): Uint8Array;
	}
	
}

declare type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

declare interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_interpreter_free: (a: number) => void;
  readonly interpreter_new: (a: number, b: number) => number;
  readonly interpreter_free: (a: number) => void;
  readonly interpreter_step: (a: number) => number;
  readonly interpreter_back: (a: number) => number;
  readonly interpreter_step_over: (a: number) => void;
  readonly interpreter_reset: (a: number) => void;
  readonly interpreter_pc: (a: number) => number;
  readonly interpreter_memory_view: (a: number, b: number, c: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
}

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
declare function wasm_bindgen (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
