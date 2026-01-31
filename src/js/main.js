document.addEventListener('DOMContentLoaded', async function() {
    try {
        const resumeData = await loadResumeData();
        
        // Render all sections
        renderProfile(resumeData.basics);
        renderWorkExperience(resumeData.work);
        renderEducation(resumeData.education);
        renderSkills(resumeData.skills);
        renderProjects(resumeData.projects);
        renderInterests(resumeData.interests);
        renderAwards(resumeData.awards);
        renderCertificates(resumeData.certificates);
        renderLanguages(resumeData.languages);
        
        // Initialize theme manager
        themeManager.initializeToggle();
        
        // Initialize PDF download
        initializePDFDownload();
        
        // Initialize animations
        animationManager.initAnimations();
        
    } catch (error) {
        console.error('Failed to render resume:', error);
    }
});
