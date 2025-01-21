document.getElementById('pdfForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const url = document.getElementById('url').value;
    const orientation = document.getElementById('orientation').value;
    const paperSize = document.getElementById('paperSize').value;
    const margins = parseInt(document.getElementById('margins').value);
    const pdfNameInput = document.getElementById('pdfName');
    let pdfName = pdfNameInput.value.trim();

    if (!pdfName) {
        alert("Please enter a file name before proceeding.");
        return;
    }

    if (!pdfName.endsWith('.pdf')) {
        pdfName += '.pdf';
    }

    const response = await fetch('/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, orientation, paperSize, margins }),
    });

    const data = await response.json();
    const resultDiv = document.getElementById('result');

    if (data.success) {
        const pdfUrl = data.pdfPath;

        resultDiv.innerHTML = `
            <p>Your PDF has been generated. Preview:</p>
            <iframe src="${pdfUrl}" width="100%" height="500px"></iframe>
        `;

        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = pdfName;
        link.click();
    } else {
        resultDiv.innerHTML = `<p style="color: red;">Error: ${data.error}</p>`;
    }
});
