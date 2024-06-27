import p5 from "p5"
import { readFile } from "./readFile"
import { Chip8 } from "./chip8"
import { Display } from "./display";
import { Input } from "./input";

export class UI {
  private display: Display;
  private input: Input;
  private chip8: Chip8 | undefined;


  constructor(private p: p5) {
    p.preload = this.preload.bind(this)
    p.setup = this.setup.bind(this)
    p.draw = this.draw.bind(this)

    this.display = new Display(p)
    this.input = new Input(p)
  } 

  preload() {

  }

  setup() {
    this.p.frameRate(60)

    this.display.setup()
    const romInput = this.p.createFileInput(async (file: p5.File) => {
      console.log(`loaded ROM ${file.name}`)
      
      const content = await readFile(file.file)
      this.chip8 = new Chip8(
        this.display,
        this.input,
        content
      )
    })
    romInput.position(0, Display.height*Display.scale + 100)
  }

  draw() {
    this.chip8?.tick()
    this.display?.tick()
  }
}

