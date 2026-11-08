import { jsPDF } from 'jspdf';
import JSZip from 'jszip';

/**
 * Clean text from markdown formatting for simple plain text extraction
 */
function stripMarkdown(md) {
  return md
    .replace(/^#+\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/^>\s+/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/---/g, '');
}

/**
 * Download a file in browser
 */
function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generate and download formatted PDF book
 */
export async function exportToPdf(book) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  // --- COVER PAGE ---
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Decorative border
  doc.setDrawColor(99, 102, 241); // indigo-500
  doc.setLineWidth(1.5);
  doc.rect(margin - 5, margin - 5, contentWidth + 10, pageHeight - (margin * 2) + 10);

  // Cover Category badge
  doc.setTextColor(165, 180, 252);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text((book.genre || 'ORIGINAL EDITION').toUpperCase(), pageWidth / 2, 60, { align: 'center' });

  // Book Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(book.title || 'Untitled Book', contentWidth - 20);
  doc.text(titleLines, pageWidth / 2, 85, { align: 'center' });

  // Subtitle
  if (book.subtitle) {
    doc.setTextColor(203, 213, 225);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    const subLines = doc.splitTextToSize(book.subtitle, contentWidth - 30);
    doc.text(subLines, pageWidth / 2, 115, { align: 'center' });
  }

  // Author
  doc.setTextColor(244, 63, 94); // rose accent
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('WRITTEN BY', pageWidth / 2, 220, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text(book.author || 'Guddi Trivedy', pageWidth / 2, 230, { align: 'center' });

  // Footer imprint
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text('Published with PageCraft On-Demand Publishing Engine', pageWidth / 2, 265, { align: 'center' });

  // --- TABLE OF CONTENTS PAGE ---
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Table of Contents', margin, 35);

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, 42, pageWidth - margin, 42);

  let tocY = 55;
  (book.chapters || []).forEach((ch, idx) => {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(99, 102, 241);
    doc.text(`Chapter ${ch.number || idx + 1}:`, margin, tocY);

    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'normal');
    doc.text(ch.title || `Chapter ${idx + 1}`, margin + 30, tocY);

    tocY += 12;
  });

  // Synopsis / Introduction box
  if (book.synopsis) {
    tocY += 10;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, tocY, contentWidth, 50, 3, 3, 'F');
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    const synLines = doc.splitTextToSize(`Synopsis:\n${book.synopsis}`, contentWidth - 10);
    doc.text(synLines, margin + 5, tocY + 10);
  }

  // --- CHAPTERS PAGES ---
  (book.chapters || []).forEach((ch, chIdx) => {
    doc.addPage();
    let currentY = 35;

    // Chapter Header
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(99, 102, 241);
    doc.text(`CHAPTER ${ch.number || chIdx + 1}`, margin, currentY);

    currentY += 10;
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    const chTitleLines = doc.splitTextToSize(ch.title, contentWidth);
    doc.text(chTitleLines, margin, currentY);
    currentY += (chTitleLines.length * 8) + 8;

    doc.setDrawColor(226, 232, 240);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 12;

    // Body text
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);

    const paragraphs = (ch.content || ch.summary || 'Content in progress...')
      .split('\n\n')
      .filter(p => p.trim());

    for (const para of paragraphs) {
      if (para.startsWith('### ') || para.startsWith('## ')) {
        const hText = para.replace(/^#+\s*/, '');
        currentY += 6;
        if (currentY > pageHeight - 30) {
          doc.addPage();
          currentY = 30;
        }
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(hText, margin, currentY);
        currentY += 8;
        doc.setFontSize(10.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);
      } else if (para.startsWith('>')) {
        // Quote block
        const quoteText = para.replace(/^>\s*/gm, '');
        const qLines = doc.splitTextToSize(stripMarkdown(quoteText), contentWidth - 15);
        const blockHeight = (qLines.length * 5.5) + 8;

        if (currentY + blockHeight > pageHeight - 30) {
          doc.addPage();
          currentY = 30;
        }

        doc.setFillColor(241, 245, 249);
        doc.rect(margin, currentY - 4, contentWidth, blockHeight, 'F');
        doc.setFillColor(99, 102, 241);
        doc.rect(margin, currentY - 4, 3, blockHeight, 'F');

        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(71, 85, 105);
        doc.text(qLines, margin + 8, currentY + 3);
        currentY += blockHeight + 6;
      } else {
        // Regular paragraph
        const plain = stripMarkdown(para);
        const lines = doc.splitTextToSize(plain, contentWidth);
        const pHeight = lines.length * 5.5;

        if (currentY + pHeight > pageHeight - 25) {
          doc.addPage();
          currentY = 30;
        }

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10.5);
        doc.setTextColor(51, 65, 85);
        doc.text(lines, margin, currentY);
        currentY += pHeight + 5;
      }
    }

    // Page number footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let p = 2; p <= pageCount; p++) {
      doc.setPage(p);
      doc.setFontSize(8.5);
      doc.setTextColor(148, 163, 184);
      doc.text(`${book.title} — Page ${p} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }
  });

  const safeFilename = `${(book.title || 'ebook').toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`;
  doc.save(safeFilename);
}

/**
 * Generate and download valid EPUB format for Kindle / Apple Books
 */
export async function exportToEpub(book) {
  const zip = new JSZip();
  const bookId = `urn:uuid:${book.id || 'pagecraft-' + Date.now()}`;
  const safeTitle = (book.title || 'Untitled eBook').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const authorName = (book.author || 'Guddi Trivedy').replace(/&/g, '&amp;');

  // 1. mimetype (must be first, uncompressed)
  zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });

  // 2. META-INF/container.xml
  zip.folder('META-INF').file('container.xml', `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`);

  const oebps = zip.folder('OEBPS');

  // CSS style
  oebps.file('style.css', `
    body { font-family: sans-serif; line-height: 1.6; margin: 5%; color: #222; }
    h1 { color: #312e81; border-bottom: 2px solid #e0e7ff; padding-bottom: 8px; }
    h2 { color: #4338ca; margin-top: 1.5em; }
    blockquote { border-left: 4px solid #6366f1; margin: 1.5em 0; padding-left: 1em; color: #475569; font-style: italic; }
    .cover { text-align: center; margin-top: 25%; }
    .cover-title { font-size: 2.5em; font-weight: bold; margin-bottom: 0.2em; color: #1e1b4b; }
    .cover-subtitle { font-size: 1.2em; color: #4f46e5; margin-bottom: 2em; }
    .cover-author { font-size: 1.4em; font-weight: bold; color: #e11d48; }
  `);

  // Cover xhtml
  oebps.file('cover.xhtml', `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>${safeTitle}</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
  <div class="cover">
    <div class="cover-title">${safeTitle}</div>
    <div class="cover-subtitle">${book.subtitle || ''}</div>
    <p>Written by</p>
    <div class="cover-author">${authorName}</div>
  </div>
</body>
</html>`);

  // Chapter files
  const chapterItems = [];
  const spineItems = ['<itemref idref="cover"/>'];

  (book.chapters || []).forEach((ch, idx) => {
    const chFilename = `chapter_${idx + 1}.xhtml`;
    chapterItems.push({
      id: `chap_${idx + 1}`,
      href: chFilename,
      title: ch.title
    });
    spineItems.push(`<itemref idref="chap_${idx + 1}"/>`);

    const chContentHtml = (ch.content || ch.summary || '')
      .split('\n\n')
      .map(p => {
        if (p.startsWith('### ')) return `<h3>${p.replace('### ', '')}</h3>`;
        if (p.startsWith('## ')) return `<h2>${p.replace('## ', '')}</h2>`;
        if (p.startsWith('>')) return `<blockquote>${p.replace(/^>\s*/gm, '')}</blockquote>`;
        return `<p>${p}</p>`;
      })
      .join('\n');

    oebps.file(chFilename, `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>${ch.title}</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
  <h1>Chapter ${ch.number || idx + 1}: ${ch.title}</h1>
  ${chContentHtml}
</body>
</html>`);
  });

  // content.opf
  const manifestItems = [
    '<item id="style" href="style.css" media-type="text/css"/>',
    '<item id="cover" href="cover.xhtml" media-type="application/xhtml+xml"/>',
    ...chapterItems.map(item => `<item id="${item.id}" href="${item.href}" media-type="application/xhtml+xml"/>`)
  ].join('\n    ');

  oebps.file('content.opf', `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookId" version="3.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="BookId">${bookId}</dc:identifier>
    <dc:title>${safeTitle}</dc:title>
    <dc:creator>${authorName}</dc:creator>
    <dc:language>en</dc:language>
    <dc:publisher>PageCraft On-Demand</dc:publisher>
    <meta property="dcterms:modified">${new Date().toISOString().replace(/\.[0-9]+Z$/, 'Z')}</meta>
  </metadata>
  <manifest>
    ${manifestItems}
  </manifest>
  <spine>
    ${spineItems.join('\n    ')}
  </spine>
</package>`);

  // Generate EPUB zip blob
  const content = await zip.generateAsync({ type: 'blob', mimeType: 'application/epub+zip' });
  const safeFilename = `${(book.title || 'ebook').toLowerCase().replace(/[^a-z0-9]/g, '_')}.epub`;
  triggerDownload(content, safeFilename);
}

/**
 * Export to Markdown file
 */
export function exportToMarkdown(book) {
  let md = `# ${book.title}\n\n`;
  if (book.subtitle) md += `*${book.subtitle}*\n\n`;
  md += `**Author:** ${book.author || 'Guddi Trivedy'}  \n`;
  md += `**Genre:** ${book.genre || 'General'}  \n`;
  md += `**Date:** ${new Date().toLocaleDateString()}  \n\n`;

  if (book.synopsis) {
    md += `## Synopsis\n\n${book.synopsis}\n\n---\n\n`;
  }

  (book.chapters || []).forEach((ch, idx) => {
    md += `## Chapter ${ch.number || idx + 1}: ${ch.title}\n\n`;
    md += `${ch.content || ch.summary || ''}\n\n---\n\n`;
  });

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const safeFilename = `${(book.title || 'ebook').toLowerCase().replace(/[^a-z0-9]/g, '_')}.md`;
  triggerDownload(blob, safeFilename);
}
