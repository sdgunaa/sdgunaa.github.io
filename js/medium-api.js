document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Configuration: Replace 'sdgunaa' with your Medium username
    const mediumUsername = 'sdgunaa';
    const postsToShow = 3;
    const postsContainer = document.getElementById('medium-posts');
    const loadingElement = document.getElementById('loading-posts');

    // Initialize integration
    function initMediumIntegration() {
      if (!postsContainer) {
        console.error("Element with id 'medium-posts' not found.");
        return;
      }
      fetchMediumPosts();
    }

    // Fetch Medium posts using rss2json API
    function fetchMediumPosts() {
      const feedUrl = `https://medium.com/feed/@${mediumUsername}`;
      const rssUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;

      fetch(rssUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          if (data.status === 'ok') {
            displayPosts(data.items);
          } else {
            throw new Error('Failed to get RSS feed');
          }
        })
        .catch(error => {
          console.error('Error fetching Medium posts:', error);
          displayError(error.message);
        });
    }

    // Display posts in the DOM
    function displayPosts(posts) {
      if (loadingElement) {
        loadingElement.style.display = 'none';
      }
      if (!postsContainer) return;

      // Filter posts (adjust filtering logic if needed)
      const articles = posts.filter(post => Array.isArray(post.categories) && post.categories.length > 0);
      const postsToDisplay = articles.slice(0, postsToShow);

      if (postsToDisplay.length === 0) {
        displayError('No posts found.');
        return;
      }

      postsToDisplay.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'col-md-6 col-lg-4 mb-4';

        // Extract first image from post content
        const imgElement = extractImageFromContent(post.content);
        const imgSrc = imgElement ? imgElement.src : '';

        // Format the publish date
        const publishDate = new Date(post.pubDate);
        const formattedDate = `${publishDate.toLocaleString('default', { month: 'long' })} ${publishDate.getDate()}, ${publishDate.getFullYear()}`;

        // Create an excerpt (strip HTML and limit length)
        const plainText = post.content.replace(/<[^>]+>/g, '');
        const excerpt = plainText.substring(0, 120) + '...';

        // Build the card HTML
        postElement.innerHTML = `
          <div class="blog-card">
            <div class="blog-image">
              ${imgSrc ? `<img src="${imgSrc}" alt="${post.title}">` : `
                <div class="blog-placeholder">
                  <i class="fas fa-newspaper"></i>
                </div>`}
            </div>
            <div class="blog-body">
              <p class="blog-date">${formattedDate}</p>
              <h3><a href="${post.link}" target="_blank" rel="noopener">${post.title}</a></h3>
              <p>${excerpt}</p>
              <a href="${post.link}" target="_blank" class="btn btn-sm btn-outline-primary">Read More</a>
            </div>
          </div>
        `;
        postsContainer.appendChild(postElement);
      });
    }

    // Extract the first image from HTML content
    function extractImageFromContent(content) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      return doc.querySelector('img');
    }

    // Display an error message in the DOM
    function displayError(message = 'Failed to load blog posts.') {
      if (loadingElement) {
        loadingElement.style.display = 'none';
      }
      if (!postsContainer) return;
      const errorElement = document.createElement('div');
      errorElement.className = 'col-12 text-center';
      errorElement.innerHTML = `
        <div class="alert alert-warning" role="alert">
          <i class="fas fa-exclamation-triangle me-2"></i>
          ${message}
        </div>
        <p>Visit <a href="https://medium.com/@${mediumUsername}" target="_blank">Medium</a> to read all articles.</p>
      `;
      postsContainer.appendChild(errorElement);
    }

    // Start the integration
    initMediumIntegration();
  });