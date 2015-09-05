'use strict';

/* Controllers */
var key = "com.tcjj.cart";

var getTimestamp = function () {
    return Math.round(new Date().getTime() / 1000);
};

var CartController = ['$scope', 'Cart', function ($scope, Cart) {
    $scope.cart = Cart;
    $scope.cart.init();
    $scope.cart.sum();
    $scope.currentDate = '';
    $scope.updateDate = function (date) {
        $scope.cart.recdate = date + "T00:00:00+08:00";
    };
}];

var FilterController = ['$scope', 'Filter', 'Property', 'Kind', function ($scope, Filter, Property, Kind) {
    $scope.property = Property.query();
    $scope.kind = Kind.query();
    $scope.doFilter = Filter;

    $scope.addFilterKind = function (filter) {
        var i;
        if ($scope.doFilter.filterDetail.kind === undefined) {
            $scope.doFilter.filterDetail.kind = [];
        }
        if ($scope.doFilter.filters === undefined) {
            $scope.doFilter.filters = [];
        }
        i = $scope.doFilter.filterDetail.kind.indexOf(filter);
        if (i === -1) {
            $scope.doFilter.filterDetail.kind.push(filter);
            $scope.doFilter.filters.push({"key": "kind", "value": filter});
        }
    };

    $scope.addFilterProperty = function (filter) {
        var i;
        if ($scope.doFilter.filterDetail.property === undefined) {
            $scope.doFilter.filterDetail.property = [];
        }
        if ($scope.doFilter.filters === undefined) {
            $scope.doFilter.filters = [];
        }
        i = $scope.doFilter.filterDetail.property.indexOf(filter);
        if (i === -1) {
            $scope.doFilter.filterDetail.property.push(filter);
            $scope.doFilter.filters.push({"key": "property", "value": filter});
        }
    };

    $scope.removeFilter = function (filterObject) {
        var i = -1;
        i = $scope.doFilter.filters.indexOf(filterObject);
        if (i !== -1) {
            $scope.doFilter.filters.splice(i, 1);
        }
        if ($scope.doFilter.filterDetail.property !== undefined) {
            i = $scope.doFilter.filterDetail.property.indexOf(filterObject.value);
            if (i !== -1) {
                $scope.doFilter.filterDetail.property.splice(i, 1);
            }
        }
        if ($scope.doFilter.filterDetail.kind !== undefined) {
            i = $scope.doFilter.filterDetail.kind.indexOf(filterObject.value);
            if (i !== -1) {
                $scope.doFilter.filterDetail.kind.splice(i, 1);
            }
        }
    };

    $scope.resetFilter = function () {
        Filter.clear();
    }

}];

var MainController = ['$scope', '$location', 'Favorite', 'Newest', function ($scope, $location, Favorite, Newest) {

    $scope.goto = function (path) {
        $location.path(path);
    };
    $scope.favoriteitems = Favorite.query();
    $scope.newestitems = Newest.query();

}];

var ProductController = ['$scope', '$location', '$routeParams', 'Product', 'Filter', function ($scope, $location, $routeParams, Product, Filter) {

    $scope.goto = function (path) {
        $location.path(path);
    };

    Filter.clear();
    $scope.doFilter = Filter;

    $scope.items;
    if ($routeParams.Id !== undefined) {
        $scope.items = Product.query({Id: $routeParams.Id, isArray: true});
    }

}];


