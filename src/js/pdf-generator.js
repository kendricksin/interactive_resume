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

        // 1. Set PDF metadata for machine readability
        const basics = resumeData.basics;
        const skillKeywords = (resumeData.skills || []).flatMap(s => s.keywords || []);
        this.doc.setProperties({
            title: `${basics.name} - Resume`,
            subject: basics.label || '',
            author: basics.name,
            keywords: skillKeywords.join(', '),
            creator: 'Interactive Resume Generator'
        });

        // Generate each section
        this.renderHeader(resumeData.basics);
        this.renderSummary(resumeData.basics.summary);
        this.renderWorkExperience(resumeData.work);
        this.renderEducation(resumeData.education);
        this.renderSkills(resumeData.skills);
        this.renderCertificates(resumeData.certificates);
        this.renderLanguages(resumeData.languages);
        this.renderAwards(resumeData.awards);
        this.renderProjects(resumeData.projects);
        this.renderTechStack(resumeData.techStack);

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

        // Contact info line with clickable email
        this.doc.setFontSize(9);
        this.doc.setTextColor(60);
        const contactItems = [];
        if (basics.email) contactItems.push({ text: basics.email, url: `mailto:${basics.email}` });
        if (basics.phone) contactItems.push({ text: basics.phone });
        if (basics.location?.city) contactItems.push({ text: basics.location.city });

        const separator = '  |  ';
        const fullContactText = contactItems.map(c => c.text).join(separator);
        const contactTotalWidth = this.doc.getTextWidth(fullContactText);
        let contactX = 105 - contactTotalWidth / 2;

        contactItems.forEach((item, i) => {
            if (item.url) {
                this.doc.setTextColor(40, 80, 120);
                this.doc.textWithLink(item.text, contactX, this.yPos, { url: item.url });
                this.doc.setTextColor(60);
            } else {
                this.doc.text(item.text, contactX, this.yPos);
            }
            contactX += this.doc.getTextWidth(item.text);
            if (i < contactItems.length - 1) {
                this.doc.text(separator, contactX, this.yPos);
                contactX += this.doc.getTextWidth(separator);
            }
        });
        this.yPos += 4;

        // Social profiles line with clickable links
        if (basics.profiles && basics.profiles.length > 0) {
            this.doc.setFontSize(9);
            const separator = '  |  ';
            const parts = basics.profiles.map(p => ({ label: `${p.network}: ${p.url}`, url: p.url }));
            const totalText = parts.map(p => p.label).join(separator);
            const totalWidth = this.doc.getTextWidth(totalText);
            let xPos = 105 - totalWidth / 2;

            parts.forEach((part, i) => {
                this.doc.setTextColor(40, 80, 120);
                this.doc.textWithLink(part.label, xPos, this.yPos, { url: part.url });
                xPos += this.doc.getTextWidth(part.label);
                if (i < parts.length - 1) {
                    this.doc.setTextColor(60);
                    this.doc.text(separator, xPos, this.yPos);
                    xPos += this.doc.getTextWidth(separator);
                }
            });
            this.yPos += 4;
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
            if (cert.url) {
                this.doc.setTextColor(40, 80, 120);
                this.doc.textWithLink(certName[0], xPos, this.yPos, { url: cert.url });
                // Render remaining lines if name wraps
                for (let i = 1; i < certName.length; i++) {
                    this.doc.textWithLink(certName[i], xPos, this.yPos + (i * 3.5), { url: cert.url });
                }
                this.doc.setTextColor(0);
            } else {
                this.doc.text(certName, xPos, this.yPos);
            }

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

    renderProjects(projects) {
        if (!projects || projects.length === 0) return;

        this.checkPageBreak(15);
        this.renderSectionHeader('PROJECTS');

        this.doc.setFontSize(8);
        projects.forEach(project => {
            this.checkPageBreak(12);

            this.doc.setFont('times', 'bold');
            if (project.url) {
                this.doc.setTextColor(40, 80, 120);
                this.doc.textWithLink(project.name, this.leftMargin, this.yPos, { url: project.url });
                this.doc.setTextColor(0);
            } else {
                this.doc.text(project.name, this.leftMargin, this.yPos);
            }

            if (project.startDate) {
                this.doc.setFont('times', 'normal');
                this.doc.text(this.formatDate(project.startDate), this.rightMargin, this.yPos, { align: 'right' });
            }
            this.yPos += 3.5;

            if (project.summary) {
                this.doc.setFont('times', 'normal');
                const summaryLines = this.doc.splitTextToSize(project.summary, this.rightMargin - this.leftMargin - 5);
                this.doc.text(summaryLines, this.leftMargin + 3, this.yPos);
                this.yPos += summaryLines.length * 3.5;
            }
            this.yPos += 2;
        });
    }

    renderTechStack(techStack) {
        if (!techStack || !techStack.categories) return;

        this.checkPageBreak(20);
        this.renderSectionHeader('TECH STACK');

        // Description
        if (techStack.description) {
            this.doc.setFontSize(8);
            this.doc.setFont('times', 'italic');
            this.doc.setTextColor(80);
            const descLines = this.doc.splitTextToSize(techStack.description, this.rightMargin - this.leftMargin);
            this.doc.text(descLines, this.leftMargin, this.yPos);
            this.doc.setTextColor(0);
            this.yPos += descLines.length * 3.5 + 2;
        }

        const totalWidth = this.rightMargin - this.leftMargin;
        const barHeight = 3;
        const barMaxWidth = 50;
        const scoreWidth = 12;
        const nameWidth = totalWidth - barMaxWidth - scoreWidth - 4;

        techStack.categories.forEach(category => {
            this.checkPageBreak(10 + category.items.length * 5);

            this.doc.setFontSize(9);
            this.doc.setFont('times', 'bold');
            this.doc.text(category.name, this.leftMargin, this.yPos);
            this.yPos += 4;

            this.doc.setFontSize(7);
            this.doc.setFont('times', 'normal');

            category.items.forEach(item => {
                this.checkPageBreak(6);

                // Name
                const truncatedName = this.doc.splitTextToSize(item.name, nameWidth)[0];
                this.doc.text(truncatedName, this.leftMargin, this.yPos);

                // Bar background
                const barX = this.leftMargin + nameWidth + 2;
                const barY = this.yPos - 2.5;
                this.doc.setFillColor(220, 220, 220);
                this.doc.roundedRect(barX, barY, barMaxWidth, barHeight, 1, 1, 'F');

                // Bar fill
                const fillWidth = (item.score / 10) * barMaxWidth;
                this.doc.setFillColor(40, 80, 120);
                this.doc.roundedRect(barX, barY, fillWidth, barHeight, 1, 1, 'F');

                // Score
                this.doc.text(`${item.score}/10`, barX + barMaxWidth + 2, this.yPos);

                this.yPos += 4.5;
            });

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
