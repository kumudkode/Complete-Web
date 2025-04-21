const fileInput = document.getElementById('fileInput');
const dropZone = document.querySelector('.drop-zone');
const previewImage = document.getElementById('previewImage');
const imageContainer = document.querySelector('.image-container');
const toast = document.getElementById('toast');
const loading = document.querySelector('.loading');
const cropOverlay = document.querySelector('.crop-overlay');

// History for undo/redo functionality
const history = {
    states: [],
    currentIndex: -1,
    maxStates: 10
};

const adjustments = {
    brightness: 0,
    contrast: 0,
    saturation: 0,
    exposure: 0,
    highlights: 0,
    shadows: 0,
    temperature: 0,
    tint: 0,
    sharpness: 0,
    vignette: 0,
    rotate: 0,
    flipH: 1,
    flipV: 1
};

// File Upload Handling
dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) loadImage(file);
});

fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) loadImage(file);
});

function loadImage(file) {
    showLoading();
    
    // Check file size
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
        showToast("File is too large. Please choose an image under 10MB.");
        hideLoading();
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        // Create an image object to check dimensions
        const img = new Image();
        img.onload = () => {
            previewImage.src = e.target.result;
            imageContainer.classList.add('loaded');
            
            // Save initial state for undo/redo
            saveState();
            hideLoading();
        };
        img.onerror = () => {
            showToast("Error loading image. Please try another file.");
            hideLoading();
        };
        img.src = e.target.result;
    };
    reader.onerror = () => {
        showToast("Error reading file. Please try again.");
        hideLoading();
    };
    reader.readAsDataURL(file);
}

// Adjustments
document.querySelectorAll('input[type="range"]').forEach(slider => {
    slider.addEventListener('input', () => {
        adjustments[slider.id] = parseInt(slider.value);
        applyFilter();
    });
    
    slider.addEventListener('change', () => {
        saveState();
    });
});

// Filters
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
        // First, remove any active filter classes
        document.querySelectorAll('.filter-btn').forEach(btn => {
            if (btn !== button && btn.classList.contains('active')) {
                previewImage.classList.remove(btn.dataset.filter);
                btn.classList.remove('active');
            }
        });
        
        // Toggle the clicked filter
        const wasActive = button.classList.contains('active');
        previewImage.classList.toggle(button.dataset.filter);
        button.classList.toggle('active');
        
        // Important: Clear any inline filter style when adding a filter class
        // Only keep shadows/highlights if needed
        if (!wasActive && button.classList.contains('active')) {
            // If we're activating a filter, clear the inline filter (except shadows/highlights)
            previewImage.style.filter = '';
        }
        
        // Then reapply adjustments by calling applyFilter
        applyFilter();
        
        saveState();
    });
});

// Enhanced Filter Application Animation
document.querySelectorAll('.filter-btn').forEach(button => {
    const originalClick = button.onclick;
    button.onclick = function(e) {
        // Add a ripple effect
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        
        const size = Math.max(this.offsetWidth, this.offsetHeight);
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        // Animate the image when applying filters
        if (previewImage.src) {
            previewImage.classList.add('filter-applied');
            setTimeout(() => previewImage.classList.remove('filter-applied'), 300);
        }
        
        setTimeout(() => ripple.remove(), 600);
    };
});

// Enhanced Transform Functions

// Create transform notification element
const transformNotification = document.createElement('div');
transformNotification.className = 'transform-notification';
imageContainer.appendChild(transformNotification);

// Create rotate slider for fine rotation control
const rotateSlider = document.createElement('div');
rotateSlider.className = 'rotate-slider';
rotateSlider.innerHTML = `
    <div class="angle-display">0°</div>
    <input type="range" min="-45" max="45" value="0" id="fine-rotation">
`;
imageContainer.appendChild(rotateSlider);

// Show transform notification
function showTransformNotification(message) {
    transformNotification.textContent = message;
    transformNotification.classList.add('show');
    
    setTimeout(() => {
        transformNotification.classList.remove('show');
    }, 1500);
}

// Enhanced transform button interactions
document.getElementById('rotate-left').addEventListener('click', function() {
    // Remove any existing handlers
    this.removeEventListener('click', arguments.callee);
    
    showTransformNotification('Rotated Left');
    previewImage.classList.add('image-transform-effect');
    
    adjustments.rotate -= 90;
    applyTransform();
    saveState();
    
    setTimeout(() => {
        previewImage.classList.remove('image-transform-effect');
    }, 500);
    
    // Re-add the listener
    this.addEventListener('click', arguments.callee);
});

