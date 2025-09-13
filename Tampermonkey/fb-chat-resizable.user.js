// ==UserScript==
// @name         FB Chat Resizable (Tampermonkey)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Make Facebook chat windows resizable (left and top handles)
// @author       
// @match        https://*.facebook.com/*
// @match        https://facebook.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    const chatContainerSelector = 'div.xpqajaz.x1ey2m1c.x78zum5.x1jndppq.xixxii4.x1vjfegm';
    const chatWindowSelector = 'div.xcrg951.x5a5i1n.x1obq294';

    function addResizeFunctionality(chatWindow) {
        if (chatWindow.dataset.resizable) return;
        chatWindow.dataset.resizable = '1';

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

        function onMouseMove(e) {
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
        }

        function onMouseUp() {
            if (isResizingLeft || isResizingTop) {
                isResizingLeft = false;
                isResizingTop = false;
                document.body.style.cursor = '';
            }
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
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
                        const chatContainer = node.querySelector ? node.querySelector(chatContainerSelector) : null;
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
                        const newChatWindow = node.querySelector ? node.querySelector(chatWindowSelector) : null;
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

})();
