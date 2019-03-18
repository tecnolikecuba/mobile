const CACHE_NAME_PRINCIPAL = "TecnoLikeCuba-v1.0",
    CACHE_TEMP = "TLC-TMP-v1.0",
    urlsToCachePrincipal = [
        // Cachear vistas
        "/",
        "/index.html",
        "/views/index.html",
        "/views/about.html",
        "/views/config.html",
        "/views/Post/index.html",
        "/views/Page/index.html",
        // Cachear rchivos estaticos
        "/favicon.ico",
        "/assets/css/app.css",
        "/assets/css/about.css",
        "/assets/css/config.css",
        "/assets/css/page.css",
        "/assets/css/post.css",
        "/assets/js/app.js",
        // Cachear enrutador
        "/scripts/router.js",
        // Cachear Controladores
        "/scripts/controllers/Home.js",
        "/scripts/controllers/About.js",
        "/scripts/controllers/Config.js",
        "/scripts/controllers/Post.js",
        "/scripts/controllers/Page.js",
        // Cachear servicios
        "/scripts/services/HomeService.js",
        "/scripts/services/CategoryService.js",
        "/scripts/services/PageService.js",
        "/scripts/services/PostService.js",
        "/scripts/services/AuthorService.js",
        // Cachear dependencias
        "https://unpkg.com/bootstrap@4.1.3/dist/css/bootstrap.min.css",
        "https://unpkg.com/font-awesome@4.7.0/css/font-awesome.min.css",
        "https://unpkg.com/angular-material@1.1.10/angular-material.min.css",
        "https://unpkg.com/ionicons@4.4.7/dist/css/ionicons.min.css",
        "https://unpkg.com/angular-loading-bar@0.9.0/build/loading-bar.min.css",
        "https://ajax.googleapis.com/ajax/libs/angularjs/1.7.5/angular.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/angular-resource/1.7.5/angular-resource.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/1.0.20/angular-ui-router.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/oclazyload/1.1.0/ocLazyLoad.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/angular-sanitize/1.7.5/angular-sanitize.min.js",
        "https://bowercdn.net/c/angular-utils-disqus-1.0.0/dirDisqus.js",
        "https://unpkg.com/angular-animate@1.7.5/angular-animate.min.js",
        "https://unpkg.com/angular-aria@1.7.5/angular-aria.min.js",
        "https://unpkg.com/angular-messages@1.7.5/angular-messages.min.js",
        "https://unpkg.com/angular-material@1.1.10/angular-material.min.js",
        "https://unpkg.com/jquery@3.3.1/dist/jquery.min.js",
        "https://unpkg.com/bootstrap@4.1.3/dist/js/bootstrap.bundle.min.js",
        "https://unpkg.com/angular-loading-bar@0.9.0/build/loading-bar.min.js",
        // Cachear las imagenes y iconos
        "/assets/img/bann/banner-large.png",
        "/assets/img/icons/_ionicons_svg_md-home.svg",
        "/assets/img/icons/_ionicons_svg_md-contacts.svg",
        "/assets/img/icons/_ionicons_svg_md-hand.svg",
        "/assets/img/icons/_ionicons_svg_md-redo.svg",
        "/assets/img/icons/_ionicons_svg_logo-youtube.svg",
        "/assets/img/icons/_ionicons_svg_logo-facebook.svg",
        "/assets/img/icons/_ionicons_svg_md-information-circle.svg",
        "/assets/img/icons/_ionicons_svg_md-refresh.svg",
        "/assets/img/icons/_ionicons_svg_logo-linkedin.svg",
        "/assets/img/icons/_ionicons_svg_logo-twitter.svg",
        "/assets/img/icons/_ionicons_svg_md-mail.svg",
        "/assets/img/icons/_ionicons_svg_md-construct.svg",
        "/assets/img/icons/menu.svg",
        "/assets/img/logos/icon_32x32.png",
        "/assets/img/logos/icon_32x32_off.png",
        "/assets/img/logos/icon_192x192.png",
        "/assets/img/logos/icon_128x128.png",
        "/assets/img/logos/icon_256x256.png",
        "/assets/img/logos/icon_16x16.png",
        "/assets/img/mms.jpg"
    ],
    urlsToCacheTemporal = [
        "https://tecnolikecuba.com/wp-json/wp/v2/categories?page=1&per_page=100",
        "https://tecnolikecuba.com/wp-json/wp/v2/posts?page=1&per_page=10",
        "https://tecnolikecuba.com/wp-json/wp/v2/posts?page=2&per_page=10",
        "https://tecnolikecuba.com/wp-json/wp/v2/pages/2",
        "https://tecnolikecuba.com/wp-json/wp/v2/pages/147"
    ];


var open = function (name, ver) {
    return new Promise(function (yes) {
        var req = indexedDB.open(name, ver);
        req.onsuccess = function () {
            console.log('onsuccess');
            yes(req.result);
        };
        req.onupgradeneeded = function (res) {
            console.log('onupgradeneeded');
            // version upgrade logic here
            res.target.result.createObjectStore('config', {keyPath: "ID"});
        };
    })
};