document.getElementById('rotate-right').addEventListener('click', function() {
    // Remove any existing handlers
    this.removeEventListener('click', arguments.callee);
    
    showTransformNotification('Rotated Right');
    previewImage.classList.add('image-transform-effect');
    
    adjustments.rotate += 90;
    applyTransform();
    saveState();
    
    setTimeout(() => {
        previewImage.classList.remove('image-transform-effect');
    }, 500);
    
    // Re-add the listener
    this.addEventListener('click', arguments.callee);
});

document.getElementById('flip-h').addEventListener('click', function() {
    // Remove any existing handlers
    this.removeEventListener('click', arguments.callee);
    
    showTransformNotification('Flipped Horizontally');
    previewImage.classList.add('image-transform-effect');
    
    adjustments.flipH *= -1;
    applyTransform();
    saveState();
    
    setTimeout(() => {
        previewImage.classList.remove('image-transform-effect');
    }, 500);
    
    // Re-add the listener
    this.addEventListener('click', arguments.callee);
});

document.getElementById('flip-v').addEventListener('click', function() {
    // Remove any existing handlers
    this.removeEventListener('click', arguments.callee);
    
    showTransformNotification('Flipped Vertically');
    previewImage.classList.add('image-transform-effect');
    
    adjustments.flipV *= -1;
    applyTransform();
    saveState();
    
    setTimeout(() => {
        previewImage.classList.remove('image-transform-effect');
    }, 500);
    
    // Re-add the listener
    this.addEventListener('click', arguments.callee);
});

// Apply Transform Function
function applyTransform() {
    // Ensure rotate is a number
    const rotateAngle = Number(adjustments.rotate) || 0;
    const flipH = Number(adjustments.flipH) || 1;
    const flipV = Number(adjustments.flipV) || 1;
    
    // Apply the transform directly to the preview image
    previewImage.style.transform = `rotate(${rotateAngle}deg) scaleX(${flipH}) scaleY(${flipV})`;
    
    // Log current transform state (for debugging)
    console.log(`Applied transform: rotate=${rotateAngle}deg, flipH=${flipH}, flipV=${flipV}`);
}

// Crop functionality
const cropBtn = document.getElementById('crop');
const applyCropBtn = document.getElementById('apply-crop');
const cancelCropBtn = document.getElementById('cancel-crop');
const cropArea = document.querySelector('.crop-area');

cropBtn.addEventListener('click', initCrop);
applyCropBtn.addEventListener('click', applyCrop);
cancelCropBtn.addEventListener('click', cancelCrop);

