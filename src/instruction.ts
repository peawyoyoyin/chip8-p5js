type InstructionBase<Op extends string, Param extends never | number[] = never> = {
  op: Op,
  params: Param
}

// 0NNN
type CallSystem = InstructionBase<'CALL_SYSTEM', [n: number]>

// 00E0
type ClearDisplay = InstructionBase<'CLEAR_DISPLAY'>

// 00EE
type Return = InstructionBase<'RETURN'>

// 1NNN
type Goto = InstructionBase<'GOTO', [n: number]>

// 2NNN
type Call = InstructionBase<'CALL', [n: number]>

// 3XNN
type SkipIfEqual = InstructionBase<'SKIP_IF_EQUAL', [x: number, n: number]>

// 4XNN
type SkipIfNEqual = InstructionBase<'SKIP_IF_NEQUAL', [x: number, n: number]>

// 5XY0
type SkipIfVEqual = InstructionBase<'SKIP_IF_VEQUAL', [x: number, y: number]>

// 6XNN
type SetVariable = InstructionBase<'SET_VARIABLE', [x: number, n: number]>

// 7XNN
type AddConst = InstructionBase<'ADD_VARIABLE', [x: number, n: number]>

// 8XY0
type Assign = InstructionBase<'ASSIGN_VARIABLE', [x: number, y: number]>

// 8XY1
type Or = InstructionBase<'OR', [r1: number, r2: number]>

// 8XY2
type And = InstructionBase<'AND', [r1: number, r2: number]>

// 8XY3
type Xor = InstructionBase<'XOR', [r1: number, r2: number]>

// 8XY4
type Add = InstructionBase<'ADD', [r1: number, r2: number]>

// 8XY5
type Subtract = InstructionBase<'SUBTRACT', [r1: number, r2: number]>

// 8XY6
type RShift = InstructionBase<'RSHIFT', [r1: number]>

// 8XY7
type RSubtract = InstructionBase<'RSUBTRACT', [r1: number, r2: number]>

// 8XYE
type LShift = InstructionBase<'LSHIFT', [r1: number]>

// 9XY0
type SkipIfNVEqual = InstructionBase<'SKIP_IF_NV_EQUAL', [r1: number, r2: number]>

// ANNN
type SetI = InstructionBase<'SET_I', [a1: number]>

// BNNN
type Jump = InstructionBase<'JUMP', [a1: number]>

// CXNN
type AndRand = InstructionBase<'AND_RAND', [r1: number, o1: number]>

// DXYN
type Draw = InstructionBase<'DRAW', [r1: number, r2: number, o1: number]>

// EX9E
type SkipIfPressed = InstructionBase<'SKIP_IF_PRESSED', [r1: number]>

// EXA1
type SkipIfNPressed = InstructionBase<'SKIP_IF_NPRESSED', [r1: number]>

// FX07
type GetTimer = InstructionBase<'GET_TIMER', [r1: number]>

// FX0A
type GetKeyPressed = InstructionBase<'GET_KEY_PRESSED', [r1: number]>

// FX15
type SetDelayTimer = InstructionBase<'SET_DELAY_TIMER', [r1: number]>

// FX18
type SetSoundTimer = InstructionBase<'SET_SOUND_TIMER', [r1: number]>

// FX1E
type AddI = InstructionBase<'ADD_I', [r1: number]>

// FX29
type SetSpriteLoc = InstructionBase<'SET_SPRITE_LOC', [r1: number]>

// FX33
type StoreBCD = InstructionBase<'STORE_BCD', [r1: number]>

//FX55
type MemDump = InstructionBase<'MEM_DUMP', [r1: number]>

// FX65	
type MemLoad = InstructionBase<'MEM_LOAD', [r1: number]>

export type Instruction =
    CallSystem
  | ClearDisplay
  | Return
  | Goto
  | Call
  | SkipIfEqual
  | SkipIfNEqual
  | SkipIfVEqual
  | SetVariable
  | AddConst
  | Assign
  | Or
  | And
  | Xor
  | Add
  | Subtract
  | RShift
  | RSubtract
  | LShift
  | SkipIfNVEqual
  | SetI
  | Jump
  | AndRand
  | Draw
  | SkipIfPressed
  | SkipIfNPressed
  | GetTimer
  | GetKeyPressed
  | SetDelayTimer
  | SetSoundTimer
  | AddI
  | SetSpriteLoc
  | StoreBCD
  | MemDump
  | MemLoad

type Creator<I extends Instruction> =
  I['params'] extends never ?
      (() => InstructionBase<I['op'], never>) 
    : ((...params: I['params']) => I);

// creators
function genericCreator<
  I extends Instruction
>(op: I['op']) {
  const create: Creator<I> = (
    (...params: I['params']) => ({ op, params })
  ) as Creator<I>
  return create
}

export const callSystem = genericCreator<CallSystem>('CALL_SYSTEM')
export const clearDisplay = genericCreator<ClearDisplay>('CLEAR_DISPLAY')
export const return_ = genericCreator<Return>('RETURN')
export const goto = genericCreator<Goto>('GOTO')
export const call = genericCreator<Call>('CALL')
export const skipIfEqual = genericCreator<SkipIfEqual>('SKIP_IF_EQUAL')
export const skipIfNEqual = genericCreator<SkipIfNEqual>('SKIP_IF_NEQUAL')
export const skipIfVEqual = genericCreator<SkipIfVEqual>('SKIP_IF_VEQUAL')
export const setVariable = genericCreator<SetVariable>('SET_VARIABLE')
export const addConst = genericCreator<AddConst>('ADD_VARIABLE')
export const assign = genericCreator<Assign>('ASSIGN_VARIABLE')
export const or = genericCreator<Or>('OR')
export const and = genericCreator<And>('AND')
export const xor = genericCreator<Xor>('XOR')
export const add = genericCreator<Add>('ADD')
export const subtract = genericCreator<Subtract>('SUBTRACT')
export const rShift = genericCreator<RShift>('RSHIFT')
export const rSubtract = genericCreator<RSubtract>('RSUBTRACT')
export const lShift = genericCreator<LShift>('LSHIFT')
export const skipIfNVEqual = genericCreator<SkipIfNVEqual>('SKIP_IF_NV_EQUAL')
export const setI = genericCreator<SetI>('SET_I')
export const jump = genericCreator<Jump>('JUMP')
export const andRand = genericCreator<AndRand>('AND_RAND')
export const draw = genericCreator<Draw>('DRAW')
export const skipIfPressed = genericCreator<SkipIfPressed>('SKIP_IF_PRESSED')
export const skipIfNPressed = genericCreator<SkipIfNPressed>('SKIP_IF_NPRESSED')
export const getTimer = genericCreator<GetTimer>('GET_TIMER')
export const getKeyPressed = genericCreator<GetKeyPressed>('GET_KEY_PRESSED')
export const setDelayTimer = genericCreator<SetDelayTimer>('SET_DELAY_TIMER')
export const setSoundTimer = genericCreator<SetSoundTimer>('SET_SOUND_TIMER')
export const addI = genericCreator<AddI>('ADD_I')
export const setSpriteLoc = genericCreator<SetSpriteLoc>('SET_SPRITE_LOC')
export const storeBCD = genericCreator<StoreBCD>('STORE_BCD')
export const memDump = genericCreator<MemDump>('MEM_DUMP')
export const memLoad = genericCreator<MemLoad>('MEM_LOAD')