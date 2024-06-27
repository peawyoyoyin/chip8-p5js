import { decodeInstruction } from "./decode"
import { Display } from "./display"
import { Input } from "./input"
import { Instruction } from "./instruction"

type InstructionData = readonly [b1: number, b2: number]

const font = [
  [0xF0, 0x90, 0x90, 0x90, 0xF0], // 0
  [0x20, 0x60, 0x20, 0x20, 0x70], // 1
  [0xF0, 0x10, 0xF0, 0x80, 0xF0], // 2
  [0xF0, 0x10, 0xF0, 0x10, 0xF0], // 3
  [0x90, 0x90, 0xF0, 0x10, 0x10], // 4
  [0xF0, 0x80, 0xF0, 0x10, 0xF0], // 5
  [0xF0, 0x80, 0xF0, 0x90, 0xF0], // 6
  [0xF0, 0x10, 0x20, 0x40, 0x40], // 7
  [0xF0, 0x90, 0xF0, 0x90, 0xF0], // 8
  [0xF0, 0x90, 0xF0, 0x10, 0xF0], // 9
  [0xF0, 0x90, 0xF0, 0x90, 0x90], // A
  [0xE0, 0x90, 0xE0, 0x90, 0xE0], // B
  [0xF0, 0x80, 0x80, 0x80, 0xF0], // C
  [0xE0, 0x90, 0x90, 0x90, 0xE0], // D
  [0xF0, 0x80, 0xF0, 0x80, 0xF0], // E
  [0xF0, 0x80, 0xF0, 0x80, 0x80]  // F
]

export class Chip8 {
  private static baseFontAddr = 0x050
  private static baseRomAddr = 0x200

  private memory: Uint8Array
  private pc: number = 0x200
  private i: number = 0x0
  private stack: number[] = []
  private v: Uint8Array = new Uint8Array(16) 

  private delayTimer: number = 0
  private soundTimer: number = 0

  constructor(
    private display: Display,
    private input: Input,
    public rom: Uint8Array
  ) {
    this.memory = new Uint8Array(4096).fill(0x0)

    // load font
    let addr = Chip8.baseFontAddr
    for (let data of font.flat()) {
      this.memory[addr] = data
      addr += 1
    }

    // load ROM
    addr = Chip8.baseRomAddr
    for (let data of rom) {
      this.memory[addr] = data
      addr += 1
    }
  }

  tick() {
    this.decrementTimers()

    for (let f=0; f < 16; f++) {
      const data = this.fetch()
      const instruction = this.decode(data)
      this.execute(instruction)
    }
    
  }

  private fetch(): InstructionData {
    const data = [this.memory[this.pc], this.memory[this.pc+1]] as const
    this.pc += 2
    return data
  }

  private decode(data: InstructionData): Instruction {
    return decodeInstruction(data)
  }

