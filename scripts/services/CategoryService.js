$apiPath = 'https://tecnolikecuba.com';

angular.module('CategoryService', [])

    .factory('CategoryResource', function ($resource) {
        return {
            query: function (per_page, page) {
                return $resource($apiPath + "/wp-json/wp/v2/categories", {}, {
                    query: {
                        method: 'GET',
                        params: {per_page: per_page, page: page},
                        isArray: true
                    }
                }).query()
            }
        };
    });