document.addEventListener('DOMContentLoaded', () => {
    const colorInput = document.getElementById('color-input');
    const colorPicker = document.getElementById('color-picker');
    const appBackground = document.getElementById('app-background');
    const printArea = document.getElementById('print-area');
    const errorMessage = document.getElementById('error-message');
    const btnPrint = document.getElementById('btn-print');
    const btnDownload = document.getElementById('btn-download');

    let currentColor = '#4f46e5'; // Default color

    // Function to check if a color string is valid
    function isValidColor(color) {
        const s = new Option().style;
        s.color = color;
        return s.color !== '';
    }

    // Function to apply the color to the UI
    function applyColor(color) {
        if (isValidColor(color)) {
            currentColor = color;
            appBackground.style.backgroundColor = color;
            printArea.style.backgroundColor = color;
            errorMessage.classList.add('hidden');

            const normalizedColor = color.toLowerCase();

            if (normalizedColor === "black" || normalizedColor === "#000000") {
                document.documentElement.style.setProperty("--shadow-color", "rgba(255, 214, 10, 0.45)");
                document.documentElement.style.setProperty("--title-color", "rgb(255, 214, 10)");
            } else {
                document.documentElement.style.setProperty("--title-color", "#111");
                document.documentElement.style.setProperty("--shadow-color", color);
            }

            // Try to sync color picker if it's a hex format
            try {
                // Convert text color to hex using a canvas if it's a valid named color
                const ctx = document.createElement('canvas').getContext('2d');
                ctx.fillStyle = color;
                const hexColor = ctx.fillStyle;
                if (hexColor.startsWith('#') && hexColor.length === 7) {
                    colorPicker.value = hexColor;
                }
            } catch (e) {
                // Ignore errors converting color
            }
        } else {
            errorMessage.classList.remove('hidden');
        }
    }

    // Event listener for text input
    colorInput.addEventListener('input', (e) => {
        const value = e.target.value.trim();
        if (value) {
            applyColor(value);
        } else {
            // Revert to default or last valid
            errorMessage.classList.add('hidden');
        }
    });

    // Event listener for color picker
    colorPicker.addEventListener('input', (e) => {
        const value = e.target.value;
        colorInput.value = value;
        applyColor(value);
    });

    // Event listener for print
    btnPrint.addEventListener('click', () => {
        // Ensure the print area has the background color set explicitly right before printing
        printArea.style.backgroundColor = currentColor;
        window.print();
    });

    // Event listener for high-res download
    btnDownload.addEventListener('click', () => {
        // A4 size at 300 DPI
        const width = 2480;
        const height = 3508;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Fill canvas with color
        ctx.fillStyle = currentColor;
        ctx.fillRect(0, 0, width, height);

        // Convert to data URL and download
        const dataUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = dataUrl;

        // Sanitize color name for filename
        const safeName = currentColor.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        a.download = `color_${safeName}_highres.png`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    // Initialize with default
    applyColor(currentColor);
});
