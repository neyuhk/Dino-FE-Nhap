import * as Blockly from 'blockly/core';

export function extendGenerator(generator: Blockly.CodeGenerator) {
    const g = generator as Blockly.CodeGenerator & {
        includes_?: Record<string, string>;
        definitions_?: Record<string, string>;
        setups_?: Record<string, string>;
        addInclude?: (name: string, code: string) => void;
        addDeclaration?: (name: string, code: string) => void;
        addSetup?: (name: string, code: string) => void;
    };

    if (!g.includes_) g.includes_ = {};
    if (!g.definitions_) g.definitions_ = {};
    if (!g.setups_) g.setups_ = {};

    g.addInclude = (name: string, code: string) => {
        g.includes_![name] = code;
    };

    g.addDeclaration = (name: string, code: string) => {
        g.definitions_![name] = code;
    };

    g.addSetup = (name: string, code: string) => {
        g.setups_![name] = code;
    };
}
