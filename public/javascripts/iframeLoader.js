
var c2stem_URL = 'https://physdev.c2stem.org';
var login_URL = 'https://login.c3stem.org/index.html?redirect='

class IframeLoader {
    constructor(container) {
        const source_frame = document.getElementById("iframe-id");
        if(source_frame){
            source_frame.remove();
        }else{
            this.element = document.createElement('iframe');
            this.element.setAttribute('src', this.getTemplateURL());
            this.element.setAttribute('id', 'iframe-id');
            this.element.setAttribute('height', '100%');
            this.element.setAttribute('width', '100%');
            this.element.setAttribute('frameborder', '0');
            this.element.setAttribute('sandbox', 'allow-scripts allow-same-origin');
            container.appendChild(this.element);
        }
    }

    getTemplateURL() {

        const userData = new LocalUser();
        var user = userData.getStoredUser("netsblox-user");
        var project = userData.getStoredProjectName(user); 

        if (user){
            if(project){
                c2stem_URL = `https://physdev.c2stem.org?action=present&Username=${user}&ProjectName=${project}`;
            }else{
                c2stem_URL = 'https://physdev.c2stem.org?action=present&Username=naveed&ProjectName=template';
            }
        }else{
            c2stem_URL = 'https://login.c2stem.org/index.html?redirect=https://physdev.c2stem.org';
        } 

        return c2stem_URL;
    }


}