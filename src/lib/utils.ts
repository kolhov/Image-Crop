export function downloadBlobAsImage(blob: Blob, name: string) {
  const a = document.createElement("a");
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = name;
  a.click();

  a.remove();
  URL.revokeObjectURL(url);
}
