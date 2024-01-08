let wasm_bindgen;
(function() {
    const __exports = {};
    let script_src;
    if (typeof document !== 'undefined' && document.currentScript !== null) {
        script_src = new URL(document.currentScript.src, location.href).toString();
    }
    let wasm = undefined;

    const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

    if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

    let cachedUint8Memory0 = null;

    function getUint8Memory0() {
        if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
            cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
        }
        return cachedUint8Memory0;
    }

    function getStringFromWasm0(ptr, len) {
        ptr = ptr >>> 0;
        return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
    }

function notDefined(what) { return () => { throw new Error(`${what} is not defined`); }; }

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}
/**
*/
class Interpreter {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_interpreter_free(ptr);
    }
    /**
    * @param {string} code
    */
    constructor(code) {
        const ptr0 = passStringToWasm0(code, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.interpreter_new(ptr0, len0);
        this.__wbg_ptr = ret >>> 0;
        return this;
    }
    /**
    */
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.interpreter_free(ptr);
    }
    /**
    * @returns {boolean}
    */
    step() {
        const ret = wasm.interpreter_step(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
    * @returns {boolean}
    */
    back() {
        const ret = wasm.interpreter_back(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
    */
    step_over() {
        wasm.interpreter_step_over(this.__wbg_ptr);
    }
    /**
    */
    reset() {
        wasm.interpreter_reset(this.__wbg_ptr);
    }
    /**
    * @returns {number}
    */
    pc() {
        const ret = wasm.interpreter_pc(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} size
    * @returns {Uint8Array}
    */
    memory_view(size) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.interpreter_memory_view(retptr, this.__wbg_ptr, size);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
__exports.Interpreter = Interpreter;

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_onundooutput_6153e265e060fdc1 = typeof on_undo_output == 'function' ? on_undo_output : notDefined('on_undo_output');
    imports.wbg.__wbg_onclearoutput_5f9a52365776d97e = typeof on_clear_output == 'function' ? on_clear_output : notDefined('on_clear_output');
    imports.wbg.__wbg_onoutput_9721670810244203 = typeof on_output == 'function' ? on_output : notDefined('on_output');
    imports.wbg.__wbg_oninput_5abb6531100d7c41 = typeof on_input == 'function' ? on_input : notDefined('on_input');
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

function __wbg_init_memory(imports, maybe_memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedInt32Memory0 = null;
    cachedUint8Memory0 = null;


    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(input) {
    if (wasm !== undefined) return wasm;

    if (typeof input === 'undefined' && script_src !== 'undefined') {
        input = script_src.replace(/\.js$/, '_bg.wasm');
    }
    const imports = __wbg_get_imports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await input, imports);

    return __wbg_finalize_init(instance, module);
}

wasm_bindgen = Object.assign(__wbg_init, { initSync }, __exports);

})();
