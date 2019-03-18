;
//Registro de Características de PWA's
((d, w, n, c) => {
    //Registro de SW
    if ('serviceWorker' in n) {
        w.addEventListener('load', () => {
            n.serviceWorker.register('/sw.js')
                .then(registration => {
                    c(registration);
                    c(
                        'Service Worker registrado con éxito',
                        registration.scope
                    )
                })
                .catch(err => c(`Registro de Service Worker fallido`, err))
        })
    }

    //Activar Notificaciones
    oldState = Notification.permission;
    if (w.Notification && oldState !== 'denied') {
        Notification.requestPermission(status => {
            console.log(status);
            if (oldState !== status) {
                let n = new Notification('Bienvenido', {
                    body: 'El equipo de TecnoLike-Cuba- te da la bienvenido al blog. Gracias por permitir las notificaciones',
                    icon: '/assets/img/logos/icon_192x192.png'
                })
            }
        })
    }
    ;

})(document, window, navigator, console.log);

//Detección del Estado de la Conexión
((d, w, n, c) => {

    function networkStatus(e) {
        ic = d.querySelector('img.iconMain');
        c(e, e.type)
        if (n.onLine) {
            ic.setAttribute('src', '/assets/img/logos/icon_32x32.png');
        } else {
            ic.setAttribute('src', '/assets/img/logos/icon_32x32_off.png');
        }
    }

    d.addEventListener('DOMContentLoaded', e => {
        if (!n.onLine) {
            networkStatus(this)
        }

        w.addEventListener('online', networkStatus)
        w.addEventListener('offline', networkStatus)
    })
})(document, window, navigator, console.log);
