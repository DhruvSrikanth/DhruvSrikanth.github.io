// Get the page parameter from URL
const urlParams = new URLSearchParams(window.location.search);
const pageParam = urlParams.get('page');

// Define content paths
const contentPaths = {
    'index': '../content/index.html',
    'open_source': '../content/open_source.html',
    'research_journal': '../content/research_journal.html',
    'what_and_why': '../content/journal/what_and_why.html'
};

// Update page title based on page parameter
document.title = pageParam ? 
    pageParam.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') 
    : 'Home';

// Fix relative paths based on page location
const fixPaths = () => {
    // Update icon path
    const iconLink = document.querySelector('link[rel="icon"]');
    if (iconLink) {
        iconLink.href = iconLink.href.replace('/assets/', '../assets/');
    }
    
    // Update navigation links
    document.querySelectorAll('.top-nav a').forEach(link => {
        if (link.href.startsWith(window.location.origin)) {
            // Convert each page link to use the template system
            if (link.href.includes('index.html')) {
                link.href = link.href.replace('index.html', 'templates/base.html?page=index');
            } else if (link.href.includes('open_source.html')) {
                link.href = link.href.replace('open_source.html', 'templates/base.html?page=open_source');
            } else if (link.href.includes('research_journal.html')) {
                link.href = link.href.replace('research_journal.html', 'templates/base.html?page=research_journal');
            }
        }
    });
};

// Load and inject the page content
async function loadContent() {
    if (!pageParam || !contentPaths[pageParam]) {
        console.error('Invalid page parameter');
        return;
    }

    try {
        // Create a temporary container
        const temp = document.createElement('div');
        
        // Fetch the content HTML
        const response = await fetch(contentPaths[pageParam]);
        const html = await response.text();
        
        // Parse the HTML
        temp.innerHTML = html;
        
        // Find the main content
        let content;
        if (pageParam === 'index') {
            content = temp.querySelector('.intro');
        } else if (pageParam === 'open_source') {
            content = temp.querySelector('.project');
        } else if (pageParam === 'research_journal') {
            content = temp.querySelector('.topics');
        } else if (pageParam === 'what_and_why') {
            content = temp.querySelector('.recipe');
        }
        
        // Inject the content
        if (content) {
            document.getElementById('content').innerHTML = content.outerHTML;
            
            // Fix image paths after content is loaded
            document.querySelectorAll('img').forEach(img => {
                if (img.src.includes('assets/')) {
                    img.src = img.src.replace('assets/', '../assets/');
                }
            });
        } else {
            console.error('Could not find content to inject');
        }

        // Fix paths after content is loaded
        fixPaths();
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

// Load the content when the page loads
document.addEventListener('DOMContentLoaded', loadContent);
