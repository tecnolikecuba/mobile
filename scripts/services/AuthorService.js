$apiPath = 'https://tecnolikecuba.com';

angular.module('AuthorService', [])

    .factory('AuthorResource', function ($resource) {
        return $resource($apiPath + "/wp-json/wp/v2/users/:id", {id: "@id"},
            {
            });
    });