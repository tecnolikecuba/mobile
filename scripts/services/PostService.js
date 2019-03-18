$apiPath = 'https://tecnolikecuba.com';

angular.module('PostService', [])

    .factory('PostResource', function ($resource) {
        return $resource($apiPath + "/wp-json/wp/v2/posts/:id", {id: "@id"},
            {
                put: {method: "PUT"},
            });
    });