chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action == "getMinProfile") {
        try {
            const profile = document.querySelector(".profile-photo-edit__edit-btn");
            if (!profile){
                const btn = getElement();
                const result = {
                    sts: true,
                    data: {
                        img: btn.children[0].getAttribute('src'), 
                        name: cleanName(btn.children[0].getAttribute('alt'))
                    } 
                }
                return sendResponse(result);
            } else if(profile && profile.children.length > 0){
                const result = { 
                    sts: true,
                    data: {
                        img: profile.children[0].getAttribute('src'), 
                        name: cleanName(profile.children[0].getAttribute('alt'))
                    } 
                }
                sendResponse(result);
            } else {
                sendResponse({ sts: false, error: "Profile element or its children not found" });
            }
        } catch (error) {
            sendResponse({ sts: false, error: "Profile element or its children not found" });
        }
    }
    return true;
})

function getElement() {
    let a = document.querySelectorAll('button');
    
    const button = Array.from(a).find((btn) => {
        const label = btn.getAttribute('aria-label');
        return label && label === 'open profile picture';
    });
    
    return button;
}

function cleanName(input){
    return input.split(',')[0];
}