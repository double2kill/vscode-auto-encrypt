export function isEncryptFile (filePath: string) {
  return /.encrypt$/.test(filePath);
}

export function isOriginFile (filePath: string) {
  return !isEncryptFile(filePath);
}