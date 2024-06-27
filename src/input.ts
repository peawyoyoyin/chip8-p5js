import p5 from "p5"

const keyMapping = [
  49, // 1
  50, // 2
  51, // 3
  52, // 4
  81, // q
  87, // w
  69, // e
  82, // r
  65, // a
  83, // s
  68, // d
  70, // f
  90, // z
  88, // x
  67, // c
  86, // v
] 

export class Input {
  constructor(private p: p5) {}

  isKeyPressed(k: number): boolean {
    return this.p.keyIsDown(keyMapping[k])
  }

  getKeyPressed(): number {
    // TODO
    return 0
  }
}
