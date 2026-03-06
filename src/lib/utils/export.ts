/**
 * Export the photo strip to a PNG file using html2canvas.
 * The element should be the rendered strip DOM node.
 */
export async function exportStrip(element: HTMLElement): Promise<void> {
    // Dynamically import to avoid SSR issues
    const html2canvas = (await import('html2canvas')).default;

    const canvas = await html2canvas(element, {
        useCORS: true,
        scale: 2, // higher resolution
        backgroundColor: null,
        logging: false,
    });

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;

    // Filename: photobooth-strip-YYYY-MM-DD-HHmmss.png
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timestamp = [
        now.getFullYear(),
        pad(now.getMonth() + 1),
        pad(now.getDate()),
        '-',
        pad(now.getHours()),
        pad(now.getMinutes()),
        pad(now.getSeconds()),
    ].join('');

    link.download = `photobooth-strip-${timestamp}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
