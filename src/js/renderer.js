function renderProfile(basics) {
    document.getElementById('full-name').textContent = basics.name || 'Name Not Available';
    document.getElementById('job-title').textContent = basics.label || '';
    document.getElementById('summary').textContent = basics.summary || '';
    
    // Render contact info
    if (basics.location?.city && basics.location?.region) {
        document.getElementById('location').textContent = `${basics.location.city}, ${basics.location.region}`;
    }
    
    if (basics.email) {
        const emailLink = document.getElementById('email-link');
        emailLink.textContent = basics.email;
        emailLink.href = `mailto:${basics.email}`;
    }
    
    if (basics.phone) {
        const phoneLink = document.getElementById('phone-link');
        phoneLink.textContent = basics.phone;
        phoneLink.href = `tel:${basics.phone}`;
    }
    
    if (basics.url) {
        const websiteLink = document.getElementById('website-link');
        websiteLink.textContent = basics.url;
        websiteLink.href = basics.url;
    }

    // Render social profiles
    renderSocialProfiles(basics.profiles);
}

function renderSocialProfiles(profiles) {
    const container = document.getElementById('social-profiles');
    if (!container || !profiles || profiles.length === 0) return;

    container.innerHTML = '';

    profiles.forEach(profile => {
        const link = document.createElement('a');
        link.href = profile.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = `social-link social-${profile.network.toLowerCase()}`;

        // Add icon based on network
        const icon = getNetworkIcon(profile.network);
        link.innerHTML = `${icon}<span>${profile.network}</span>`;

        container.appendChild(link);
    });
}

function getNetworkIcon(network) {
    const icons = {
        'LinkedIn': `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>`,
        'GitHub': `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
        </svg>`,
        'Twitter': `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>`
    };
    return icons[network] || `<span class="social-icon-text">${network[0]}</span>`;
}

function renderWorkExperience(work) {
    const container = document.getElementById('work-experience');
    container.innerHTML = '';
    
    work.forEach(job => {
        const jobElement = document.createElement('div');
        jobElement.className = 'work-item';
        jobElement.innerHTML = `
            <h3>${job.position} - ${job.name}</h3>
            <div class="dates">${formatDate(job.startDate)} - ${job.endDate ? formatDate(job.endDate) : 'Present'}</div>
            <p>${job.summary || ''}</p>
            <ul>
                ${(job.highlights || []).map(highlight => `<li>${highlight}</li>`).join('')}
            </ul>
        `;
        container.appendChild(jobElement);
    });
}

function renderEducation(education) {
    const container = document.getElementById('education-list');
    container.innerHTML = '';

    education.forEach(edu => {
        const eduElement = document.createElement('div');
        eduElement.className = 'education-item';
        const endDateText = edu.endDate ? formatDate(edu.endDate) : 'Present';
        eduElement.innerHTML = `
            <h3>${edu.studyType || ''} - ${edu.institution}</h3>
            <div class="dates">${formatDate(edu.startDate)} - ${endDateText}</div>
            <p><strong>Major:</strong> ${edu.area}</p>
            ${edu.gpa ? `<p><strong>GPA:</strong> ${edu.gpa}</p>` : ''}
            ${edu.additional ? `<p><strong>Additional:</strong> ${edu.additional}</p>` : ''}
        `;
        container.appendChild(eduElement);
    });
}

function renderSkills(skills) {
    const container = document.getElementById('skills-container');
    container.innerHTML = '';
    
    skills.forEach(skill => {
        const skillElement = document.createElement('div');
        skillElement.className = 'skill-category';
        skillElement.innerHTML = `
            <span class="skill-name">${skill.name}</span>
            <span class="skill-level">(${skill.level})</span>
            <div class="skill-keywords">
                ${(skill.keywords || []).map(keyword => `<span>${keyword}</span>`).join('')}
            </div>
        `;
        container.appendChild(skillElement);
    });
}

function renderProjects(projects) {
    const container = document.getElementById('projects-list');
    container.innerHTML = '';
    
    projects.forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.className = 'project-item';
        projectElement.innerHTML = `
            <h3><a href="${project.url || '#'}" target="_blank">${project.name}</a></h3>
            <div class="dates">${formatDate(project.startDate)} - ${project.endDate ? formatDate(project.endDate) : 'Present'}</div>
            <p>${project.summary || ''}</p>
            <ul>
                ${(project.highlights || []).map(highlight => `<li>${highlight}</li>`).join('')}
            </ul>
        `;
        container.appendChild(projectElement);
    });
}

function renderInterests(interests) {
    const container = document.getElementById('interests-list');
    container.innerHTML = '';
    
    interests.forEach(interest => {
        const interestElement = document.createElement('div');
        interestElement.className = 'interest-item';
        interestElement.innerHTML = `
            <h4>${interest.name}</h4>
            <div class="skill-keywords">
                ${(interest.keywords || []).map(keyword => `<span>${keyword}</span>`).join('')}
            </div>
        `;
        container.appendChild(interestElement);
    });
}

function renderAwards(awards) {
    const container = document.getElementById('awards-list');
    container.innerHTML = '';

    awards.forEach(award => {
        const awardElement = document.createElement('div');
        awardElement.className = 'award-item';
        awardElement.innerHTML = `
            <h4>${award.title}</h4>
            <p><strong>${award.awarder}</strong>${award.date ? ` - ${formatDate(award.date)}` : ''}</p>
            <p>${award.summary || ''}</p>
        `;
        container.appendChild(awardElement);
    });
}

function renderCertificates(certificates) {
    const container = document.getElementById('certificates-list');
    if (!container) return;
    container.innerHTML = '';

    certificates.forEach(cert => {
        const certElement = document.createElement('div');
        certElement.className = 'certificate-item';
        certElement.innerHTML = `
            <div class="cert-row">
                <span class="cert-name">${cert.name}</span>
                <span class="cert-date">${formatDate(cert.date)}</span>
            </div>
            <div class="cert-issuer">${cert.issuer}</div>
        `;
        container.appendChild(certElement);
    });
}

function renderLanguages(languages) {
    const container = document.getElementById('languages-list');
    if (!container) return;
    container.innerHTML = '';

    languages.forEach(lang => {
        const langElement = document.createElement('div');
        langElement.className = 'language-item';
        langElement.innerHTML = `
            <span class="lang-name">${lang.language}</span>
            <span class="lang-fluency">(${lang.fluency})</span>
        `;
        container.appendChild(langElement);
    });
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

async function initializePDFDownload() {
    const downloadButton = document.getElementById('pdf-download');
    if (downloadButton) {
        downloadButton.addEventListener('click', async () => {
            // Show loading state
            const originalText = downloadButton.textContent;
            downloadButton.textContent = 'Generating...';
            downloadButton.disabled = true;

            try {
                // Load resume data and generate PDF
                const resumeData = await loadResumeData();
                await pdfGenerator.generatePDF(resumeData);
            } catch (error) {
                console.error('Error generating PDF:', error);
                alert('Failed to generate PDF. Please try again.');
            } finally {
                // Restore button state
                downloadButton.textContent = originalText;
                downloadButton.disabled = false;
            }
        });
    }
}
