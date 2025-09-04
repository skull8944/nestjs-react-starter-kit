// filename記得放檔案類型 ex : test.msg
export const downloadFile = (data: number[] | Blob, fileName: string) => {
  const blob = data instanceof Blob ? data : new Blob([Uint8Array.from(data)], { type: '' });
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.style.display = 'none';
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
};

export const downloadFileByUrl = (url: string, fileName: string) => {
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.style.display = 'none';
  a.href = url;
  a.download = fileName;
  a.click();
  a.remove();
};