function initCrop() {
    // Make sure crop overlay and crop area exist
    if (!cropOverlay || !document.querySelector('.crop-area')) {
        // Create crop area if it doesn't exist
        if (!document.querySelector('.crop-area')) {
            const cropAreaElement = document.createElement('div');
            cropAreaElement.className = 'crop-area';
            cropOverlay.appendChild(cropAreaElement);
        }
        
        // Create crop controls if they don't exist
        if (!document.querySelector('.crop-controls')) {
            const cropControls = document.createElement('div');
            cropControls.className = 'crop-controls';
            cropControls.innerHTML = `
                <button id="apply-crop">Apply</button>
                <button id="cancel-crop">Cancel</button>
            `;
            cropOverlay.appendChild(cropControls);
            
            // Add event listeners to the new buttons
            document.getElementById('apply-crop').addEventListener('click', applyCrop);
            document.getElementById('cancel-crop').addEventListener('click', cancelCrop);
        }
    }
    
    // Show crop overlay
    cropOverlay.style.display = 'block';
    
    // Get references to elements
    const cropArea = document.querySelector('.crop-area');
    
    // Initialize crop area at 80% of image size
    const imgRect = previewImage.getBoundingClientRect();
    const containerRect = imageContainer.getBoundingClientRect();
    
    const cropWidth = imgRect.width * 0.8;
    const cropHeight = imgRect.height * 0.8;
    
    cropArea.style.width = `${cropWidth}px`;
    cropArea.style.height = `${cropHeight}px`;
    cropArea.style.left = `${(containerRect.width - cropWidth) / 2}px`;
    cropArea.style.top = `${(containerRect.height - cropHeight) / 2}px`;
    
    // Setup crop area dragging
    let isDragging = false;
    let startX, startY;
    
    cropArea.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - cropArea.getBoundingClientRect().left;
        startY = e.clientY - cropArea.getBoundingClientRect().top;
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const left = e.clientX - startX;
        const top = e.clientY - startY;
        
        // Constrain to image container
        cropArea.style.left = `${Math.max(0, Math.min(containerRect.width - cropArea.offsetWidth, left))}px`;
        cropArea.style.top = `${Math.max(0, Math.min(containerRect.height - cropArea.offsetHeight, top))}px`;
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    // Add aspect ratio buttons if not already present
    if (!document.querySelector('.aspect-ratio-controls')) {
        const aspectRatioControls = document.createElement('div');
        aspectRatioControls.className = 'aspect-ratio-controls';
        aspectRatioControls.innerHTML = `
            <button data-ratio="free" class="aspect-ratio-btn active">Free</button>
            <button data-ratio="1:1" class="aspect-ratio-btn">Square</button>
            <button data-ratio="4:3" class="aspect-ratio-btn">4:3</button>
            <button data-ratio="16:9" class="aspect-ratio-btn">16:9</button>
            <button data-ratio="3:4" class="aspect-ratio-btn">3:4</button>
        `;
        cropOverlay.appendChild(aspectRatioControls);
        
        // Add event listeners to aspect ratio buttons
        aspectRatioControls.querySelectorAll('.aspect-ratio-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                aspectRatioControls.querySelectorAll('.aspect-ratio-btn').forEach(b => {
                    b.classList.remove('active');
                });
                
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Apply aspect ratio
                const ratio = btn.dataset.ratio;
                if (ratio === 'free') return; // Free form, do nothing
                
                // Parse ratio values
                const [widthRatio, heightRatio] = ratio.split(':').map(Number);
                
                // Calculate new dimensions based on aspect ratio
                const imgRect = previewImage.getBoundingClientRect();
                const maxWidth = imgRect.width * 0.9;
                const maxHeight = imgRect.height * 0.9;
                
                let newWidth, newHeight;
                
                // Calculate dimensions based on the container constraints
                if (maxWidth / maxHeight > widthRatio / heightRatio) {
                    // Container is wider than the ratio
                    newHeight = maxHeight;
                    newWidth = (newHeight * widthRatio) / heightRatio;
                } else {
                    // Container is taller than the ratio
                    newWidth = maxWidth;
                    newHeight = (newWidth * heightRatio) / widthRatio;
                }
                
                // Apply new dimensions
                cropArea.style.width = `${newWidth}px`;
                cropArea.style.height = `${newHeight}px`;
                
                // Center the crop area
                const containerRect = imageContainer.getBoundingClientRect();
                cropArea.style.left = `${(containerRect.width - newWidth) / 2}px`;
                cropArea.style.top = `${(containerRect.height - newHeight) / 2}px`;
            });
        });
    }
    
    // Create resize handles if not already present
    if (!cropArea.querySelector('.crop-handle')) {
        const positions = ['nw', 'ne', 'se', 'sw'];
        positions.forEach(pos => {
            const handle = document.createElement('div');
            handle.className = `crop-handle ${pos}`;
            handle.dataset.position = pos;
            
            // Position handles
            if (pos.includes('n')) handle.style.top = '-10px';
            if (pos.includes('s')) handle.style.bottom = '-10px';
            if (pos.includes('w')) handle.style.left = '-10px';
            if (pos.includes('e')) handle.style.right = '-10px';
            
            cropArea.appendChild(handle);
        });
    }
}