function getConfig() {
    return new Promise(resolve => (
        open('TLC', 1).then(function (db) {
            // use db here
            console.log(db);
            // test get
            var objectStore = db.transaction("config").objectStore("config");

            return objectStore.get(1).onsuccess = function (event) {
                //debugger;

                console.log('SW in database', event.target.result);
                var result = event.target.result;
                if (result === undefined) {
                    // in case not exist
                    var trans = db.transaction('config', 'readwrite');
                    var store = trans.objectStore('config');
                    result = {comments: true, images: "-1", ID: 1};
                    store.put(result);
                }
                console.log('SW in result ', result);
                resolve(result);
            };
        })))
}

self.addEventListener('install', e => {
    console.log('Evento: SW Instalado');
    e.waitUntil(
        caches.open(CACHE_NAME_PRINCIPAL)
            .then(cacheP => {
                //Abrir cache para temporales y mostrar en momento de desconexion
                caches.open(CACHE_TEMP)
                    .then(cacheT => {
                        console.log('Registro de cache temporal correcto');
                        cacheT.addAll(urlsToCacheTemporal);
                    })
                    .catch(err => console.log('Falló registro de cache temporal', err));

                // Agregar archivos en cache principal
                console.log('Agregar archivos en cache principal');
                return cacheP.addAll(urlsToCachePrincipal)
                    .then(() => self.skipWaiting())
                //skipWaiting forza al SW a activarse
            })
            .catch(err => console.log('Falló registro de cache principal', err))
    )
});

self.addEventListener('activate', e => {
    console.log('Evento: SW Activado');
    const cacheWhitelist = [CACHE_NAME_PRINCIPAL, CACHE_TEMP];

    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    //Eliminamos lo que ya no se necesita en cache
                    if (cacheWhitelist.indexOf(cacheName) === -1)
                        return caches.delete(cacheName)
                })
            )
        })
            .then(() => {
                console.log('Cache actualizado');
                // Le indica al SW activar el cache actual
                return self.clients.claim()
            })
    )
});

self.addEventListener('fetch', e => {
    console.log('Evento: SW intentando recuperar para ', e.request.url);
    e.respondWith(
        //Miramos si la petición coincide con algún elemento del cache
        caches.match(e.request)
            .then(res => {
                //debugger;
                if (res && e.request.url.split('tecnolikecuba.com/wp-json/wp/v2').length !== 2) {
                    console.log('Recuperando de cache', e.request.url);
                    //Si coincide lo retornamos del cache
                    return res
                } else if (res && e.request.url.split('tecnolikecuba.com/wp-json/wp/v2').length === 2) {
                    switch (navigator.onLine) {
                        case true:
                            console.log('Renovando recurso cacheado', e.request.url);
                            // Se realiza la peticion
                            fetch(e.request)
                                .then(response => {
                                    console.log('Abriendo la cache temporal', e.request.url);
                                    return caches.open(CACHE_TEMP)
                                        .then(cache => {
                                            console.log('Actualizando la respuesta', e.request.url);
                                            return cache.put(e.request, response.clone())
                                                .then(() => {
                                                    console.log('Entregando la respuesta', e.request.url);
                                                    return response;
                                                })
                                        })
                                })
                                .catch(() => {
                                    return res;
                                });
                            break;
                        case false:
                            //Si estas offline y coincide lo retornamos del cache
                            return res;
                    }
                } else if (!res && e.request.url.includes('wp.com/tecnolikecuba.com/wp-content/')
                    && e.request.url.match(/[^/]+(jpg|png|gif|bmp|tiff|jpeg|webp)/) !== null) {
                    // obtener las configuraciones
                    return getConfig()
                        .then(config => {
                            //debugger;
                            var spl, otherP, addP, sol, req;
                            images = config.images;
                            var url = e.request.url;
                            console.log('Procesando que hacer con las imagenes no cacheadas para el valor', images);
                            switch (images) {
                                case "-1": // Ilimitado
                                    return fetch(e.request);
                                case "0": // Desactivado
                                    return null;
                                case "100":
                                    if (url.includes('fit=')) {
                                        spl = url.split('fit=');
                                        otherP = spl[1].split('&');
                                        addP = otherP[0].split('%');
                                        sol = 'fit=100%' + addP[1];
                                    } else {
                                        spl = url.split('w=');
                                        otherP = spl[1].split('&');
                                        sol = 'w=100';
                                    }
                                    for (let i = 1; i < otherP.length; i++) {
                                        sol = sol.concat('&' + otherP[i])
                                    }
                                    url_new = spl[0].concat(sol);
                                    req = new Request(url_new, {
                                        method: e.request.method,
                                        headers: e.request.headers,
                                        mode: 'no-cors', // need to set this properly
                                        credentials: e.request.credentials,
                                        redirect: 'follow'   // let browser handle redirects
                                    });
                                    return fetch(req);
                                case "250":
                                    if (url.includes('fit=')) {
                                        spl = url.split('fit=');
                                        otherP = spl[1].split('&');
                                        addP = otherP[0].split('%');
                                        sol = 'fit=250%' + addP[1];
                                    } else {
                                        spl = url.split('w=');
                                        otherP = spl[1].split('&');
                                        sol = 'w=250';
                                    }
                                    for (let i = 1; i < otherP.length; i++) {
                                        sol = sol.concat('&' + otherP[i])
                                    }
                                    url_new = spl[0].concat(sol);
                                    req = new Request(url_new, {
                                        method: e.request.method,
                                        headers: e.request.headers,
                                        mode: 'no-cors', // need to set this properly
                                        credentials: e.request.credentials,
                                        redirect: 'follow'   // let browser handle redirects
                                    });
                                    return fetch(req);
                                case "500":
                                    if (url.includes('fit=')) {
                                        spl = url.split('fit=');
                                        otherP = spl[1].split('&');
                                        addP = otherP[0].split('%');
                                        sol = 'fit=500%' + addP[1];
                                    } else {
                                        spl = url.split('w=');
                                        otherP = spl[1].split('&');
                                        sol = 'w=500';
                                    }
                                    for (let i = 1; i < otherP.length; i++) {
                                        sol = sol.concat('&' + otherP[i])
                                    }
                                    url_new = spl[0].concat(sol);
                                    req = new Request(url_new, {
                                        method: e.request.method,
                                        headers: e.request.headers,
                                        mode: 'no-cors', // need to set this properly
                                        credentials: e.request.credentials,
                                        redirect: 'follow'   // let browser handle redirects
                                    });
                                    return fetch(req);
                            }
                        });
                }
                console.log('Pidiendo recurso no cacheado', e.request.url);
                // Se realiza la peticion
                return fetch(e.request);
            })
    )
});

