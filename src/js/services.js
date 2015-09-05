/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var home_url = "http://localhost:8480/HiJS-cart/app";
var home_api = "app/data";

var key = "com.jinshanlife.cart";

var appServices = angular.module('appServices', ['ngResource']);

appServices.factory('Area', function ($resource) {
    return $resource("app/data/:Id.json", {}, {
        town: {method: "GET", params: {Id: "town"}, isArray: true}
    });
})
    .factory('Filter', function () {
        return {
            filterDetail: {},
            filters: [],
            searchText: '',
            clear: function () {
                var _this = this;
                if (_this.filters.length > 0) {
                    _this.filters.splice(0, _this.filters.length);
                }
                _this.filterDetail = {}
            }
        };
    })
    .factory('Property', function ($resource) {
        return $resource("app/data/:Id.json", {}, {
            query: {method: 'GET', params: {Id: 'property'}, isArray: true}
        });
    })
    .factory('Kind', function ($resource) {
        return $resource("app/data/:Id.json", {}, {
            query: {method: 'GET', params: {Id: 'kind'}, isArray: true}
        });
    })
    .factory('Favorite', function ($resource) {
        return $resource("app/data/:Id.json", {}, {
            query: {method: 'GET', params: {Id: 'favorite'}, isArray: true}
        });
    })
    .factory('Newest', function ($resource) {
        return $resource("app/data/:Id.json", {}, {
            query: {method: "GET", params: {Id: "newest"}, isArray: true},
        });
    })
    .factory('Product', function ($resource) {
        return $resource("app/data/:Id.json", {}, {});
    });

var getCartId = function () {
    return Math.round(new Date().getTime() / 1000);
};

var getTimestamp = function () {
    return Math.round(new Date().getTime() / 100);
};
