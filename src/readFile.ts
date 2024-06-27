export const readFile = (file: File) => new Promise<Uint8Array>((resolve) => {
  const fr = new FileReader()
  fr.readAsArrayBuffer(file)
  fr.onloadend = () => {
    resolve(new Uint8Array(fr.result as ArrayBuffer))
  }
})