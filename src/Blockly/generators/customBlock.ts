import { Order } from 'blockly/javascript';
import * as Blockly from 'blockly/core';

export const forBlock = Object.create(null);

const simulateLED = (state: string) => {
    const ledElement = document.getElementById('simulated-led');
    if (ledElement) {
        ledElement.style.backgroundColor = state === 'HIGH' ? 'yellow' : 'black';
    }
    console.log('LED state:', state);
};

// Existing custom block generators.
forBlock['add_text'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const text = generator.valueToCode(block, 'TEXT', Order.NONE) || "''";
  const addText = generator.provideFunction_(
    'addText',
    `function ${generator.FUNCTION_NAME_PLACEHOLDER_}(text) {
  const outputDiv = document.getElementById('output');
  const textEl = document.createElement('p');
  textEl.innerText = text;
  outputDiv.appendChild(textEl);
}`,
  );
  return `${addText}(${text});\n`;
};

forBlock['log_text'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const text = generator.valueToCode(block, 'TEXT', Order.NONE) || "''";
  return `console.log(${text});\n`;
};

// Arduino block generators.

// base_delay: Delay block.
forBlock['base_delay'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const delayTime = generator.valueToCode(block, 'DELAY_TIME', Order.NONE) || '0';
  return `delay(${delayTime});\n`;
};

forBlock['print_result'] = function (
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const value = generator.valueToCode(block, 'VALUE', Order.NONE) || "''";
    const printFunction = generator.provideFunction_(
        'printResult',
        `function ${generator.FUNCTION_NAME_PLACEHOLDER_}(text) {
  const outputDiv = document.getElementById('output');
  const el = document.createElement('p');
  el.innerText = text;
  outputDiv.appendChild(el);
}`
    );
    return `${printFunction}(${value});\n`;
};


// base_map: Map block.
forBlock['base_map'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const num = generator.valueToCode(block, 'NUM', Order.NONE) || '0';
  const dmax = generator.valueToCode(block, 'DMAX', Order.NONE) || '0';
  return [`map(${num}, 0, 1024, 0, ${dmax})`, Order.ATOMIC];
};

// inout_tone: Tone block.
forBlock['inout_tone'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const pin = block.getFieldValue('PIN');
  const frequency = generator.valueToCode(block, 'NUM', Order.NONE) || '0';
  return `tone(${pin}, ${frequency});\n`;
};

// inout_notone: No tone block.
forBlock['inout_notone'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const pin = block.getFieldValue('PIN');
  return `noTone(${pin});\n`;
};

// inout_highlow: HIGH/LOW constant block.
forBlock['inout_highlow'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const boolVal = block.getFieldValue('BOOL');
  return [boolVal, Order.ATOMIC];
};

// servo_move: Servo move block.
forBlock['servo_move'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const pin = block.getFieldValue('PIN');
  const degree = generator.valueToCode(block, 'DEGREE', Order.NONE) || '0';
  return `servoMove(${pin}, ${degree});\n`;
};

// servo_read_degrees: Servo read degrees block.
forBlock['servo_read_degrees'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const pin = block.getFieldValue('PIN');
  return [`servoReadDegrees(${pin})`, Order.ATOMIC];
};

// serial_print: Serial print block.
forBlock['serial_print'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const content = generator.valueToCode(block, 'CONTENT', Order.NONE) || "''";
  return `Serial.print(${content});\n`;
};

// inout_digital_write: Digital Write block.
forBlock['inout_digital_write'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const pin = block.getFieldValue('PIN');
  const stat = block.getFieldValue('STAT');
  return `digitalWrite(${pin}, ${stat});\n`;
};

// inout_digital_read: Digital Read block.
forBlock['inout_digital_read'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const pin = block.getFieldValue('PIN');
  const code = `digitalRead(${pin})`;
  return [code, Order.ATOMIC];
};

// inout_analog_write: Analog Write block.
forBlock['inout_analog_write'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const pin = block.getFieldValue('PIN');
  const value = generator.valueToCode(block, 'NUM', Order.NONE) || '0';
  return `analogWrite(${pin}, ${value});\n`;
};