// Apply Filter Function
function applyFilter() {
    const brightness = (adjustments.brightness / 100) + 1;
    const contrast = (adjustments.contrast / 100) + 1;
    const saturation = (adjustments.saturation / 100) + 1;
    const exposure = (adjustments.exposure / 100) + 1;
    
    // Calculate shadows and highlights effects
    const shadowEffect = adjustments.shadows / 100;
    const highlightEffect = adjustments.highlights / 100;
    
    // Calculate temperature and tint
    const tempColor = adjustments.temperature > 0 
        ? `rgba(255,${255 - adjustments.temperature * 2},${255 - adjustments.temperature * 2},0.1)`
        : `rgba(${255 + adjustments.temperature * 2},${255 + adjustments.temperature * 2},255,0.1)`;
    
    const tintColor = adjustments.tint > 0
        ? `rgba(${255 - adjustments.tint * 2},255,${255 - adjustments.tint * 2},0.1)`
        : `rgba(${255 + adjustments.tint * 2},255,${255 + adjustments.tint * 2},0.1)`;
    
    // Create vignette effect if needed
    let vignetteEffect = '';
    if (adjustments.vignette > 0) {
        const vignetteStrength = adjustments.vignette / 100;
        vignetteEffect = `radial-gradient(circle, transparent ${80 - vignetteStrength * 40}%, rgba(0,0,0,${vignetteStrength * 0.8}) 100%)`;
    }
    
    // Apply sharpness using SVG filter
    let sharpnessFilter = '';
    if (adjustments.sharpness > 0) {
        const sharpAmount = adjustments.sharpness / 20; // Scale down for better control
        sharpnessFilter = `contrast(${1 + sharpAmount})`;
    }

    // Apply all adjustments as filter
    const adjustmentFilters = `
        brightness(${brightness})
        contrast(${contrast})
        saturate(${saturation})
        brightness(${exposure})
        ${sharpnessFilter}
    `.trim();
    
    // Get active filter class if any
    const activeFilterBtn = document.querySelector('.filter-btn.active');
    
    // Apply filter based on whether a preset filter is active
    if (!activeFilterBtn) {
        // No preset filter active, apply adjustments directly
        previewImage.style.filter = adjustmentFilters;
    } else {
        // Here's the critical fix: DON'T set the filter property at all
        // Let the CSS class handle the base filter
        // We only store our adjustments for reference
        previewImage.dataset.adjustmentFilters = adjustmentFilters;
    }
    
    // Apply shadow and highlight effects - these should be applied regardless
    // But we need to do it differently for class vs non-class filters
    if (shadowEffect > 0 || highlightEffect > 0) {
        const shadowHighlightFilter = `drop-shadow(0 0 5px rgba(0,0,0,${shadowEffect})) drop-shadow(0 0 5px rgba(255,255,255,${highlightEffect}))`;
        
        if (!activeFilterBtn) {
            // Append to existing filter
            previewImage.style.filter += ' ' + shadowHighlightFilter;
        } else {
            // We need to apply these as separate effects since we can't modify the class filter
            // We'll use the filter property but only for shadows/highlights
            previewImage.style.filter = shadowHighlightFilter;
        }
    }
    
    // Apply color temperature and tint via box-shadow
    previewImage.style.boxShadow = `0 0 0 1000px ${tempColor} inset, 0 0 0 1000px ${tintColor} inset`;
    
    // Apply vignette via mask-image
    if (vignetteEffect) {
        previewImage.style.maskImage = vignetteEffect;
        previewImage.style.webkitMaskImage = vignetteEffect;
    } else {
        previewImage.style.maskImage = 'none';
        previewImage.style.webkitMaskImage = 'none';
    }
}

// Reset Filters
document.getElementById('reset').addEventListener('click', () => {
    // Reset all adjustments
    Object.keys(adjustments).forEach(key => {
        if (['rotate', 'flipH', 'flipV'].includes(key)) {
            adjustments[key] = key === 'rotate' ? 0 : 1;
        } else {
            adjustments[key] = 0;
        }
    });
    
    // Reset slider values
    document.querySelectorAll('input[type="range"]').forEach(slider => {
        slider.value = 0;
    });
    
    // Important: Clear ALL style properties that affect appearance
    previewImage.style.filter = 'none';
    previewImage.style.transform = 'none';
    previewImage.style.boxShadow = 'none';
    previewImage.style.maskImage = 'none';
    previewImage.style.webkitMaskImage = 'none';
    
    // Remove all filter classes
    previewImage.className = '';
    delete previewImage.dataset.adjustmentFilters;
    
    // Update filter buttons UI
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    
    saveState();
});

// Enhance sliders with haptic-like animation
document.querySelectorAll('input[type="range"]').forEach(slider => {
    slider.addEventListener('input', function() {
        // Create a subtle pulse animation on the slider thumb
        this.classList.add('slider-active');
        
        // Optional: add vibration if supported
        if (navigator.vibrate) {
            navigator.vibrate(1);
        }
        
        // Remove the class after animation completes
        setTimeout(() => this.classList.remove('slider-active'), 100);
    });
});

