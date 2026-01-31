class PDFGenerator {
    constructor() {
        this.doc = null;
        this.yPos = 20;
        this.pageHeight = 280;
        this.leftMargin = 20;
        this.rightMargin = 190;
        this.lineHeight = 6;
    }

    async generatePDF(resumeData) {
        // Create new jsPDF instance
        this.doc = new jspdf.jsPDF();
        this.yPos = 20;

        // Generate each section
        this.renderHeader(resumeData.basics);
        this.renderSummary(resumeData.basics.summary);
        this.renderWorkExperience(resumeData.work);
        this.renderEducation(resumeData.education);
        this.renderSkills(resumeData.skills);
        this.renderCertificates(resumeData.certificates);
        this.renderLanguages(resumeData.languages);
        this.renderAwards(resumeData.awards);

        // Save the PDF
        this.doc.save(`${resumeData.basics.name.replace(/\s+/g, '_')}_Resume.pdf`);
    }

    checkPageBreak(requiredSpace = 20) {
        if (this.yPos + requiredSpace > this.pageHeight) {
            this.doc.addPage();
            this.yPos = 20;
        }
    }

    renderHeader(basics) {
        // Name
        this.doc.setFontSize(18);
        this.doc.setFont('times', 'bold');
        this.doc.text(basics.name, 105, this.yPos, { align: 'center' });
        this.yPos += 6;

        // Title
        this.doc.setFontSize(11);
        this.doc.setFont('times', 'normal');
        this.doc.setTextColor(100);
        this.doc.text(basics.label, 105, this.yPos, { align: 'center' });
        this.yPos += 5;

        // Contact info line
        this.doc.setFontSize(9);
        this.doc.setTextColor(60);
        const contactParts = [];
        if (basics.email) contactParts.push(basics.email);
        if (basics.phone) contactParts.push(basics.phone);
        if (basics.location?.city) contactParts.push(basics.location.city);

        const contactLine = contactParts.join('  |  ');
        this.doc.text(contactLine, 105, this.yPos, { align: 'center' });
        this.yPos += 4;

        // Social profiles line
        if (basics.profiles && basics.profiles.length > 0) {
            this.doc.setTextColor(40, 80, 120);
            const profileLinks = basics.profiles.map(p => `${p.network}: ${p.url}`).join('  |  ');
            const profileLines = this.doc.splitTextToSize(profileLinks, this.rightMargin - this.leftMargin);
            this.doc.text(profileLines, 105, this.yPos, { align: 'center' });
            this.yPos += profileLines.length * 4;
        }
        this.yPos += 2;

        // Reset text color
        this.doc.setTextColor(0);

        // Divider line
        this.doc.setDrawColor(200);
        this.doc.line(this.leftMargin, this.yPos, this.rightMargin, this.yPos);
        this.yPos += 6;
    }

    renderSummary(summary) {
        if (!summary) return;

        this.doc.setFontSize(10);
        this.doc.setFont('times', 'bold');
        this.doc.text('PROFESSIONAL SUMMARY', this.leftMargin, this.yPos);
        this.yPos += 5;

        this.doc.setFontSize(9);
        this.doc.setFont('times', 'normal');
        const lines = this.doc.splitTextToSize(summary, this.rightMargin - this.leftMargin);
        this.doc.text(lines, this.leftMargin, this.yPos);
        this.yPos += lines.length * 4 + 6;
    }

    renderWorkExperience(work) {
        if (!work || work.length === 0) return;

        this.checkPageBreak(25);
        this.renderSectionHeader('PROFESSIONAL EXPERIENCE');

        work.forEach(job => {
            this.checkPageBreak(20);

            // Job title and company
            this.doc.setFontSize(10);
            this.doc.setFont('times', 'bold');
            this.doc.text(`${job.position}`, this.leftMargin, this.yPos);

            // Company name and dates on same line
            this.doc.setFont('times', 'normal');
            this.doc.setFontSize(9);
            const dateStr = `${this.formatDate(job.startDate)} - ${job.endDate ? this.formatDate(job.endDate) : 'Present'}`;
            this.doc.text(dateStr, this.rightMargin, this.yPos, { align: 'right' });
            this.yPos += 4;

            this.doc.setTextColor(80);
            this.doc.text(job.name, this.leftMargin, this.yPos);
            this.doc.setTextColor(0);
            this.yPos += 4;

            // Highlights as bullet points
            if (job.highlights && job.highlights.length > 0) {
                this.doc.setFontSize(8);
                job.highlights.forEach(highlight => {
                    this.checkPageBreak(8);
                    const bulletText = `• ${highlight}`;
                    const lines = this.doc.splitTextToSize(bulletText, this.rightMargin - this.leftMargin - 5);
                    this.doc.text(lines, this.leftMargin + 3, this.yPos);
                    this.yPos += lines.length * 3.5 + 0.5;
                });
            }
            this.yPos += 3;
        });
    }

    renderEducation(education) {
        if (!education || education.length === 0) return;

        this.checkPageBreak(20);
        this.renderSectionHeader('EDUCATION');

        education.forEach(edu => {
            this.checkPageBreak(12);

            this.doc.setFontSize(10);
            this.doc.setFont('times', 'bold');
            this.doc.text(edu.studyType || 'Degree', this.leftMargin, this.yPos);

            this.doc.setFont('times', 'normal');
            this.doc.setFontSize(9);
            const dateStr = `${this.formatDate(edu.startDate)} - ${edu.endDate ? this.formatDate(edu.endDate) : 'Present'}`;
            this.doc.text(dateStr, this.rightMargin, this.yPos, { align: 'right' });
            this.yPos += 4;

            this.doc.setTextColor(80);
            this.doc.text(edu.institution, this.leftMargin, this.yPos);
            this.doc.setTextColor(0);
            this.yPos += 4;

            this.doc.setFontSize(8);
            this.doc.text(`Major: ${edu.area}`, this.leftMargin + 3, this.yPos);
            this.yPos += 3.5;

            if (edu.additional) {
                const additionalLines = this.doc.splitTextToSize(edu.additional, this.rightMargin - this.leftMargin - 5);
                this.doc.text(additionalLines, this.leftMargin + 3, this.yPos);
                this.yPos += additionalLines.length * 3.5;
            }
            this.yPos += 3;
        });
    }

    renderSkills(skills) {
        if (!skills || skills.length === 0) return;

        this.checkPageBreak(15);
        this.renderSectionHeader('SKILLS & ABILITIES');

        this.doc.setFontSize(8);
        skills.forEach(skill => {
            this.checkPageBreak(6);
            this.doc.setFont('times', 'bold');
            const skillLabel = `${skill.name}: `;
            this.doc.text(skillLabel, this.leftMargin, this.yPos);

            const labelWidth = this.doc.getTextWidth(skillLabel);
            this.doc.setFont('times', 'normal');
            const keywords = skill.keywords ? skill.keywords.join(', ') : '';
            const keywordLines = this.doc.splitTextToSize(keywords, this.rightMargin - this.leftMargin - labelWidth);
            this.doc.text(keywordLines, this.leftMargin + labelWidth, this.yPos);
            this.yPos += keywordLines.length * 3.5 + 1;
        });
        this.yPos += 3;
    }

    renderCertificates(certificates) {
        if (!certificates || certificates.length === 0) return;

        this.checkPageBreak(15);
        this.renderSectionHeader('CERTIFICATIONS');

        this.doc.setFontSize(8);

        // Render in two columns
        const colWidth = (this.rightMargin - this.leftMargin) / 2;
        let col = 0;

        certificates.forEach((cert, index) => {
            const xPos = this.leftMargin + (col * colWidth);

            if (col === 0 && index > 0 && index % 2 === 0) {
                this.yPos += 8;
                this.checkPageBreak(10);
            }

            this.doc.setFont('times', 'bold');
            const certName = this.doc.splitTextToSize(cert.name, colWidth - 5);
            this.doc.text(certName, xPos, this.yPos);

            this.doc.setFont('times', 'normal');
            this.doc.setTextColor(80);
            this.doc.text(`${cert.issuer} | ${this.formatDate(cert.date)}`, xPos, this.yPos + (certName.length * 3.5));
            this.doc.setTextColor(0);

            col = (col + 1) % 2;
        });
        this.yPos += 12;
    }

    renderLanguages(languages) {
        if (!languages || languages.length === 0) return;

        this.checkPageBreak(10);
        this.renderSectionHeader('LANGUAGES');

        this.doc.setFontSize(9);
        this.doc.setFont('times', 'normal');
        const langStrings = languages.map(lang => `${lang.language} (${lang.fluency})`);
        this.doc.text(langStrings.join('  |  '), this.leftMargin, this.yPos);
        this.yPos += 8;
    }

    renderAwards(awards) {
        if (!awards || awards.length === 0) return;

        this.checkPageBreak(12);
        this.renderSectionHeader('AWARDS');

        this.doc.setFontSize(8);
        awards.forEach(award => {
            this.checkPageBreak(8);
            this.doc.setFont('times', 'bold');
            this.doc.text(award.title, this.leftMargin, this.yPos);

            this.doc.setFont('times', 'normal');
            if (award.date) {
                this.doc.text(this.formatDate(award.date), this.rightMargin, this.yPos, { align: 'right' });
            }
            this.yPos += 3.5;

            this.doc.setTextColor(80);
            this.doc.text(`${award.awarder}`, this.leftMargin, this.yPos);
            this.doc.setTextColor(0);
            this.yPos += 3.5;

            if (award.summary) {
                const summaryLines = this.doc.splitTextToSize(award.summary, this.rightMargin - this.leftMargin);
                this.doc.text(summaryLines, this.leftMargin, this.yPos);
                this.yPos += summaryLines.length * 3.5;
            }
            this.yPos += 2;
        });
    }

    renderSectionHeader(title) {
        this.doc.setFontSize(10);
        this.doc.setFont('times', 'bold');
        this.doc.setTextColor(40, 80, 120);
        this.doc.text(title, this.leftMargin, this.yPos);
        this.doc.setTextColor(0);
        this.yPos += 1.5;

        // Underline
        this.doc.setDrawColor(40, 80, 120);
        this.doc.setLineWidth(0.5);
        this.doc.line(this.leftMargin, this.yPos, this.rightMargin, this.yPos);
        this.doc.setLineWidth(0.2);
        this.doc.setDrawColor(0);
        this.yPos += 5;
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    }
}

const pdfGenerator = new PDFGenerator();
