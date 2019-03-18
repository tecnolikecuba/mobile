angular.module('Client', ['ui.router', 'oc.lazyLoad', 'ngResource', 'ngMaterial', 'ngMessages',
    'angular-loading-bar', 'ngSanitize', 'angularUtils.directives.dirDisqus', 'CategoryService'])
    .controller('appCtrl', function ($scope, $mdSidenav, $timeout, $rootScope, CategoryResource) {
        $rootScope.Categories = CategoryResource.query(100, 1);
        $rootScope.timeForToast = 7000;

        $rootScope.Posts = [];
        $rootScope.loadedPosts = [];
        $rootScope.loadedAuthors = [];
        $rootScope.lastPost = null;

        // Verificar y crear configuraciones de ahorro
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
        open('TLC', 1).then(function (db) {
            // use db here
            console.log(db);
            // test get
            var objectStore = db.transaction("config").objectStore("config");

            objectStore.get(1).onsuccess = function (event) {
                console.log('in database', event.target.result);
                var result = event.target.result;
                if (result === undefined) {
                    // in case not exist
                    var trans = db.transaction('config', 'readwrite');
                    var store = trans.objectStore('config');
                    result = {comments: true, images: "-1", ID: 1};
                    store.put(result);
                }
                console.log('result', result);
                $scope.options = result;
            };
        });

        // Esperar a que termine de cargar para ocultar el logo
        $scope.$on('$viewContentLoaded', function () {
            $timeout(function () {
                $scope.Loading = true;
            }, 3000);
        });
        $scope.toggleLeft = buildToggler('left');

        function buildToggler(componentId) {
            return function () {
                $mdSidenav(componentId).toggle();
            };
        }
    })
    .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
            cfpLoadingBarProvider.includeSpinner = true;
            cfpLoadingBarProvider.includeBar = true;
        }]
    )
    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                controller: 'HomeCtrl',
                templateUrl: 'views/index.html',
                resolve: {
                    home: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: "appHome",
                            files: [
                                "scripts/controllers/Home.js",
                            ]
                        })
                    }
                }
            })
            .state('viewPost', {
                url: '/post/:id/:link/:author',
                controller: 'PostCtrl',
                templateUrl: 'views/Post/index.html',
                resolve: {
                    viewPost: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: "appPost",
                            files: [
                                "scripts/controllers/Post.js",
                                "assets/css/post.css",
                            ]
                        })
                    }
                }
            })
            .state('viewPage', {
                url: '/page/:id',
                controller: 'PageCtrl',
                templateUrl: 'views/Page/index.html',
                resolve: {
                    viewPost: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: "appPage",
                            files: [
                                "scripts/controllers/Page.js",
                                "assets/css/page.css",
                            ]
                        })
                    }
                }
            })
            .state('About', {
                url: '/about',
                controller: 'AboutCtrl',
                templateUrl: 'views/about.html',
                resolve: {
                    viewPost: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: "appAbout",
                            files: [
                                "scripts/controllers/About.js",
                                "assets/css/about.css",
                            ]
                        })
                    }
                }
            })
            .state('Config', {
                url: '/config',
                controller: 'ConfigCtrl',
                templateUrl: 'views/config.html',
                resolve: {
                    viewPost: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: "appConfig",
                            files: [
                                "scripts/controllers/Config.js",
                                "assets/css/config.css",
                            ]
                        })
                    }
                }
            })
            .state('otherwise', {
                url: '',
                redirectTo: 'home',
            })

    }])
;