function applyCrop() {
    showLoading();
    
    // Get crop coordinates relative to the image
    const imgRect = previewImage.getBoundingClientRect();
    const cropRect = cropArea.getBoundingClientRect();
    
    // Calculate crop parameters in terms of the original image dimensions
    const scaleX = previewImage.naturalWidth / imgRect.width;
    const scaleY = previewImage.naturalHeight / imgRect.height;
    
    const cropX = (cropRect.left - imgRect.left) * scaleX;
    const cropY = (cropRect.top - imgRect.top) * scaleY;
    const cropWidth = cropRect.width * scaleX;
    const cropHeight = cropRect.height * scaleY;
    
    // Create canvas for cropping
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = cropWidth;
    canvas.height = cropHeight;
    
    // Draw cropped image
    ctx.drawImage(
        previewImage,
        cropX, cropY, cropWidth, cropHeight,
        0, 0, cropWidth, cropHeight
    );
    
    // Replace image source with cropped version
    const croppedImage = canvas.toDataURL();
    previewImage.src = croppedImage;
    
    // Hide crop overlay
    cropOverlay.style.display = 'none';
    
    hideLoading();
    saveState();
}

function cancelCrop() {
    cropOverlay.style.display = 'none';
}

// History management (undo/redo)
function saveState() {
    const currentState = {
        src: previewImage.src,
        style: {
            filter: previewImage.style.filter,
            transform: previewImage.style.transform,
            boxShadow: previewImage.style.boxShadow,
            maskImage: previewImage.style.maskImage
        },
        className: previewImage.className,
        adjustments: {...adjustments}
    };
    
    // If we're not at the end of the history, truncate it
    if (history.currentIndex < history.states.length - 1) {
        history.states = history.states.slice(0, history.currentIndex + 1);
    }
    
    // Add new state
    history.states.push(currentState);
    history.currentIndex++;
    
    // Limit history size
    if (history.states.length > history.maxStates) {
        history.states.shift();
        history.currentIndex--;
    }
    
    // Update UI
    updateHistoryButtons();
}

function loadState(state) {
    previewImage.src = state.src;
    
    // Important: Set className before setting filter style
    previewImage.className = state.className || '';
    
    // Now apply styles
    previewImage.style.filter = state.style.filter;
    previewImage.style.transform = state.style.transform;
    previewImage.style.boxShadow = state.style.boxShadow;
    previewImage.style.maskImage = state.style.maskImage;
    previewImage.style.webkitMaskImage = state.style.maskImage;
    
    // Update adjustments
    Object.assign(adjustments, state.adjustments);
    
    // Update sliders
    Object.keys(adjustments).forEach(key => {
        const slider = document.getElementById(key);
        if (slider) {
            slider.value = adjustments[key];
        }
    });
    
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', previewImage.classList.contains(btn.dataset.filter));
    });
}

document.getElementById('undo').addEventListener('click', () => {
    if (history.currentIndex > 0) {
        history.currentIndex--;
        loadState(history.states[history.currentIndex]);
        updateHistoryButtons();
    }
});

document.getElementById('redo').addEventListener('click', () => {
    if (history.currentIndex < history.states.length - 1) {
        history.currentIndex++;
        loadState(history.states[history.currentIndex]);
        updateHistoryButtons();
    }
});

function updateHistoryButtons() {
    document.getElementById('undo').disabled = history.currentIndex <= 0;
    document.getElementById('redo').disabled = history.currentIndex >= history.states.length - 1;
}

