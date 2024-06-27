import {
  Instruction,
  add,
  addConst,
  addI,
  and,
  andRand,
  assign,
  call,
  callSystem,
  clearDisplay,
  draw,
  getKeyPressed,
  getTimer,
  goto,
  jump,
  lShift,
  memDump,
  memLoad,
  or,
  rShift,
  rSubtract,
  return_,
  setDelayTimer,
  setI,
  setSoundTimer,
  setSpriteLoc,
  setVariable,
  skipIfEqual,
  skipIfNEqual,
  skipIfNPressed,
  skipIfNVEqual,
  skipIfPressed,
  skipIfVEqual,
  storeBCD,
  subtract,
  xor,
} from "./instruction"

const [A, B, C, D, E, F] = [0xa, 0xb, 0xc, 0xd, 0xe, 0xf]

export function decodeInstruction([b1, b2]: readonly [
  b1: number,
  b2: number
]): Instruction {
  const f = (b1 & 0xf0) >> 4
  const x = b1 & 0x0f
  const y = (b2 & 0xf0) >> 4
  const t = b2 & 0x0f

  const nn = b2
  const nnn = (x << 8) | b2

  switch (f) {
    case 0:
      // 0NNN | 00E0 | 00EE
      switch (b2) {
        case 0xe0:
          return clearDisplay()
        case 0xee:
          return return_()
        default:
          return callSystem(nnn)
      }
    case 1:
      // 1NNN
      return goto(nnn)
    case 2:
      // 2NNN
      return call(nnn)
    case 3:
      // 3XNN
      return skipIfEqual(x, nn)
    case 4:
      // 4XNN
      return skipIfNEqual(x, nn)
    case 5:
      // 5XY0
      return skipIfVEqual(x, y)
    case 6:
      // 6XNN
      return setVariable(x, nn)
    case 7:
      // 7XNN
      return addConst(x, nn)
    case 8:
      // 8XY0 | 8XY1 | 8XY2 | 8XY3 | 8XY4 | 8XY5 | 8XY6 | 8XY7 | 8XYE
      switch (t) {
        case 0:
          return assign(x, y)
        case 1:
          return or(x, y)
        case 2:
          return and(x, y)
        case 3:
          return xor(x, y)
        case 4:
          return add(x, y)
        case 5:
          return subtract(x, y)
        case 6:
          return rShift(x)
        case 7:
          return rSubtract(x, y)
        case E:
          return lShift(x)
        default:
          throw new Error(`unknown instruction ${b1} ${b2}`)
      }
    case 9:
      // 9XY0
      return skipIfNVEqual(x, y)
    case A:
      // ANNN
      return setI(nnn)
    case B:
      // BNNN
      return jump(nnn)
    case C:
      // CXNN
      return andRand(x, nn)
    case D:
      // DXYN:
      return draw(x, y, t)
    case E:
      // EX9E | EXA1
      switch (b2) {
        case 0x9e:
          return skipIfPressed(x)
        case 0xa1:
          return skipIfNPressed(x)
        default:
          throw new Error(`unknown instruction ${b1} ${b2}`)
      }
    case F:
      // FX07 | FX0A | FX15 | FX18 | FX1E | FX29 | FX33 | FX55 | FX65
      switch (b2) {
        case 0x07:
          return getTimer(x)
        case 0x0a:
          return getKeyPressed(x)
        case 0x15:
          return setDelayTimer(x)
        case 0x18:
          return setSoundTimer(x)
        case 0x1e:
          return addI(x)
        case 0x29:
          return setSpriteLoc(x)
        case 0x33:
          return storeBCD(x)
        case 0x55:
          return memDump(x)
        case 0x65:
          return memLoad(x)
        default:
          throw new Error(`unknown instruction ${b1} ${b2}`)
      }
    default:
      throw new Error(`unknown instruction ${b1} ${b2}`)
  }
}