  private execute(instruction: Instruction) {
    console.groupCollapsed('execute', instruction.op, JSON.stringify(instruction.params))
    console.log('pc', this.pc)
    console.log('i', this.i)
    console.log('v', [...this.v])
    console.log('s', [...this.stack])
    // debugger
    const { op, params } = instruction

    const [p1, p2, p3] = params
    const nnn = p1
    const nn = p2
    const x = p1
    const y = p2
    const n = p3

    switch(op) {
      case "CALL_SYSTEM":
        // TODO
        break
      case "CLEAR_DISPLAY":
        this.display.clear()
        break
      case "RETURN":
        if (this.stack.length > 0) {
          // console.log('returning', this.stack)
          this.pc = this.stack.pop()!
          // console.log('return to', this.pc)
        }
        // TODO halt
        break
      case "GOTO":
        this.pc = nnn
        break
      case "CALL":
        this.stack.push(this.pc)
        this.pc = nnn
        break
      case "SKIP_IF_EQUAL":
        if (this.v[x] === nn) {
          this.pc += 2
        }
        break
      case "SKIP_IF_NEQUAL":
        if (this.v[x] !== nn) {
          this.pc += 2
        }
        break
      case "SKIP_IF_VEQUAL":
        if (this.v[x] === this.v[y!]) {
          this.pc += 2
        }
        break
      case "SET_VARIABLE":
        this.v[x] = nn!
        break
      case "ADD_VARIABLE":
        this.v[x] += nn!
        break
      case "ASSIGN_VARIABLE":
        this.v[x] = this.v[y!]
        break
      case "OR":
        this.v[x] |= this.v[y!]
        break
      case "AND":
        this.v[x] &= this.v[y!]
        break
      case "XOR":
        this.v[x] ^= this.v[y!]
        break
      case "ADD":
        // overflow
        if (this.v[x] + this.v[y!] > 255) {
          this.v[0xf] = 1
        } else {
          this.v[0xf] = 0
        }

        this.v[x] += this.v[y!]
        break
      case "SUBTRACT":
        if (this.v[x] > this.v[y!]) {
          this.v[0xf] = 1
        } else {
          this.v[0xf] = 0
        }

        this.v[x] -= this.v[y!]
        break
      case "RSHIFT":
        if ((this.v[x] & 1) > 0) {
          this.v[0xf] = 1
        } else {
          this.v[0xf] = 0
        }

        this.v[x] >> 1
        break
      case "RSUBTRACT":
        if (this.v[y!] > this.v[x]) {
          this.v[0xf] = 1
        } else {
          this.v[0xf] = 0
        }

        this.v[x] = this.v[y!] - this.v[x]
        break
      case "LSHIFT":
        if ((this.v[x] & 0x1000000) > 0) {
          this.v[0xf] = 1
        } else {
          this.v[0xf] = 0
        }

        this.v[x] << 1
        break
      case "SKIP_IF_NV_EQUAL":
        if (this.v[x] !== this.v[y!]) {
          this.pc += 2
        }
        break
      case "SET_I":
        this.i = nnn
        break
      case "JUMP":
        this.pc = this.v[0] + nnn
        break
      case "AND_RAND":
        this.v[x] = Math.floor(Math.random() * 256) & nn!
        break
      case "DRAW":
        this.v[0xf] = 0

        let flippedAny = false
        for(let r = 0; r < n!; r++) {
          if (this.v[y!] + r >= Display.height) {
            break
          }

          let row = this.memory[this.i + r]

          let c = 0, mask = 0b10000000;
          while (mask > 0) {
            if (this.v[x]+c >= Display.width) {
              break
            }

            let pixel = (row & mask) > 0

            if (pixel) {
              let flipped = this.display.drawPixel(this.v[x]+c, this.v[y!]+r)

              if (flipped) {
                flippedAny = true
              }
            }


            mask = mask >> 1
            c += 1
          }
        }

        if (flippedAny) {
          this.v[0xf] = 1
        }
        break
      case "SKIP_IF_PRESSED":
        if (this.input.isKeyPressed(this.v[x])) {
          this.pc += 2
        }
        break
      case "SKIP_IF_NPRESSED":
        if (!this.input.isKeyPressed(this.v[x])) {
          this.pc += 2
        }
        break
      case "GET_TIMER":
        this.v[x] = this.delayTimer
        break
      case "GET_KEY_PRESSED":
        // TODO halt until keyPressed is present
        const keyPressed = this.input.getKeyPressed()
        if (keyPressed) {
          this.v[x] = keyPressed
        }
        break
      case "SET_DELAY_TIMER":
        this.delayTimer = this.v[x]
        break
      case "SET_SOUND_TIMER":
        this.soundTimer = this.v[x]
        break
      case "ADD_I":
        this.i += this.v[x]
        break
      case "SET_SPRITE_LOC":
        let index = this.v[x] & 0x0f
        let fontAddr = Chip8.baseFontAddr + (5*index)
        this.i = fontAddr
        break
      case "STORE_BCD":
        const vx = this.v[x]
        const [hundreds, tens, ones] = [
          Math.floor(vx / 100),
          Math.floor(vx / 10) % 10,
          vx % 10
        ] 

        this.memory[this.i] = hundreds
        this.memory[this.i+1] = tens
        this.memory[this.i+2] = ones
        break
      case "MEM_DUMP":
        for (let c = 0; c <= x; c++) {
          this.memory[this.i+c] = this.v[c]
        }
        break
      case "MEM_LOAD":
        for (let c = 0; c <= x; c++) {
          this.v[c] = this.memory[this.i+c] 
        }
        break
    }
    this.display.logDisplay()
    console.groupEnd()
  }

  private decrementTimers() {
    if (this.delayTimer > 0) this.delayTimer -= 1
    if (this.soundTimer > 0) this.soundTimer -= 1
  }
}
