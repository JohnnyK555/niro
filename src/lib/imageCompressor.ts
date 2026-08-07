export async function compressImageFile(
  file: File,
  maxDimension = 1920,
  quality = 0.82
): Promise<{ title: string; dataUrl: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onerror = () => {
      // Fallback
      resolve({ title: file.name, dataUrl: '' });
    };
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (!src) {
        resolve({ title: file.name, dataUrl: '' });
        return;
      }

      const img = new Image();
      img.onerror = () => {
        // Fallback to original src if image fail to render on canvas
        resolve({ title: file.name, dataUrl: src });
      };
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ title: file.name, dataUrl: src });
          return;
        }

        // Draw white background in case PNG had transparency
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve({ title: file.name, dataUrl: compressedDataUrl });
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}
