angular.module('appPost', [{
    name: "PostService",
    files: [
        "scripts/services/PostService.js",
    ]
}, {
    name: "AuthorService",
    files: [
        "scripts/services/AuthorService.js",
    ]
}])
    .controller('PostCtrl', function ($scope, PostResource, CategoryResource, AuthorResource, $uiRouterGlobals, $rootScope) {
        // Se toma el estado de conexion por defecto.
        $scope.offLine = !navigator.onLine;
        jQuery('#initialElement')[0].scrollIntoView();
        $scope.ready = false;
        params = $uiRouterGlobals.params;
        $rootScope.lastPost = params.id;
        //Intentar recuperar author cargado antes
        var recoveryAuthor = $rootScope.loadedAuthors.filter(el => {
            return el.id == params.author
        })[0];
        if (recoveryAuthor !== undefined) {
            $scope.Author = recoveryAuthor;
        } else {
            $scope.Author = AuthorResource.get({id: params.author});
            $scope.Author.$promise
                .then(function () {
                    $rootScope.loadedAuthors.push($scope.Author);
                })
        }


        //Intentar recuperar post cargado antes
        var recoveryPost = $rootScope.loadedPosts.filter(el => {
            return el.id == params.id
        })[0];

        if (recoveryPost !== undefined) {
            $scope.Post = recoveryPost;
            $scope.ready = true;
        } else {
            $scope.Post = PostResource.get({id: params.id});
            $scope.Post.$promise
                .then(function () {
                    $scope.offLine = false; // Notificarle a la vista que ya se encuentra en linea.
                    fecha = new Date($scope.Post.date);
                    $scope.Post.date = fecha.getDate() + '/' + (fecha.getMonth() + 1) + '/' + fecha.getFullYear();
                    jQuery('.tecno-contenido').remove();
                    $scope.ready = true;
                    $rootScope.loadedPosts.push($scope.Post);
                })
                .catch(function (err) {
                    $scope.offLine = true; // Notificarle a la vista que  se encuentra fuera de linea.
                });
        }
        link = $uiRouterGlobals.params.link;
        $scope.disqusConfig = {
            disqus_shortname: 'tecnolikecuba',
            disqus_identifier: params.id + ' https://tecnolikecuba.com/?p=' + params.id,
            disqus_url: link
        };

    });