// inout_analog_read: Analog Read block.
forBlock['inout_analog_read'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const pin = block.getFieldValue('PIN');
  const code = `analogRead(${pin})`;
  return [code, Order.ATOMIC];
};

// inout_buildin_led: Build-in LED block.
forBlock['inout_buildin_led'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const stat = block.getFieldValue('STAT');
  return `digitalWrite(LED_BUILTIN, ${stat});\n`;
};

// inout_pin_mode: Pin mode block.
forBlock['inout_pin_mode'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const pin = block.getFieldValue('PIN');
  const mode = block.getFieldValue('MODE');
  return `pinMode(${pin}, ${mode});\n`;
};

// Colour blocks generators.

// Generator for the colour picker block.
forBlock['colour_picker'] = function(
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  const colour = block.getFieldValue('COLOUR');
  return [`'${colour}'`, Order.ATOMIC];
};

// Generator for the random colour block.
forBlock['colour_random'] = function(
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  const code = `'#' + ('00000' + (Math.floor(Math.random()*16777215)).toString(16)).slice(-6)`;
  return [code, Order.ATOMIC];
};

// Generator for the colour RGB block.
forBlock['colour_rgb'] = function(
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  const r = generator.valueToCode(block, 'RED', Order.NONE) || '0';
  const g = generator.valueToCode(block, 'GREEN', Order.NONE) || '0';
  const b = generator.valueToCode(block, 'BLUE', Order.NONE) || '0';
  const code = `rgbToHex(${r}, ${g}, ${b})`;
  return [code, Order.ATOMIC];
};

// Generator for the colour blend block.
forBlock['colour_blend'] = function(
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  const colour1 = generator.valueToCode(block, 'COLOUR1', Order.NONE) || '\'#000000\'';
  const colour2 = generator.valueToCode(block, 'COLOUR2', Order.NONE) || '\'#000000\'';
  const ratio = generator.valueToCode(block, 'RATIO', Order.NONE) || '0';
  const code = `blendColour(${colour1}, ${colour2}, ${ratio})`;
  return [code, Order.ATOMIC];
};
forBlock['millis'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  // For simulation, you could use performance.now() or a global simulation clock.
  // Here we use performance.now() as an example.
  return [`Math.floor(performance.now())`, Order.ATOMIC];
};

// New generator: delayMicroseconds block.
forBlock['delay_microseconds'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const delayUS = generator.valueToCode(block, 'DELAY_US', Order.NONE) || '0';
  // In a simulation, a microsecond delay might not be noticeable.
  // For simulation purposes, you could simply call a function or log the delay.
  return `delayMicroseconds(${delayUS});\n`;
};

// New generator: Serial.println block.
forBlock['serial_println'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const content = generator.valueToCode(block, 'CONTENT', Order.NONE) || "''";
  return `Serial.println(${content});\n`;
};
// Generator for the "if" block.
forBlock['controls_if'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  // In this simplified version, we assume only one condition and one branch.
  const condition = generator.valueToCode(block, 'IF0', Order.NONE) || '0';
  const branch = generator.statementToCode(block, 'DO0');
  const code = 'if (' + condition + ') {\n' + branch + '}\n';
  return code;
};

