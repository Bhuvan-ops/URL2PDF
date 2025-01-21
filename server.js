const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/pdfs', express.static('/home/bhuvank/Downloads/pdfs'));

app.post('/convert', async (req, res) => {
    const { url, orientation, paperSize, margins } = req.body;

    if (!url || !/^https?:\/\//.test(url)) {
        return res.json({ success: false, error: 'Invalid URL' });
    }

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'networkidle2' });
const pdfPath = path.join('/home/bhuvank/Downloads/pdfs', `${Date.now()}.pdf`);

        await page.pdf({
            path: pdfPath,
            format: paperSize,
            landscape: orientation === 'landscape',
            margin: {
                top: `${margins}mm`,
                bottom: `${margins}mm`,
                left: `${margins}mm`,
                right: `${margins}mm`
            }
        });
        await browser.close();

        res.json({ success: true, pdfPath: `/pdfs/${path.basename(pdfPath)}` });
    } catch (error) {
        await browser.close();
        res.json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
