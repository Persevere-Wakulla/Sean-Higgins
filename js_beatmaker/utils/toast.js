export default class Toast {
    constructor() {
        this.toasts = [];
    }
    createMsg(msg, type, className) {
        let toastBody = document.createElement('div');

        toastBody.setAttribute('id', Math.random())
        toastBody.classList.add('toast', className);
        toastBody.innerHTML = `
        <div class="flex gap align-center">
        ${type}
        <p class="flex">${msg}</p>
        </div>
        `
        toastBody.style.opacity = 0;
        document.body.append(toastBody);
        if (this.toasts.length) {
            toastBody.style.top = (Number(toastBody.clientHeight) * this.toasts.length) + 'px';
        }
        toastBody.style.right = 0;
        this.toasts.push(toastBody);
        setTimeout(() => {
            toastBody.style.opacity = 1
        }, 50);
        let timeoutId = null;
        timeoutId = this.promiseActions(toastBody, timeoutId)
        toastBody.addEventListener('mouseenter', () => {
            clearTimeout(timeoutId);
        })
        toastBody.addEventListener('mouseleave', () => {
            timeoutId = this.promiseActions(toastBody, timeoutId);
        })
        toastBody.addEventListener('click', () => {
            toastBody.remove();
        })
    }

    promiseActions(toast, timeoutId) {
        new Promise((resolve) => {
            timeoutId = this.opacityTimeout(toast, resolve);
        }).then(() => this.removeElemTimeout(toast));
        return timeoutId;
    }

    opacityTimeout(toast, resolve) {
        return setTimeout(() => {
            toast.style.opacity = 0;
            resolve(true);
        }, 3000)
    }
    removeElemTimeout(toast) {
        setTimeout(() => {
            toast.remove();
            this.toasts.splice(this.toasts.indexOf(toast), 1);
            this.toasts.forEach(x => {
                let current = Number(x.style.top.split('px')[0]);
                if (current !== 0) {
                    x.style.top = (current - x.scrollHeight) + 'px';
                }
            })
        }, 500);
    }

    warning(msg) {
        let className = 'warning'
        let type = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="red" class="bi bi-exclamation-diamond-fill" viewBox="0 0 16 16">
            <path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM8 4c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995A.905.905 0 0 1 8 4m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
            </svg>`
        this.createMsg(msg, type, className)
    }

    info(msg) {
        let className = 'info'
        let type = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16">
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
            </svg>`
        this.createMsg(msg, type, className)
    }
}