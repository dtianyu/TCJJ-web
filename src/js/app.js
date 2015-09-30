/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('tcjjApp', ['appServices', 'appDirectives']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/main', {templateUrl: 'partials/main.html', controller: MainController}).
        when('/product/:Id', {templateUrl: 'partials/product.html', controller: ProductController}).
        when('/kb', {templateUrl: 'partials/kb.html'}).
        when('/contact', {templateUrl: 'partials/contact.html'}).
        otherwise({redirectTo: 'main'});
}]);
