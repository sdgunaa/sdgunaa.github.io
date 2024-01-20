window.addEventListener("load", function() {
    const images = ['image1', 'image2', 'image3', 'image4', 'image5', 'image6', 'image7', 'image0' ];
    let index = 0;

    function changeBackground() {
        document.body.className = images[index];
        index = (index + 1) % images.length;
    }

    setInterval(changeBackground, 10000);
});