// Download Image
document.getElementById('download').addEventListener('click', () => {
    showLoading();
    
    setTimeout(() => {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = previewImage.naturalWidth;
            canvas.height = previewImage.naturalHeight;
            
            // Apply css filters
            if (previewImage.style.filter && previewImage.style.filter !== 'none') {
                ctx.filter = previewImage.style.filter;
            }
            
            // For transformed images, we need special handling
            if (adjustments.rotate !== 0 || adjustments.flipH !== 1 || adjustments.flipV !== 1) {
                // Adjust canvas size for rotation if needed
                if (Math.abs(adjustments.rotate) % 180 !== 0) {
                    // Swap width and height for 90/270 degree rotations
                    [canvas.width, canvas.height] = [canvas.height, canvas.width];
                }
                
                // Apply transforms
                ctx.translate(canvas.width/2, canvas.height/2);
                ctx.rotate(adjustments.rotate * Math.PI / 180);
                ctx.scale(adjustments.flipH, adjustments.flipV);
                ctx.translate(-previewImage.naturalWidth/2, -previewImage.naturalHeight/2);
            }
            
            // Draw the image
            ctx.drawImage(previewImage, 0, 0);
            
            // Apply any class-based filters (like vintage, sepia, etc.)
            if (previewImage.className) {
                // We'd need a second canvas for class-based filters
                // This is simplified - in production you'd want to map each class to its equivalent filter
                const tempCanvas = document.createElement('canvas');
                const tempCtx = tempCanvas.getContext('2d');
                tempCanvas.width = canvas.width;
                tempCanvas.height = canvas.height;
                tempCtx.filter = getComputedStyle(previewImage).filter;
                tempCtx.drawImage(canvas, 0, 0);
                
                // Copy back to original canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(tempCanvas, 0, 0);
            }
            
            const link = document.createElement('a');
            link.download = 'edited-photo.png';
            
            // Use toBlob for better performance with large images
            canvas.toBlob((blob) => {
                link.href = URL.createObjectURL(blob);
                link.click();
                hideLoading();
                showToast("Image downloaded successfully!");
                
                // Clean up
                URL.revokeObjectURL(link.href);
            }, 'image/png');
        } catch (error) {
            console.error("Download error:", error);
            hideLoading();
            showToast("Error downloading image. Please try again.");
        }
    }, 100);
});

// UI helper functions
function showToast(message, duration = 3000) {
    toast.textContent = message;
    toast.classList.add('show');
    
    // Add animation for more iOS feel
    toast.style.animation = 'none';
    setTimeout(() => {
        toast.style.animation = 'toastBounce 0.5s cubic-bezier(0.17, 0.67, 0.21, 0.98)';
    }, 10);
    
    setTimeout(() => {
        toast.style.animation = 'toastFadeOut 0.5s forwards';
        setTimeout(() => {
            toast.classList.remove('show');
        }, 500);
    }, duration);
}

function showLoading() {
    loading.style.display = 'block';
    loading.classList.add('visible');
}

function hideLoading() {
    loading.classList.remove('visible');
    setTimeout(() => {
        loading.style.display = 'none';
    }, 300);
}

// Add iOS-like elastic overscroll effect
document.querySelector('.sidebar').addEventListener('scroll', function(e) {
    const scrollTop = this.scrollTop;
    const maxScrollTop = this.scrollHeight - this.clientHeight;
    
    if (scrollTop <= 0) {
        this.style.backgroundPosition = `0 ${Math.sqrt(Math.abs(scrollTop)) * 5}px`;
    } else if (scrollTop >= maxScrollTop) {
        this.style.backgroundPosition = `0 -${Math.sqrt(Math.abs(scrollTop - maxScrollTop)) * 5}px`;
    } else {
        this.style.backgroundPosition = '';
    }
});

// Add CSS styles for these animations
const style = document.createElement('style');
style.textContent = `
    @keyframes toastBounce {
        0% { transform: translateX(-50%) translateY(30px); opacity: 0; }
        70% { transform: translateX(-50%) translateY(-5px); opacity: 1; }
        100% { transform: translateX(-50%) translateY(0); opacity: 1; }
    }

    @keyframes toastFadeOut {
        0% { transform: translateX(-50%) translateY(0); opacity: 1; }
        100% { transform: translateX(-50%) translateY(-20px); opacity: 0; }
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.4);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .slider-active::-webkit-slider-thumb {
        transform: scale(1.2);
        box-shadow: 0 0 0 6px rgba(0, 255, 136, 0.2);
    }
    
    .filter-applied {
        animation: filterApplied 0.3s forwards;
    }
`;

document.head.appendChild(style);

// Add simpler hover effect to image container
imageContainer.addEventListener('mouseover', function() {
    if (this.classList.contains('loaded')) {
        this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.3)';
    }
});

imageContainer.addEventListener('mouseleave', function() {
    if (this.classList.contains('loaded')) {
        this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
    }
});

// Initialization
function init() {
    applyFilter();
    updateHistoryButtons();
    
    // Check for mobile devices
    if (window.innerWidth < 768) {
        // Add mobile-specific behaviors
        document.querySelector('.sidebar').classList.add('collapsed');
    }
}

// Initialize after everything is loaded
window.addEventListener('load', init);