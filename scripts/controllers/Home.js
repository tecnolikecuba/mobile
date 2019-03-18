angular.module('appHome', [{
    name: "HomeService",
    files: [
        "scripts/services/HomeService.js",
    ]
}])
    .controller('HomeCtrl', function ($scope, HomeResource, $rootScope, $mdToast, $timeout) {
        // Se toma el estado de conexion por defecto.
        $scope.offLine = !navigator.onLine;
        $scope.per_page = 10;
        $rootScope.loading = false;

        $scope.loadMore = function () {
            if ($rootScope.Posts.length > 0)
                $rootScope.page++;
            else $rootScope.page = 1;

            more_posts = HomeResource.query($scope.per_page, $rootScope.page);
            console.log('Cargando la pagina ' + $rootScope.page + ' con un maximo de ' + $scope.per_page + ' elementos.');
            more_posts.$promise
                .then(function () {
                    $scope.offLine = false; // Notificarle a la vista que ya se encuentra en linea.
                    // TODO: Ocultar boton de cargar manualmente.
                    more_posts.forEach(function (value) {
                        value.excerpt.rendered = value.excerpt.rendered.split('<span class="read-more"><a href=')[0];
                        fecha = new Date(value.date);
                        value.date = fecha.getDate() + '/' + (fecha.getMonth() + 1) + '/' + fecha.getFullYear();
                        $rootScope.Posts.push(value);
                    });
                    $rootScope.loading = false;
                })
                .catch(function (err) {
                    $mdToast.show({
                        hideDelay: $rootScope.timeForToast,
                        position: 'top right',
                        template: '<md-toast>' +
                            '<span>' +
                            '<i class="ion  ion-md-close"></i> ' +
                            '¡Ha ocurrido un error mientras se cargaban los artículos!' +
                            '</span>' +
                            '</md-toast>'
                    });
                    //TODO: Agregar boton para cargar manualmente al dar error.
                    $scope.offLine = true; // Notificarle a la vista que  se encuentra fuera de linea.
                    $rootScope.page--;
                    $rootScope.loading = false;
                });
        };
        if ($rootScope.Posts.length === 0) {
            $scope.loadMore();
        } else {
            if ($rootScope.lastPost !== null) {
                $timeout(() => {
                    jQuery('#post_' + $rootScope.lastPost)[0].scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 500);
            }
        }
        mdContent = jQuery('#md-content');
        uiView = jQuery('#ui-view');
        mdContent.scroll(function () {
            if ($rootScope.Posts.length > 0 && !$rootScope.loading
                && location.href.split(location.origin)[1] === "/#!/"
                && mdContent.scrollTop() >= uiView.height() - mdContent.height() - 1000) {
                $rootScope.loading = true;
                $scope.loadMore();
            }
        });
    });