import * as Blockly from 'blockly/core';

// Custom text blocks.
const addText = {
    type: 'add_text',
    message0: 'Add text %1',
    args0: [
        {
            type: 'input_value',
            name: 'TEXT',
            check: 'String',
        },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 160,
    tooltip: 'Thêm văn bản vào chương trình',
    helpUrl: '',
};

const logText = {
    type: 'log_text',
    message0: 'Log text %1',
    args0: [
        {
            type: 'input_value',
            name: 'TEXT',
            check: 'String',
        },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 160,
    tooltip: 'Ghi nội dung văn bản ra nhật ký (log)',
    helpUrl: '',
};

const printResultBlock = {
    type: 'print_result',
    message0: 'In ra %1',
    args0: [
        {
            type: 'input_value',
            name: 'VALUE',
        },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 160,
    tooltip: 'In giá trị ra màn hình Serial Monitor',
    helpUrl: '',
};

const inoutDigitalWrite = {
    type: "inout_digital_write",
    message0: "DigitalWrite PIN# %1 Stat %2",
    args0: [
        {
            type: "field_dropdown",
            name: "PIN",
            options: [
                ["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"],
                ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"],
                ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"],
                ["A4", "A4"], ["A5", "A5"]
            ]
        },
        {
            type: "field_dropdown",
            name: "STAT",
            options: [
                ["HIGH", "HIGH"],
                ["LOW", "LOW"]
            ]
        }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: "Gửi tín hiệu HIGH hoặc LOW đến một chân digital",
    helpUrl: "http://arduino.cc/en/Reference/DigitalWrite"
};

const inoutDigitalRead = {
    type: "inout_digital_read",
    message0: "DigitalRead PIN# %1",
    args0: [
        {
            type: "field_dropdown",
            name: "PIN",
            options: [
                ["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"],
                ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"],
                ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"],
                ["A4", "A4"], ["A5", "A5"]
            ]
        }
    ],
    output: "Boolean",
    colour: 230,
    tooltip: "Đọc tín hiệu digital (HIGH/LOW) từ một chân",
    helpUrl: "http://arduino.cc/en/Reference/DigitalRead"
};

const logicIf = {
    type: 'controls_if',
    message0: 'if %1 then',
    args0: [
        {
            type: 'input_value',
            name: 'IF0',
            check: 'Boolean'
        }
    ],
    message1: 'do %1',
    args1: [
        {
            type: 'input_statement',
            name: 'DO0'
        }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 210,
    tooltip: 'Nếu điều kiện đúng thì thực hiện hành động',
    helpUrl: ''
};

const logicCompare = {
    type: 'logic_compare',
    message0: '%1 %2 %3',
    args0: [
        {
            type: 'input_value',
            name: 'A',
            check: 'Number'
        },
        {
            type: 'field_dropdown',
            name: 'OP',
            options: [
                ['=', 'EQ'],
                ['≠', 'NEQ'],
                ['<', 'LT'],
                ['≤', 'LTE'],
                ['>', 'GT'],
                ['≥', 'GTE']
            ]
        },
        {
            type: 'input_value',
            name: 'B',
            check: 'Number'
        }
    ],
    output: 'Boolean',
    colour: 210,
    tooltip: 'So sánh hai giá trị số',
    helpUrl: ''
};


const logicOperation = {
    type: 'logic_operation',
    message0: '%1 %2 %3',
    args0: [
        { type: 'input_value', name: 'A', check: 'Boolean' },
        { type: 'field_dropdown', name: 'OP', options: [['and', 'AND'], ['or', 'OR']] },
        { type: 'input_value', name: 'B', check: 'Boolean' }
    ],
    output: 'Boolean',
    colour: 210,
    tooltip: 'Kiểm tra 2 điều kiện đúng cùng lúc (và) hoặc 1 trong 2 đúng (hoặc)',
    helpUrl: ''
};

const logicNegate = {
    type: 'logic_negate',
    message0: 'not %1',
    args0: [
        { type: 'input_value', name: 'BOOL', check: 'Boolean' }
    ],
    output: 'Boolean',
    colour: 210,
    tooltip: 'Đảo ngược giá trị đúng/sai của điều kiện',
    helpUrl: ''
};

const logicBoolean = {
    type: 'logic_boolean',
    message0: '%1',
    args0: [
        { type: 'field_dropdown', name: 'BOOL', options: [['true', 'TRUE'], ['false', 'FALSE']] }
    ],
    output: 'Boolean',
    colour: 210,
    tooltip: 'Giá trị đúng hoặc sai (true/false)',
    helpUrl: ''
};

const logicNull = {
    type: 'logic_null',
    message0: 'null',
    output: null,
    colour: 210,
    tooltip: 'Không có giá trị (null)',
    helpUrl: ''
};

const logicTernary = {
    type: 'logic_ternary',
    message0: 'if %1 then %2 else %3',
    args0: [
        { type: 'input_value', name: 'IF', check: 'Boolean' },
        { type: 'input_value', name: 'THEN' },
        { type: 'input_value', name: 'ELSE' }
    ],
    output: null,
    colour: 210,
    tooltip: 'Chọn kết quả theo điều kiện đúng hay sai',
    helpUrl: ''
};

const inoutAnalogWrite = {
    type: "inout_analog_write",
    message0: "AnalogWrite PIN# %1 value %2",
    args0: [
        { type: "field_dropdown", name: "PIN", options: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"]] },
        { type: "input_value", name: "NUM", check: "Number" }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: "Gửi giá trị analog (0-255) đến chân được chọn",
    helpUrl: "http://arduino.cc/en/Reference/AnalogWrite"
};

const inoutAnalogRead = {
    type: "inout_analog_read",
    message0: "AnalogRead PIN# %1",
    args0: [
        { type: "field_dropdown", name: "PIN", options: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]] }
    ],
    output: "Number",
    colour: 230,
    tooltip: "Đọc giá trị analog (0-1023) từ chân cảm biến",
    helpUrl: "http://arduino.cc/en/Reference/AnalogRead"
};

const inoutBuildinLed = {
    type: "inout_buildin_led",
    message0: "Build-in LED Stat %1",
    args0: [
        { type: "field_dropdown", name: "STAT", options: [["HIGH", "HIGH"], ["LOW", "LOW"]] }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 190,
    tooltip: "Bật hoặc tắt đèn LED có sẵn trên mạch",
    helpUrl: "http://arduino.cc/en/Reference/DigitalWrite"
};

// New block: Pin mode (set the mode of a pin)
const inoutPinMode = {
    type: "inout_pin_mode",
    message0: "Set pin %1 as %2",
    args0: [
        {
            type: "field_dropdown",
            name: "PIN",
            options: [
                ["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"],
                ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"],
                ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"],
                ["A4", "A4"], ["A5", "A5"]
            ]
        },
        {
            type: "field_dropdown",
            name: "MODE",
            options: [
                ["input", "INPUT"],
                ["output", "OUTPUT"],
                ["input with pull-up", "INPUT_PULLUP"]
            ]
        }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: "Chọn chế độ vào hoặc ra cho chân (PIN)",
    helpUrl: "http://arduino.cc/en/Reference/pinMode"
};

const baseDelay = {
    type: "base_delay",
    message0: "Wait %1 ms",
    args0: [
        {
            type: "input_value",
            name: "DELAY_TIME",
            check: "Number"
        }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: "Dừng chương trình trong một khoảng thời gian (miligiây)",
    helpUrl: "http://arduino.cc/en/Reference/delay"
};

const baseMap = {
    type: "base_map",
    message0: "Convert %1 to range [0-%2]",
    args0: [
        {
            type: "input_value",
            name: "NUM",
            check: "Number"
        },
        {
            type: "input_value",
            name: "DMAX",
            check: "Number"
        }
    ],
    inputsInline: true,
    output: null,
    colour: 230,
    tooltip: "Chuyển một số từ khoảng 0-1024 sang khoảng khác",
    helpUrl: "http://arduino.cc/en/Reference/map"
};

const inoutTone = {
    type: "inout_tone",
    message0: "Play tone at pin %1 with frequency %2",
    args0: [
        {
            type: "field_dropdown",
            name: "PIN",
            options: [
                ["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"],
                ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"],
                ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"],
                ["A4", "A4"], ["A5", "A5"]
            ]
        },
        {
            type: "input_value",
            name: "NUM",
            check: "Number"
        }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: "Phát ra âm thanh tại chân được chọn với tần số xác định",
    helpUrl: "http://www.arduino.cc/en/Reference/Tone"
};

const inoutNotone = {
    type: "inout_notone",
    message0: "Stop tone at pin %1",
    args0: [
        {
            type: "field_dropdown",
            name: "PIN",
            options: [
                ["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"],
                ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"],
                ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"],
                ["A4", "A4"], ["A5", "A5"]
            ]
        }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: "Tắt âm thanh phát ra tại chân được chọn",
    helpUrl: "http://www.arduino.cc/en/Reference/NoTone"
};

const inoutHighlow = {
    type: "inout_highlow",
    message0: "%1",
    args0: [
        {
            type: "field_dropdown",
            name: "BOOL",
            options: [
                ["HIGH", "HIGH"],
                ["LOW", "LOW"]
            ]
        }
    ],
    output: "Boolean",
    colour: 230,
    tooltip: "Giá trị HIGH (bật) hoặc LOW (tắt)",
    helpUrl: "http://arduino.cc/en/Reference/Constants"
};

const servoMove = {
    type: "servo_move",
    message0: "Move servo %1 at pin %2 to %3°",
    args0: [
        {
            type: "field_image",
            src: "https://statics3.seeedstudio.com/images/product/EMAX%20Servo.jpg",
            width: 64,
            height: 64,
            alt: "Servo"
        },
        {
            type: "field_dropdown",
            name: "PIN",
            options: [
                ["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"],
                ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"],
                ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"],
                ["A4", "A4"], ["A5", "A5"]
            ]
        },
        {
            type: "input_value",
            name: "DEGREE",
            check: "Number"
        }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 190,
    tooltip: "Điều khiển servo quay từ 0 đến 180 độ",
    helpUrl: "http://www.arduino.cc/playground/ComponentLib/servo"
};

const servoReadDegrees = {
    type: "servo_read_degrees",
    message0: "Get angle of servo %1 at pin %2",
    args0: [
        {
            type: "field_image",
            src: "https://statics3.seeedstudio.com/images/product/EMAX%20Servo.jpg",
            width: 64,
            height: 64,
            alt: "Servo"
        },
        {
            type: "field_dropdown",
            name: "PIN",
            options: [
                ["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"],
                ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"],
                ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"],
                ["A4", "A4"], ["A5", "A5"]
            ]
        }
    ],
    output: "Number",
    colour: 190,
    tooltip: "Đọc góc quay hiện tại của servo (góc vừa điều khiển)",
    helpUrl: "http://www.arduino.cc/playground/ComponentLib/servo"
};

const serialPrint = {
    type: "serial_print",
    message0: "Print to serial: %1",
    args0: [
        {
            type: "input_value",
            name: "CONTENT",
            check: "String"
        }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: "Gửi dữ liệu ra màn hình Serial (giống như in ra để xem)",
    helpUrl: "http://www.arduino.cc/en/Serial/Print"
};

// Colour blocks

const COLOUR_HUE = 20;

const colourPicker = {
    type: 'colour_picker',
    message0: '%1',
    args0: [
        {
            type: 'field_colour',
            name: 'COLOUR',
            colour: '#ff0000'
        }
    ],
    output: 'Colour',
    colour: COLOUR_HUE,
    tooltip: 'Chọn màu bất kỳ',
    helpUrl: ''
};

const colourRandom = {
    type: 'colour_random',
    message0: 'Random colour',
    output: 'Colour',
    colour: COLOUR_HUE,
    tooltip: 'Tạo một màu ngẫu nhiên',
    helpUrl: ''
};

const colourRGB = {
    type: 'colour_rgb',
    message0: 'Make colour with red %1 green %2 blue %3',
    args0: [
        {
            type: 'input_value',
            name: 'RED',
            check: 'Number'
        },
        {
            type: 'input_value',
            name: 'GREEN',
            check: 'Number'
        },
        {
            type: 'input_value',
            name: 'BLUE',
            check: 'Number'
        }
    ],
    output: 'Colour',
    colour: COLOUR_HUE,
    tooltip: 'Tạo màu theo thành phần RGB (0-255)',
    helpUrl: ''
};

const colourBlend = {
    type: 'colour_blend',
    message0: 'Mix colour %1 and %2 with ratio %3',
    args0: [
        { type: 'input_value', name: 'COLOUR1', check: 'Colour' },
        { type: 'input_value', name: 'COLOUR2', check: 'Colour' },
        { type: 'input_value', name: 'RATIO', check: 'Number' }
    ],
    output: 'Colour',
    colour: COLOUR_HUE,
    tooltip: 'Trộn 2 màu lại với nhau theo tỉ lệ (0.0 đến 1.0)',
    helpUrl: ''
};

const millisBlock = {
    type: "millis",
    message0: "milliseconds passed",
    output: "Number",
    colour: 120,
    tooltip: "Trả về số mili giây kể từ khi chương trình bắt đầu chạy",
    helpUrl: "http://arduino.cc/en/Reference/Millis"
};

const delayMicrosecondsBlock = {
    type: "delay_microseconds",
    message0: "wait %1 microseconds",
    args0: [
        { type: "input_value", name: "DELAY_US", check: "Number" }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: "Dừng chương trình trong khoảng thời gian rất ngắn (micro giây)",
    helpUrl: "http://arduino.cc/en/Reference/DelayMicroseconds"
};

const serialPrintln = {
    type: "serial_println",
    message0: "Serial println %1",
    args0: [
        { type: "input_value", name: "CONTENT", check: "String" }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: "In ra dữ liệu và xuống dòng trong màn hình Serial",
    helpUrl: "http://www.arduino.cc/en/Serial/Println"
};

const controlsRepeatExt = {
    type: "controls_repeat_ext",
    message0: "repeat %1 times",
    args0: [
        { type: "input_value", name: "TIMES", check: "Number" }
    ],
    message1: "do %1",
    args1: [
        { type: "input_statement", name: "DO" }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: "Lặp lại các hành động bên trong nhiều lần",
    helpUrl: ""
};

const controlsFor = {
    type: "controls_for",
    message0: "count %1 from %2 to %3 by %4",
    args0: [
        { type: "field_variable", name: "VAR", variable: "i" },
        { type: "input_value", name: "FROM", check: "Number" },
        { type: "input_value", name: "TO", check: "Number" },
        { type: "input_value", name: "BY", check: "Number" }
    ],
    message1: "do %1",
    args1: [
        { type: "input_statement", name: "DO" }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: "Lặp lại từ số bắt đầu đến số kết thúc với bước nhảy",
    helpUrl: ""
};

const controlsForEach = {
    type: "controls_forEach",
    message0: "for each %1 in list %2",
    args0: [
        { type: "field_variable", name: "VAR", variable: "item" },
        { type: "input_value", name: "LIST", check: "Array" }
    ],
    message1: "do %1",
    args1: [{ type: "input_statement", name: "DO" }],
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: "Lặp qua từng phần tử trong danh sách",
    helpUrl: ""
};

const controlsFlowStatements = {
    type: "controls_flow_statements",
    message0: "%1",
    args0: [
        {
            type: "field_dropdown",
            name: "FLOW",
            options: [
                ["stop loop", "BREAK"],
                ["skip to next", "CONTINUE"]
            ]
        }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: "Dừng vòng lặp hoặc chuyển sang lần lặp tiếp theo",
    helpUrl: ""
};

const simulateLed = {
    type: "simulate_led",
    message0: "LED state: %1",
    args0: [
        {
            type: "field_dropdown",
            name: "STATE",
            options: [
                ["ON", "HIGH"],
                ["OFF", "LOW"]
            ]
        }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: "#808080",
    tooltip: "Mô phỏng trạng thái LED (bật/tắt)",
    helpUrl: "",
    onchange: function(this: Blockly.Block) {
        if (!this.workspace) return;
        const state = this.getFieldValue("STATE");
        this.setColour(state === "HIGH" ? "#FFD700" : "#808080");
    }
};

const rgbLedControl = {
    type: "rgb_led_control",
    message0: "RGB LED R:%1 G:%2 B:%3",
    args0: [
        { type: "input_value", name: "RED", check: "Number" },
        { type: "input_value", name: "GREEN", check: "Number" },
        { type: "input_value", name: "BLUE", check: "Number" }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 160,
    tooltip: "Thiết lập màu đèn LED RGB bằng giá trị R, G, B (0~255)",
    helpUrl: ""
};

const dhtSensor = {
    type: "dht_sensor",
    message0: "get %1 from DHT on PIN %2",
    args0: [
        {
            type: "field_dropdown",
            name: "DHT_VALUE",
            options: [
                ["temperature (°C)", "TEMP"],
                ["humidity (%)", "HUM"]
            ]
        },
        {
            type: "field_dropdown",
            name: "PIN",
            options: [
                ["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"],
                ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"],
                ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"],
                ["A4", "A4"], ["A5", "A5"]
            ]
        }
    ],
    output: "Number",
    colour: 180,
    tooltip: "Đọc nhiệt độ hoặc độ ẩm từ cảm biến DHT11/DHT22",
    helpUrl: ""
};

const ultrasonicSensor = {
    type: "ultrasonic_sensor",
    message0: "distance from ultrasonic (cm) TRIG: %1 ECHO: %2",
    args0: [
        {
            type: "field_dropdown",
            name: "TRIG_PIN",
            options: [
                ["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"],
                ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"],
                ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"],
                ["A4", "A4"], ["A5", "A5"]
            ]
        },
        {
            type: "field_dropdown",
            name: "ECHO_PIN",
            options: [
                ["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"],
                ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"],
                ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"],
                ["A4", "A4"], ["A5", "A5"]
            ]}
    ],
    output: "Number",
    colour: 180,
    tooltip: "Đo khoảng cách bằng cảm biến siêu âm HC-SR04",
    helpUrl: ""
};

// 4. Khối điều khiển động cơ DC
const dcMotorControl = {
    type: "dc_motor_control",
    message0: "Set DC motor PIN1: %1 PIN2: %2 direction: %3 speed: %4",
    args0: [
        { type: "field_dropdown", name: "PIN1", options: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"],
                ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"],
                ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"],
                ["A4", "A4"], ["A5", "A5"]] },
        { type: "field_dropdown", name: "PIN2", options: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"],
                ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"],
                ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"],
                ["A4", "A4"], ["A5", "A5"]] },
        { type: "field_dropdown", name: "DIRECTION", options: [["Forward", "FORWARD"], ["Backward", "BACKWARD"], ["Stop", "STOP"]] },
        { type: "input_value", name: "SPEED", check: "Number" }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 200,
    tooltip: "Điều khiển chiều quay và tốc độ của động cơ DC (tốc độ từ 0 đến 255)",
    helpUrl: ""
};

const lcdDisplay = {
    type: "lcd_display",
    message0: "Show text %1 at row %2 column %3 on LCD",
    args0: [
        { type: "input_value", name: "TEXT", check: "String" },
        { type: "field_dropdown", name: "ROW", options: [["0", "0"], ["1", "1"]] },
        {
            type: "field_dropdown", name: "COL", options: [
                ["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"],
                ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"],
                ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"],
                ["A4", "A4"], ["A5", "A5"]
            ]
        }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 160,
    tooltip: "Hiển thị chữ lên màn hình LCD tại hàng và cột đã chọn",
    helpUrl: ""
};

const lightSensor = {
    type: "light_sensor",
    message0: "Read light level from LDR at PIN %1",
    args0: [
        { type: "field_dropdown", name: "PIN", options: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]] }
    ],
    output: "Number",
    colour: 180,
    tooltip: "Đọc giá trị ánh sáng từ cảm biến quang trở (LDR)",
    helpUrl: ""
};

const pirMotionSensor = {
    type: "pir_motion_sensor",
    message0: "PIR motion detected at PIN %1",
    args0: [
        { type: "field_dropdown", name: "PIN", options: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"],
                ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"],
                ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"],
                ["A4", "A4"], ["A5", "A5"]] }
    ],
    output: "Boolean",
    colour: 180,
    tooltip: "Phát hiện chuyển động bằng cảm biến PIR (trả về đúng/sai)",
    helpUrl: ""
};

const debouncedButton = {
    type: "debounced_button",
    message0: "Button at PIN %1 pressed? (debounce %2 ms)",
    args0: [
        { type: "field_dropdown", name: "PIN", options: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"],
                ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"],
                ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"],
                ["A4", "A4"], ["A5", "A5"]] },
        { type: "input_value", name: "DEBOUNCE_TIME", check: "Number" }
    ],
    output: "Boolean",
    colour: 180,
    tooltip: "Đọc trạng thái nút nhấn với thời gian chống nhiễu (debounce)",
    helpUrl: ""
};

const stepperMotorControl = {
    type: "stepper_motor_control",
    message0: "Move stepper motor %1 steps at speed %2",
    args0: [
        { type: "input_value", name: "STEPS", check: "Number" },
        { type: "input_value", name: "SPEED", check: "Number" }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 200,
    tooltip: "Điều khiển motor bước (dương: quay phải, âm: quay trái)",
    helpUrl: ""
};

// 10. Khối thiết lập Serial
const serialBegin = {
    type: "serial_begin",
    message0: "Start Serial at %1 baud",
    args0: [
        {
            type: "field_dropdown",
            name: "BAUD_RATE",
            options: [
                ["9600", "9600"],
                ["19200", "19200"],
                ["38400", "38400"],
                ["57600", "57600"],
                ["115200", "115200"]
            ]
        }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: "Bắt đầu giao tiếp Serial với tốc độ baud đã chọn",
    helpUrl: "http://arduino.cc/en/Serial/Begin"
};

const mapExtended = {
    type: "map_extended",
    message0: "Map %1 from [%2 - %3] to [%4 - %5]",
    args0: [
        { type: "input_value", name: "VALUE", check: "Number" },
        { type: "input_value", name: "FROM_LOW", check: "Number" },
        { type: "input_value", name: "FROM_HIGH", check: "Number" },
        { type: "input_value", name: "TO_LOW", check: "Number" },
        { type: "input_value", name: "TO_HIGH", check: "Number" }
    ],
    inputsInline: true,
    output: "Number",
    colour: 230,
    tooltip: "Chuyển đổi giá trị từ khoảng này sang khoảng khác (hàm map)",
    helpUrl: "http://arduino.cc/en/Reference/Map"
};

const waitUntil = {
    type: "wait_until",
    message0: "Wait until %1 is true",
    args0: [
        { type: "input_value", name: "CONDITION", check: "Boolean" }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: "Dừng lại và đợi cho đến khi điều kiện đúng",
    helpUrl: ""
};

const setup = {
    type: "setup",
    message0: "When program starts",
    message1: "%1",
    args1: [
        { type: "input_statement", name: "SETUP_CODE" }
    ],
    colour: 230,
    tooltip: "Chạy một lần duy nhất khi bắt đầu chương trình",
    helpUrl: ""
};

const loop = {
    type: "loop",
    message0: "Repeat forever",
    message1: "%1",
    args1: [
        { type: "input_statement", name: "LOOP_CODE" }
    ],
    colour: 230,
    tooltip: "Lặp lại mã này liên tục",
    helpUrl: ""
};

const servoRotate = {
    type: "servo_rotate",
    message0: "Rotate servo at PIN %1 to angle %2",
    args0: [
        { type: "input_value", name: "SERVO_PIN", check: "Number" },
        { type: "input_value", name: "ANGLE", check: "Number" }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: "Xoay servo đến góc chỉ định (từ 0 đến 180 độ)",
    helpUrl: ""
};

// Block: Servo setup
const servoSetup = {
    type: 'servo_setup',
    message0: 'Setup servo at pin %1',
    args0: [
        {
            type: 'input_value',
            name: 'SERVO_PIN',
            check: 'Number',
        },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: 'Chuẩn bị để dùng servo tại chân được chọn',
    helpUrl: '',
};

// Block: Servo continuous rotation
const servoContinuous = {
    type: 'servo_continuous',
    message0: 'Rotate servo %1 at speed %2',
    args0: [
        {
            type: 'input_value',
            name: 'SERVO_PIN',
            check: 'Number',
        },
        {
            type: 'input_value',
            name: 'SPEED',
            check: 'Number',
        },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: 'Xoay servo liên tục với tốc độ từ -100 (xoay ngược) đến 100 (xoay xuôi)',
    helpUrl: '',
};

// Block: Servo stop
const servoStop = {
    type: 'servo_stop',
    message0: 'Stop servo %1',
    args0: [
        {
            type: 'input_value',
            name: 'SERVO_PIN',
            check: 'Number',
        },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: 'Ngừng quay servo tại chân được chọn',
    helpUrl: '',
};


export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([
  simulateLed,
    setup,
    loop,
  addText,
  logText,
    printResultBlock,
  inoutDigitalWrite,
  inoutDigitalRead,
  inoutAnalogWrite,
  inoutAnalogRead,
  inoutBuildinLed,
  inoutPinMode,
  baseDelay,
  baseMap,
  inoutTone,
  inoutNotone,
  inoutHighlow,
  servoMove,
  servoReadDegrees,
  serialPrint,
  colourPicker,
  logicIf,
  logicCompare,
  logicOperation,
  logicNegate,
  logicBoolean,
  logicNull,
  logicTernary,
  colourRandom,
  colourRGB,
  colourBlend,
  millisBlock,
  delayMicrosecondsBlock,
  serialPrintln,
  // controlsRepeat,
  controlsRepeatExt,
  // controlsWhileUntil,
  controlsFor,
  controlsForEach,
  controlsFlowStatements,

    rgbLedControl,
    dhtSensor,
    ultrasonicSensor,
    dcMotorControl,
    lcdDisplay,
    lightSensor,
    pirMotionSensor,
    debouncedButton,
    stepperMotorControl,
    serialBegin,
    mapExtended,
    waitUntil,
    servoRotate,
    servoSetup,
    servoContinuous,
    servoStop
]);
