import p5 from 'p5'
import { UI } from './ui'

new p5((p) => new UI(p), document.getElementById('p5')!)
