$apiPath = 'https://tecnolikecuba.com';

angular.module('PageService', [])

    .factory('PageResource', function ($resource) {
        return $resource($apiPath + "/wp-json/wp/v2/pages/:id", {id: "@id"},
            {
                put: {method: "PUT"},
            });
    });