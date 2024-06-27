import p5 from "p5";

export class Display {
  static width = 64
  static height = 32
  static scale = 4

  private state: boolean[][]

  constructor(private p: p5) {
    this.state = Array(Display.height)
      .fill(0)
      .map(
        () => Array(Display.width).fill(false)
      )
  }

  setup() {
    this.p.createCanvas(
      (Display.width) * Display.scale,
      Display.height * Display.scale
    )
    this.p.background(0)
    this.p.noStroke()
  }

  clear() {
    for(let y=0; y<Display.height; y++) {
      for (let x=0; x<Display.width; x++) {
        this.state[y][x] = false
      }
    }

    this.p.rect(
      0,
      0,
      Display.width * Display.scale,
      Display.height * Display.scale
    )
  }

  logDisplay() {
    console.groupCollapsed('DISPLAY')
    console.log('previous state')
    console.log(
      this.state.map(r => r.map(c => c ? '1' : ' ').join('')).join('\n')
    )
    console.groupEnd()
  }

  tick() {
    console.log('tick');
    
    // clear
    this.p.fill(0)
    this.p.rect(
      0,
      0,
      Display.width * Display.scale,
      Display.height * Display.scale
    )

    for(let y=0; y<Display.height; y++) {
      for (let x=0; x<Display.width; x++) {
        if(this.state[y][x]) {
          this.p.colorMode(this.p.HSB)
          this.p.fill(this.p.frameCount % 360, 100, 100)    
          this.p.rect(
            x * Display.scale,
            y * Display.scale,
            Display.scale,
            Display.scale
          )      
        }
      }
    }
  }

  drawPixel(_x: number, _y: number): boolean {
    const y = _y % Display.height, x = _x % Display.width

    // console.log('draw', _y, _x, y, x, this.state[y][x]);
    console.groupCollapsed(`DRAW ${x}, ${y} (${_x}, ${_y})`)
    this.logDisplay()
    console.groupEnd()
    // log state

    const prev = this.state[y][x]
    this.state[y][x] = !this.state[y][x]

    // if (this.state[y][x]) {
    //   this.p.colorMode(this.p.HSB)
    //   this.p.fill(this.p.frameCount % 255, 100, 100)
    // } else {
    //   this.p.fill(0)
    // }
    // this.p.rect(
    //   x * Display.scale,
    //   y * Display.scale,
    //   Display.scale,
    //   Display.scale
    // )

    return prev
  }
}
