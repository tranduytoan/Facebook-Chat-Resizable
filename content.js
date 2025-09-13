const chatContainerSelector = 'div.xpqajaz.x1ey2m1c.x78zum5.x1jndppq.xixxii4.x1vjfegm';
// const chatWindowSelector = 'div.xcrg951.x5a5i1n.x1obq294.x78zum5.xdt5ytf.x6prxxf.xvq8zen.x1hm9lzh.x6ikm8r.x10wlt62.xi55695.x1rgmuzj.x85a59c.xbbk1sx';
const chatWindowSelector = 'div.xcrg951.x5a5i1n.x1obq294';

function addResizeFunctionality(chatWindow) {
    if (chatWindow.dataset.resizable) return;
    chatWindow.dataset.resizable = true;

    // const initialHeight = chatWindow.offsetHeight;
    const minHeight = 0;
    const minWidth = chatWindow.offsetWidth;

    const leftHandle = document.createElement('div');
    leftHandle.style.position = 'absolute';
    leftHandle.style.left = '0';
    leftHandle.style.top = '0';
    leftHandle.style.width = '5px';
    leftHandle.style.height = '100%';
    leftHandle.style.cursor = 'ew-resize';
    leftHandle.style.backgroundColor = 'transparent';
    leftHandle.style.zIndex = '9999';

    const topHandle = document.createElement('div');
    topHandle.style.position = 'absolute';
    topHandle.style.left = '0';
    topHandle.style.top = '0';
    topHandle.style.width = '100%';
    topHandle.style.height = '5px';
    topHandle.style.cursor = 'ns-resize';
    topHandle.style.backgroundColor = 'transparent';
    topHandle.style.zIndex = '9999';

    chatWindow.style.position = 'relative';
    chatWindow.appendChild(leftHandle);
    chatWindow.appendChild(topHandle);

    let isResizingLeft = false;
    let isResizingTop = false;
    let startX, startY, startWidth, startHeight;

    leftHandle.addEventListener('mousedown', (e) => {
        isResizingLeft = true;
        startX = e.clientX;
        startWidth = chatWindow.offsetWidth;
        document.body.style.cursor = 'ew-resize';
        e.preventDefault();
    });

    topHandle.addEventListener('mousedown', (e) => {
        isResizingTop = true;
        startY = e.clientY;
        startHeight = chatWindow.offsetHeight;
        document.body.style.cursor = 'ns-resize';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (isResizingLeft) {
            const newWidth = startWidth - (e.clientX - startX);
            if (newWidth >= minWidth) {
                chatWindow.style.width = newWidth + 'px';
            }
        }
        if (isResizingTop) {
            const newHeight = startHeight - (e.clientY - startY);
            if (newHeight >= minHeight) {
                chatWindow.style.height = newHeight + 'px';
            }
        }
    });

    document.addEventListener('mouseup', () => {
        if (isResizingLeft || isResizingTop) {
            isResizingLeft = false;
            isResizingTop = false;
            document.body.style.cursor = '';
        }
    });
}

function observerMountDiv() {
    const mountDiv = document.querySelector('div[id^="mount_0_0_"]');
    if (!mountDiv) {
        return null;
    }
    
    const observer1 = new MutationObserver((mutations, observe) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.matches && node.matches(chatContainerSelector)) {
                        observe.disconnect();
                        observeChatWindows(node);
                        return;
                    }
                    const chatContainer = node.querySelector(chatContainerSelector);
                    if (chatContainer) {
                        observe.disconnect();
                        observeChatWindows(chatContainer);
                        return;
                    }
                }
            });
        });
    });
    observer1.observe(mountDiv, { childList: true, subtree: true });
}

function observeChatWindows(chatContainer) {
    const chatWindows = chatContainer.querySelectorAll(chatWindowSelector);
    chatWindows.forEach(addResizeFunctionality);

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const newChatWindow = node.querySelector(chatWindowSelector);
                    if (newChatWindow) {
                        addResizeFunctionality(newChatWindow);
                    }
                }
            });
        });
    });

    observer.observe(chatContainer, { childList: true });
}

window.addEventListener('load', () => {
    observerMountDiv();
});