// Generator for logic_compare.
forBlock['logic_compare'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const OPERATORS: { [key: string]: string } = {
    EQ: '==',
    NEQ: '!=',
    LT: '<',
    LTE: '<=',
    GT: '>',
    GTE: '>='
  };
  const operator = OPERATORS[block.getFieldValue('OP')];
  const order = (operator === '==' || operator === '!=') ? Order.EQUALITY : Order.RELATIONAL;
  const argument0 = generator.valueToCode(block, 'A', order) || '0';
  const argument1 = generator.valueToCode(block, 'B', order) || '0';
  const code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

// Generator for logic_operation.
forBlock['logic_operation'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const operator = block.getFieldValue('OP') === 'AND' ? '&&' : '||';
  const order = operator === '&&' ? Order.LOGICAL_AND : Order.LOGICAL_OR;
  const argument0 = generator.valueToCode(block, 'A', order) || 'false';
  const argument1 = generator.valueToCode(block, 'B', order) || 'false';
  const code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};
const ORDER_UNARY_PREFIX = 7;

// Generator for logic_negate.
forBlock['logic_negate'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const order = ORDER_UNARY_PREFIX;
  const argument0 = generator.valueToCode(block, 'BOOL', order) || 'false';
  const code = '!' + argument0;
  return [code, order];
};


// Generator for logic_boolean.
forBlock['logic_boolean'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const code = (block.getFieldValue('BOOL') === 'TRUE') ? 'true' : 'false';
  return [code, Order.ATOMIC];
};

// Generator for logic_null.
forBlock['logic_null'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  return ['NULL', Order.ATOMIC];
};

// Generator for logic_ternary.
forBlock['logic_ternary'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const condition = generator.valueToCode(block, 'IF', Order.NONE) || 'false';
  const thenBranch = generator.valueToCode(block, 'THEN', Order.NONE) || '0';
  const elseBranch = generator.valueToCode(block, 'ELSE', Order.NONE) || '0';
  const code = '(' + condition + ') ? (' + thenBranch + ') : (' + elseBranch + ')';
  return [code, Order.ATOMIC];
};
// Generator for controls_repeat (using internal number).
// forBlock['controls_repeat'] = function (
//   block: Blockly.Block,
//   generator: Blockly.CodeGenerator,
// ) {
//   // Get the number of repeats from the field input.
//   const repeats = block.getFieldValue('TIMES') || '10';
//   const branch = generator.statementToCode(block, 'DO');
//   // For simplicity, use a fixed loop variable "i".
//   const code = 'for (int i = 0; i < ' + repeats + '; i++) {\n' +
//                branch +
//                '}\n';
//   return code;
// };

// Generator for controls_repeat_ext.
forBlock['controls_repeat_ext'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const repeats = generator.valueToCode(block, 'TIMES', Order.NONE) || '10';
  const branch = generator.statementToCode(block, 'DO');
  const code = 'for (int i = 0; i < ' + repeats + '; i++) {\n' +
               branch +
               '}\n';
  return code;
};

// Generator for controls_whileUntil.
forBlock['controls_whileUntil'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const mode = block.getFieldValue('MODE');
  let condition = generator.valueToCode(block, 'BOOL', Order.NONE) || 'false';
  // For UNTIL, invert the condition.
  if (mode === 'UNTIL') {
    condition = '!' + condition;
  }
  const branch = generator.statementToCode(block, 'DO');
  const code = 'while (' + condition + ') {\n' +
               branch +
               '}\n';
  return code;
};

// Generator for controls_for.
forBlock['controls_for'] = function (
    block: Blockly.Block,
    generator: any,
) {
    // Lấy tên biến từ khối
    const variable = generator.nameDB_ ? generator.nameDB_.getName(
        block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME) : block.getFieldValue('VAR');
    const from = generator.valueToCode(block, 'FROM', generator.ORDER_NONE) || '0';
    const to = generator.valueToCode(block, 'TO', generator.ORDER_NONE) || '0';
    const by = generator.valueToCode(block, 'BY', generator.ORDER_NONE) || '1';
    const branch = generator.statementToCode(block, 'DO');

    // Bỏ từ khóa "int" để không khai báo lại biến, chỉ sử dụng biến đã có
    const code = 'for (' + variable + ' = ' + from + '; ' +
        variable + ' <= ' + to + '; ' +
        variable + ' += ' + by + ') {\n' +
        branch +
        '}\n';
    return code;
};

// Generator for controls_forEach.
// For simulation, assume the list is an array and its length is given by list_length.
forBlock['controls_forEach'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const variable = generator.nameDB_ ? generator.nameDB_.getName(
    block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME) : block.getFieldValue('VAR');
  const list = generator.valueToCode(block, 'LIST', Order.NONE) || 'array';
  const branch = generator.statementToCode(block, 'DO');
  const code = 'for (int i = 0; i < ' + list + '_length; i++) {\n' +
               variable + ' = ' + list + '[i];\n' +
               branch +
               '}\n';
  return code;
};

// Generator for controls_flow_statements.
forBlock['controls_flow_statements'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const flow = block.getFieldValue('FLOW');
  let code = '';
  if (flow === 'BREAK') {
    code = 'break;\n';
  } else if (flow === 'CONTINUE') {
    code = 'continue;\n';
  }
  return code;
};
forBlock['simulate_led'] = function(
    block: Blockly.Block,
    generator: any, // Sử dụng any thay vì Blockly.CodeGenerator
) {
    const pin = generator.valueToCode(block, 'PIN', Order.ATOMIC) || '13';
    const state = block.getFieldValue('STATE');

    // Kiểm tra xem generator có thuộc tính setups_ không
    if (generator.setups_ !== undefined) {
        // Add pin mode setup to setup section
        const pinSetupCode = `pinMode(${pin}, OUTPUT);`;
        if (generator.setups_['setup_output_' + pin] === undefined) {
            generator.setups_['setup_output_' + pin] = pinSetupCode;
        }
    } else {
        // Nếu không có setups_, thêm code pinMode vào trước digitalWrite
        return `pinMode(${pin}, OUTPUT);\ndigitalWrite(${pin}, ${state});\n`;
    }

    // Generate digitalWrite code
    return `digitalWrite(${pin}, ${state});\n`;
};

// RGB LED Control Block Generator
forBlock['rgb_led_control'] = function(
    block: Blockly.Block,
    generator: any,
) {
    const redPin = block.getFieldValue('RED_PIN') || '9';
    const greenPin = block.getFieldValue('GREEN_PIN') || '10';
    const bluePin = block.getFieldValue('BLUE_PIN') || '11';
    const red = Number(block.getFieldValue('RED')) || 0;
    const green = Number(block.getFieldValue('GREEN')) || 0;
    const blue = Number(block.getFieldValue('BLUE')) || 0;

    let code = '';

    if (generator.setups_ !== undefined) {
        // Setup pin modes in setup section
        generator.setups_['setup_rgb_' + redPin] = `pinMode(${redPin}, OUTPUT);`;
        generator.setups_['setup_rgb_' + greenPin] = `pinMode(${greenPin}, OUTPUT);`;
        generator.setups_['setup_rgb_' + bluePin] = `pinMode(${bluePin}, OUTPUT);`;
    } else {
        // Nếu không có setups_, thêm code pinMode trực tiếp
        code += `pinMode(${redPin}, OUTPUT);\n`;
        code += `pinMode(${greenPin}, OUTPUT);\n`;
        code += `pinMode(${bluePin}, OUTPUT);\n`;
    }

    // Generate code that sets RGB LED values
    code += `analogWrite(${redPin}, ${red});\n`;
    code += `analogWrite(${greenPin}, ${green});\n`;
    code += `analogWrite(${bluePin}, ${blue});\n`;

    return code;
};

forBlock['rgb_led_setup'] = function(
    block: Blockly.Block,
    generator: any,
) {
    const redPin = block.getFieldValue('RED_PIN') || '9';
    const greenPin = block.getFieldValue('GREEN_PIN') || '10';
    const bluePin = block.getFieldValue('BLUE_PIN') || '11';

    let code = '';

    if (generator.setups_ !== undefined) {
        // Setup pin modes in setup section
        generator.setups_['setup_rgb_' + redPin] = `pinMode(${redPin}, OUTPUT);`;
        generator.setups_['setup_rgb_' + greenPin] = `pinMode(${greenPin}, OUTPUT);`;
        generator.setups_['setup_rgb_' + bluePin] = `pinMode(${bluePin}, OUTPUT);`;

        // Khởi tạo đèn tắt ban đầu
        generator.setups_['init_rgb_' + redPin] = `digitalWrite(${redPin}, LOW);`;
        generator.setups_['init_rgb_' + greenPin] = `digitalWrite(${greenPin}, LOW);`;
        generator.setups_['init_rgb_' + bluePin] = `digitalWrite(${bluePin}, LOW);`;
    } else {
        // Nếu không có setups_, thêm code pinMode trực tiếp
        code += `pinMode(${redPin}, OUTPUT);\n`;
        code += `pinMode(${greenPin}, OUTPUT);\n`;
        code += `pinMode(${bluePin}, OUTPUT);\n`;

        // Khởi tạo đèn tắt ban đầu
        code += `digitalWrite(${redPin}, LOW);\n`;
        code += `digitalWrite(${greenPin}, LOW);\n`;
        code += `digitalWrite(${bluePin}, LOW);\n`;
    }

    // Lưu các giá trị pin vào biến toàn cục
    if (generator.definitions_ !== undefined) {
        generator.definitions_['rgb_led_pins'] = `int rgbLedRedPin = ${redPin};\nint rgbLedGreenPin = ${greenPin};\nint rgbLedBluePin = ${bluePin};`;
    }

    return code;
};
forBlock['rgb_led_set_color'] = function(
    block: Blockly.Block,
    generator: any,
) {
    const red = Number(block.getFieldValue('RED')) || 0;
    const green = Number(block.getFieldValue('GREEN')) || 0;
    const blue = Number(block.getFieldValue('BLUE')) || 0;

    let code = '';

    // Kiểm tra nếu có khởi tạo biến toàn cục cho chân
    if (generator.definitions_ && generator.definitions_['rgb_led_pins']) {
        // Sử dụng các biến toàn cục
        code += `analogWrite(rgbLedRedPin, ${red});\n`;
        code += `analogWrite(rgbLedGreenPin, ${green});\n`;
        code += `analogWrite(rgbLedBluePin, ${blue});\n`;
    } else {
        // Nếu không có biến toàn cục, sử dụng giá trị mặc định
        code += `// Lưu ý: Bạn nên sử dụng khối "Setup RGB LED" trước\n`;
        code += `analogWrite(9, ${red});\n`;
        code += `analogWrite(10, ${green});\n`;
        code += `analogWrite(11, ${blue});\n`;
    }

    return code;
};
forBlock['rgb_led_set_color_with_pins'] = function(
    block: Blockly.Block,
    generator: any,
) {
    const redPin = block.getFieldValue('RED_PIN') || '9';
    const greenPin = block.getFieldValue('GREEN_PIN') || '10';
    const bluePin = block.getFieldValue('BLUE_PIN') || '11';
    const red = Number(block.getFieldValue('RED')) || 0;
    const green = Number(block.getFieldValue('GREEN')) || 0;
    const blue = Number(block.getFieldValue('BLUE')) || 0;

    let code = '';

    // Generate code that sets RGB LED values directly to specified pins
    code += `analogWrite(${redPin}, ${red});\n`;
    code += `analogWrite(${greenPin}, ${green});\n`;
    code += `analogWrite(${bluePin}, ${blue});\n`;

    return code;
};
forBlock['rgb_led_variable_control'] = function(
    block: Blockly.Block,
    generator: any,
) {
    // Sử dụng valueToCode để lấy giá trị từ các khối được kết nối hoặc biến được gán
    // Order.ATOMIC đảm bảo các biểu thức được đánh giá đúng thứ tự
    const redPin = generator.valueToCode(block, 'RED_PIN', generator.ORDER_ATOMIC) || '9';
    const greenPin = generator.valueToCode(block, 'GREEN_PIN', generator.ORDER_ATOMIC) || '10';
    const bluePin = generator.valueToCode(block, 'BLUE_PIN', generator.ORDER_ATOMIC) || '11';
    const redValue = generator.valueToCode(block, 'RED_VALUE', generator.ORDER_ATOMIC) || '0';
    const greenValue = generator.valueToCode(block, 'GREEN_VALUE', generator.ORDER_ATOMIC) || '0';
    const blueValue = generator.valueToCode(block, 'BLUE_VALUE', generator.ORDER_ATOMIC) || '0';

    let code = '';

    // Kiểm tra xem đây là lần đầu sử dụng các chân này hay không
    // Nếu sử dụng biến, chúng ta cần đảm bảo pinMode được thiết lập đúng
    code += `// Đảm bảo chân đèn được đặt là OUTPUT\n`;
    code += `pinMode(${redPin}, OUTPUT);\n`;
    code += `pinMode(${greenPin}, OUTPUT);\n`;
    code += `pinMode(${bluePin}, OUTPUT);\n\n`;

    // Thiết lập giá trị màu cho đèn LED
    code += `analogWrite(${redPin}, ${redValue});\n`;
    code += `analogWrite(${greenPin}, ${greenValue});\n`;
    code += `analogWrite(${bluePin}, ${blueValue});\n`;

    return code;
};
forBlock['rgb_led_variable_info'] = function(
    block: Blockly.Block,
    generator: any,
) {
    return '// Thông tin đèn RGB: Chân từ 2-13, A0-A5; Màu từ 0-255\n';
};

forBlock['rgb_led_fixed_pin_variable_color'] = function(
    block: Blockly.Block,
    generator: any,
) {
    const redPin = block.getFieldValue('RED_PIN') || '9';
    const greenPin = block.getFieldValue('GREEN_PIN') || '10';
    const bluePin = block.getFieldValue('BLUE_PIN') || '11';
    const redValue = generator.valueToCode(block, 'RED_VALUE', generator.ORDER_ATOMIC) || '0';
    const greenValue = generator.valueToCode(block, 'GREEN_VALUE', generator.ORDER_ATOMIC) || '0';
    const blueValue = generator.valueToCode(block, 'BLUE_VALUE', generator.ORDER_ATOMIC) || '0';

    let code = '';

    if (generator.setups_ !== undefined) {
        // Setup pin modes in setup section
        generator.setups_['setup_rgb_' + redPin] = `pinMode(${redPin}, OUTPUT);`;
        generator.setups_['setup_rgb_' + greenPin] = `pinMode(${greenPin}, OUTPUT);`;
        generator.setups_['setup_rgb_' + bluePin] = `pinMode(${bluePin}, OUTPUT);`;
    } else {
        // Đặt pinMode vào trong code nếu không có setups_
        code += `pinMode(${redPin}, OUTPUT);\n`;
        code += `pinMode(${greenPin}, OUTPUT);\n`;
        code += `pinMode(${bluePin}, OUTPUT);\n\n`;
    }

    // Thiết lập giá trị màu cho đèn LED
    code += `analogWrite(${redPin}, ${redValue});\n`;
    code += `analogWrite(${greenPin}, ${greenValue});\n`;
    code += `analogWrite(${bluePin}, ${blueValue});\n`;

    return code;
};

// DHT Sensor Block Generator
forBlock['dht_sensor'] = function(
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const sensorType = block.getFieldValue('DHT_VALUE');
    const pin = block.getFieldValue('PIN');

    // Return appropriate code based on sensor type
    if (sensorType === 'TEMP') {
        return [`readDHTTemperature(${pin})`, Order.FUNCTION_CALL];
    } else {
        return [`readDHTHumidity(${pin})`, Order.FUNCTION_CALL];
    }
};

// Ultrasonic Sensor Block Generator
forBlock['ultrasonic_sensor'] = function(
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const trigPin = block.getFieldValue('TRIG_PIN');
    const echoPin = block.getFieldValue('ECHO_PIN');

    // Generate code for reading distance from ultrasonic sensor
    return [`readUltrasonicDistance(${trigPin}, ${echoPin})`, Order.FUNCTION_CALL];
};

// DC Motor Control Block Generator
forBlock['dc_motor_control'] = function(
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const pin1 = block.getFieldValue('PIN1');
    const pin2 = block.getFieldValue('PIN2');
    const direction = block.getFieldValue('DIRECTION');
    const speed = generator.valueToCode(block, 'SPEED', Order.NONE) || '0';

    // Generate code for controlling DC motor
    return `controlDCMotor(${pin1}, ${pin2}, ${direction}, ${speed});\n`;
};

// LCD Display Block Generator
forBlock['lcd_display'] = function(
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const text = generator.valueToCode(block, 'TEXT', Order.NONE) || '""';
    const row = block.getFieldValue('ROW');
    const col = block.getFieldValue('COL');

    // Generate code for displaying text on LCD
    return `lcdDisplayText(${text}, ${row}, ${col});\n`;
};

// Light Sensor Block Generator
forBlock['light_sensor'] = function(
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const pin = block.getFieldValue('PIN');

    // Generate code for reading light sensor value
    return [`analogRead(${pin})`, Order.FUNCTION_CALL];
};

// PIR Motion Sensor Block Generator
forBlock['pir_motion_sensor'] = function(
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const pin = block.getFieldValue('PIN');

    // Generate code for checking if motion is detected
    return [`digitalRead(${pin}) == HIGH`, Order.EQUALITY];
};

// Debounced Button Block Generator
forBlock['debounced_button'] = function(
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const pin = block.getFieldValue('PIN');
    const debounceTime = generator.valueToCode(block, 'DEBOUNCE_TIME', Order.NONE) || '50';

    // Generate code for reading debounced button state
    return [`readDebouncedButton(${pin}, ${debounceTime})`, Order.FUNCTION_CALL];
};

// Stepper Motor Control Block Generator
forBlock['stepper_motor_control'] = function(
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const steps = generator.valueToCode(block, 'STEPS', Order.NONE) || '0';
    const speed = generator.valueToCode(block, 'SPEED', Order.NONE) || '0';

    // Generate code for controlling stepper motor
    return `moveStepperMotor(${steps}, ${speed});\n`;
};

// Serial Begin Block Generator
forBlock['serial_begin'] = function(
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const baudRate = block.getFieldValue('BAUD_RATE');

    // Generate code for initializing serial communication
    return `Serial.begin(${baudRate});\n`;
};

// Map Extended Block Generator
forBlock['map_extended'] = function(
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const value = generator.valueToCode(block, 'VALUE', Order.NONE) || '0';
    const fromLow = generator.valueToCode(block, 'FROM_LOW', Order.NONE) || '0';
    const fromHigh = generator.valueToCode(block, 'FROM_HIGH', Order.NONE) || '1023';
    const toLow = generator.valueToCode(block, 'TO_LOW', Order.NONE) || '0';
    const toHigh = generator.valueToCode(block, 'TO_HIGH', Order.NONE) || '255';

    // Generate code for mapping a value from one range to another
    return [`map(${value}, ${fromLow}, ${fromHigh}, ${toLow}, ${toHigh})`, Order.FUNCTION_CALL];
};

// Wait Until Block Generator
forBlock['wait_until'] = function(
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const condition = generator.valueToCode(block, 'CONDITION', Order.NONE) || 'false';

    // Generate code for waiting until a condition is met
    return `while(!(${condition})) {\n  delay(1);\n}\n`;
};

forBlock['setup'] = function (
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const setupCode = generator.statementToCode(block, 'SETUP_CODE');
    return `void setup() {\n${setupCode}}\n`;
};

forBlock['loop'] = function (
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const loopCode = generator.statementToCode(block, 'LOOP_CODE');
    return `void loop() {\n${loopCode}}\n`;
};

forBlock['servo_rotate'] = function (
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const pin = generator.valueToCode(block, 'SERVO_PIN', Order.ATOMIC) || '9';
    const angle = generator.valueToCode(block, 'ANGLE', Order.ATOMIC) || '90';

    return `servo${pin}.write(${angle});\ndelay(15);\n`;
};

forBlock['servo_continuous'] = function (
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const pin = generator.valueToCode(block, 'SERVO_PIN', Order.ATOMIC) || '9';
    const speed = generator.valueToCode(block, 'SPEED', Order.ATOMIC) || '50';

    return `int mappedSpeed = map(${speed}, -100, 100, 0, 180);\nservo${pin}.write(mappedSpeed);\n`;
};

forBlock['servo_stop'] = function (
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const pin = generator.valueToCode(block, 'SERVO_PIN', Order.ATOMIC) || '9';

    return `servo${pin}.write(90);\ndelay(15);\n`;
};

forBlock['servo_setup'] = function (
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const pin = generator.valueToCode(block, 'SERVO_PIN', Order.ATOMIC) || '9';

    // Sử dụng addReservedWords để thêm biến servo
    generator.addReservedWords(`servo${pin}`);

    // Sử dụng provideFunction_ để thêm thư viện và định nghĩa servo
    const includeServo = generator.provideFunction_(
        'include_servo',
        `#include <Servo.h>\n`
    );

    // Định nghĩa đối tượng servo
    const defineServo = generator.provideFunction_(
        `define_servo_${pin}`,
        `Servo servo${pin};\n`
    );

    return `servo${pin}.attach(${pin});\n`;
};

forBlock['servo_rotate'] = function (
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const pin = generator.valueToCode(block, 'SERVO_PIN', Order.ATOMIC) || '9';
    const angle = generator.valueToCode(block, 'ANGLE', Order.ATOMIC) || '90';

    return `servo${pin}.write(${angle});\ndelay(15);\n`;
};

forBlock['servo_continuous'] = function (
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const pin = generator.valueToCode(block, 'SERVO_PIN', Order.ATOMIC) || '9';
    const speed = generator.valueToCode(block, 'SPEED', Order.ATOMIC) || '50';

    return `int mappedSpeed = map(${speed}, -100, 100, 0, 180);\nservo${pin}.write(mappedSpeed);\n`;
};

forBlock['servo_stop'] = function (
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const pin = generator.valueToCode(block, 'SERVO_PIN', Order.ATOMIC) || '9';

    return `servo${pin}.write(90);\ndelay(15);\n`;
};

forBlock['function_wrapper'] = function(
    block: Blockly.Block,
    generator: any,
) {
    // Lấy nội dung các khối function bên trong
    const functions = generator.statementToCode(block, 'FUNCTIONS');

    // Nếu có generator.definitions_, thêm mã vào đó
    if (generator.definitions_) {
        // Thêm các hàm vào phần định nghĩa để chúng xuất hiện ở đầu chương trình
        generator.definitions_['user_functions'] = functions;
        return '';  // Không trả về mã trong vị trí hiện tại
    } else {
        // Nếu không có generator.definitions_, trả về mã trực tiếp
        return functions;
    }
};
forBlock['function_definition'] = function(
    block: Blockly.Block,
    generator: any,
) {
    // Lấy tên hàm và tham số
    let funcName = block.getFieldValue('NAME');
    const params = block.getFieldValue('PARAMS');

    // Ngăn chặn tên hàm trống
    if (funcName.length === 0) {
        funcName = 'unnamed';
    }

    // Lấy nội dung thân hàm
    let branch = generator.statementToCode(block, 'STACK');
    if (branch.length > 0) {
        branch = generator.prefixLines(generator.indent(branch), generator.INDENT);
    }

    // Tạo mã hàm
    const code = 'void ' + funcName + '(' + params + ') {\n' + branch + '}\n\n';
    return code;
};
forBlock['custom_function_block'] = function(
    block: Blockly.Block,
    generator: any,
) {
    const functionCode = block.getFieldValue('FUNCTION_CODE');
    return functionCode + '\n';
};

forBlock['code_text'] = function(
    block: Blockly.Block,
    generator: any
) {
    const code = block.getFieldValue('CODE_TEXT');
    return [code, generator.ORDER_ATOMIC];
};

// Generator functions cho custom code block
forBlock['custom_code_block'] = function(
    block: Blockly.Block,
    generator: any,
) {
    const codeValue = generator.valueToCode(block, 'CODE', generator.ORDER_NONE) ||
        "// Không có mã được cung cấp";
    return codeValue + '\n';
};

// Generator functions cho custom function block
forBlock['custom_function_block'] = function(
    block: Blockly.Block,
    generator: any,
) {
    const functionCode = generator.valueToCode(block, 'FUNCTION_CODE', generator.ORDER_NONE) ||
        "void emptyFunction() {}\n";
    return functionCode + '\n';
};