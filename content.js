const CONFIG = {
    chatContainerSelector: 'div.xpqajaz.x1ey2m1c.x78zum5.x1jndppq.xixxii4.x1vjfegm',
    chatWindowSelector: 'div.xcrg951.x5a5i1n.x1obq294',
    handleSize: 5,
    zIndex: 9999,
    minHeight: 0
};

function createHandle(type, cursor) {
    const handle = document.createElement('div');
    const styles = {
        position: 'absolute',
        backgroundColor: 'transparent',
        zIndex: CONFIG.zIndex,
        cursor: cursor,
        ...getHandlePosition(type)
    };
    
    Object.assign(handle.style, styles);
    return handle;
}

function getHandlePosition(type) {
    const size = CONFIG.handleSize + 'px';
    const positions = {
        left: { left: '0', top: '0', width: size, height: '100%' },
        top: { left: '0', top: '0', width: '100%', height: size },
        bottom: { left: '0', bottom: '0', width: '100%', height: size },
        right: { right: '0', top: '0', width: size, height: '100%' }
    };
    return positions[type];
}

function addResizeFunctionality(chatWindow) {
    if (chatWindow.dataset.resizable) return;
    chatWindow.dataset.resizable = true;

    const minWidth = chatWindow.offsetWidth;
    const handles = {
        left: createHandle('left', 'ew-resize'),
        top: createHandle('top', 'ns-resize'),
        bottom: createHandle('bottom', 'move'),
        right: createHandle('right', 'ew-resize')
    };

    chatWindow.style.position = 'relative';
    Object.values(handles).forEach(handle => chatWindow.appendChild(handle));

    const state = {
        activeHandle: null,
        startX: 0,
        startY: 0,
        startWidth: 0,
        startHeight: 0,
        startLeft: 0,
        startTop: 0,
        startBottom: 0,
        startRight: 0
    };

    function initializeResize(type, e, cursor) {
        state.activeHandle = type;
        state.startX = e.clientX;
        state.startY = e.clientY;
        state.startWidth = chatWindow.offsetWidth;
        state.startHeight = chatWindow.offsetHeight;
        
        const rect = chatWindow.getBoundingClientRect();
        state.startLeft = rect.left;
        state.startTop = rect.top;
        state.startBottom = rect.bottom;
        state.startRight = rect.right;
        
        document.body.style.cursor = cursor;
        e.preventDefault();
    }

    handles.left.addEventListener('mousedown', e => initializeResize('left', e, 'ew-resize'));
    handles.top.addEventListener('mousedown', e => initializeResize('top', e, 'ns-resize'));
    handles.bottom.addEventListener('mousedown', e => initializeResize('drag', e, 'move'));
    handles.right.addEventListener('mousedown', e => initializeResize('right', e, 'ew-resize'));

    function handleMouseMove(e) {
        if (!state.activeHandle) return;

        const deltaX = e.clientX - state.startX;
        const deltaY = e.clientY - state.startY;
        
        const handlers = {
            left: () => {
                const newWidth = state.startWidth - deltaX;
                const newLeft = state.startLeft + deltaX;
                if (newWidth >= minWidth) {
                    chatWindow.style.width = newWidth + 'px';
                    if (chatWindow.style.position === 'fixed') {
                        chatWindow.style.left = newLeft + 'px';
                    }
                }
            },
            top: () => {
                const newHeight = state.startHeight - deltaY;
                const newTop = state.startTop + deltaY;
                if (newHeight >= CONFIG.minHeight) {
                    chatWindow.style.height = newHeight + 'px';
                    if (chatWindow.style.position === 'fixed') {
                        chatWindow.style.top = newTop + 'px';
                    }
                }
            },
            drag: () => {
                const newLeft = state.startLeft + deltaX;
                const newTop = state.startTop + deltaY;
                chatWindow.style.position = 'fixed';
                if (newTop + chatWindow.offsetHeight > window.innerHeight) {
                    chatWindow.style.top = (window.innerHeight - chatWindow.offsetHeight) + 'px';
                } else if (newTop + chatWindow.offsetHeight < 5) {
                    chatWindow.style.top = (5 - chatWindow.offsetHeight) + 'px';
                } else {
                    chatWindow.style.left = newLeft + 'px';
                    chatWindow.style.top = newTop + 'px';
                }
            },
            right: () => {
                const newWidth = state.startWidth + deltaX;
                if (newWidth >= minWidth) {
                    chatWindow.style.width = newWidth + 'px';
                }
            }
        };

        handlers[state.activeHandle]?.();
    }

    function handleMouseUp() {
        if (state.activeHandle) {
            state.activeHandle = null;
            document.body.style.cursor = '';
        }
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
}

function findChatContainer(node) {
    if (node.matches?.(CONFIG.chatContainerSelector)) return node;
    return node.querySelector?.(CONFIG.chatContainerSelector);
}

function processMutationNodes(nodes, callback) {
    nodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
            callback(node);
        }
    });
}

function observerMountDiv() {
    const mountDiv = document.querySelector('div[id^="mount_0_0_"]');
    if (!mountDiv) return null;
    
    const observer = new MutationObserver((mutations, observe) => {
        mutations.forEach(mutation => {
            processMutationNodes(mutation.addedNodes, node => {
                const chatContainer = findChatContainer(node);
                if (chatContainer) {
                    observe.disconnect();
                    observeChatWindows(chatContainer);
                }
            });
        });
    });
    
    observer.observe(mountDiv, { childList: true, subtree: true });
}

function observeChatWindows(chatContainer) {
    const chatWindows = chatContainer.querySelectorAll(CONFIG.chatWindowSelector);
    chatWindows.forEach(addResizeFunctionality);

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            processMutationNodes(mutation.addedNodes, node => {
                const newChatWindow = node.querySelector?.(CONFIG.chatWindowSelector);
                if (newChatWindow) {
                    addResizeFunctionality(newChatWindow);
                }
            });
        });
    });

    observer.observe(chatContainer, { childList: true });
}

window.addEventListener('load', () => {
    observerMountDiv();
});