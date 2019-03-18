$apiPath = 'https://tecnolikecuba.com';

angular.module('HomeService', [])

    .factory('HomeResource', function ($resource) {
        return {
            query: function (per_page, page) {
                return $resource($apiPath + "/wp-json/wp/v2/posts", {}, {
                    query: {
                        method: 'GET',
                        params: {per_page: per_page, page: page},
                        isArray: true
                    }
                }).query()
            }
        };
    });