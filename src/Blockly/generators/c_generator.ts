// Tạo generator
import * as Blockly from 'blockly/core';

Blockly.C = new Blockly.Generator('C');

// Gán ORDER
Blockly.C.ORDER_ATOMIC = 0;
Blockly.C.ORDER_NONE = 99;

export default Blockly.C;