self.addEventListener('push', e => {
    console.log('Evento: Push', e);

    let title = 'Nuevos articulos',
        options = {
            body: 'Seleccione que desea hacer.',
            icon: '/assets/img/logos/icon_192x192.png',
            vibrate: [100, 50, 100],
            data: {id: 1},
            actions: [
                {'action': 'SiVer', 'title': 'Ir a la aplicación'},
                {'action': 'NoVer', 'title': 'Ignorar'}
            ]
        };

    e.waitUntil(self.registration.showNotification(title, options))
});

self.addEventListener('notificationclick', e => {
    console.log(e);
    if (e.action === 'SiVer') {
        console.log('Ver nuevos articulos');
        clients.openWindow(location.origin);
    } else if (e.action === 'NoVer') {
        console.log('No recargar los articulos');
    }

    e.notification.close()
});

self.addEventListener('sync', e => {
    console.log('Evento: Sincronización de Fondo', e);

    //Revisamos que la etiqueta de sincronización sea la que definimos o la que emulan las devtools
    if (e.tag === 'github' || e.tag === 'test-tag-from-devtools') {
        e.waitUntil(
            //Comprobamos todas las pestañas abiertas y les enviamos postMessage
            self.clients.matchAll()
                .then(all => {
                    return all.map(client => {
                        return client.postMessage('online')
                    })
                })
                .catch(err => console.log(err))
        )
    }
});

/* self.addEventListener('message' e => {
  console.log('Desde la Sincronización de Fondo: ', e.data)
  fetchGitHubUser( localStorage.getItem('github'), true )
}) */


var last_post,
    title = 'Nuevos articulos',
    options = {
        body: 'Seleccione que desea hacer.',
        icon: '/assets/img/logos/icon_192x192.png',
        vibrate: [100, 50, 100],
        data: {id: 1},
        actions: [
            {'action': 'SiVer', 'title': 'Abrir nueva ventana'},
            {'action': 'NoVer', 'title': 'Ignorar'}
        ]
    };
check_new_post = setInterval(function () {
    if (last_post === undefined) {
        console.log('last_post is undefined', last_post);
        caches.match('https://tecnolikecuba.com/wp-json/wp/v2/posts?page=1&per_page=10')
            .then(res => {
                res.json()
                    .then(js => {
                        console.log('last post', js[0].id);
                        last_post = js[0].id
                    })
            })
    } else {
        url_new = "https://tecnolikecuba.com/wp-json/wp/v2/posts?per_page=1&page=1";
        req = new Request(url_new, {
            method: 'GET',
            mode: 'cors', // need to set this properly
        });
        fetch(req).then(res => {
            console.log(res);
            res.json()
                .then(jsr => {
                    console.log('Comprobar el ultimo post.');
                    console.log('lastPost and newPost', last_post, jsr[0].id);
                    if (jsr[0].id !== last_post) {
                        last_post = jsr[0].id;
                        self.registration.showNotification(title, options);
                    }
                })
        });

    }
}, 1000 * 60 * 60);
