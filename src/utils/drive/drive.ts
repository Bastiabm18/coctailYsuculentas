export function convertirLinkDrive(url: string, tamano: string = "w1000"): string {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    const id = match[1];
    return `https://drive.google.com/thumbnail?id=${id}&sz=${tamano}`;
  }
  return url;
}