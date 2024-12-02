import qrcode from 'qrcode';

export const createQrCode = async (data, canvas, customLogo = null) => {
    if (!canvas) throw new Error('Canvas element is not defined.');

    try {
        // Generate QR code
        await qrcode.toCanvas(canvas, data, {
            errorCorrectionLevel: 'H',
            margin: 1,
            width: 1024,
            // width: 144,

        });

        // Optionally add a logo
        if (customLogo) {
            const ctx = canvas.getContext('2d');
            const logo = new Image();
            logo.src = customLogo;

            logo.onload = () => {

                const logoSize = canvas.width * 0.2; // Logo is 20% of QR size
                const x = (canvas.width - logoSize) / 2;
                const y = (canvas.height - logoSize) / 2;

                // Draw black background for the logo
                ctx.fillStyle = '#000000'; // Black background
                ctx.fillRect(x - 5, y - 5, logoSize + 10, logoSize + 10);

                // Draw the logo image on top
                ctx.drawImage(logo, x, y, logoSize, logoSize);
            };

            logo.onerror = (err) => {
                console.error('Logo failed to load:', err);
            };
        }
    } catch (error) {
        console.error('Error generating QR Code:', error);
        throw error;
    }
};