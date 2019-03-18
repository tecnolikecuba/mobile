angular.module('appConfig', [])
    .controller('ConfigCtrl', function ($scope, $rootScope, $mdToast) {
        console.log($scope.options);

        $scope.guardarOpciones = function () {
            open('TLC', 1).then(function (db) {
                // use db here
                console.log(db);
                // test get
                var trans = db.transaction('config', 'readwrite');
                var store = trans.objectStore('config');
                store.put($scope.options);
                $mdToast.show({
                    hideDelay: $rootScope.timeForToast,
                    position: 'top right',
                    template: '<md-toast>' +
                        '<span>' +
                        '<i class="ion ion-md-checkmark"></i> ' +
                        '¡Configuración guardada! ' +
                        'Ahora puede regresar a la portada ' +
                        '</span>' +
                        '</md-toast>'
                });
                console.log('save result', $scope.options);
            });
        };
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
    });