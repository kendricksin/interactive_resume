// Load resume data from JSON file
async function loadResumeData() {
    try {
        const response = await fetch('src/resume.json');
        return await response.json();
    } catch (error) {
        console.error('Error loading resume data:', error);
        // Fallback data if JSON fails to load
        return {
            basics: {
                name: "Your Name",
                label: "Professional Title",
                summary: "Default summary text - update your resume.json file",
                email: "email@example.com",
                phone: "(555) 123-4567",
                url: "https://example.com",
                location: { city: "City", region: "Region" },
                profiles: []
            },
            work: [],
            education: [],
            skills: [],
            projects: [],
            awards: [],
            interests: [],
            certificates: []
        };
    }
}
