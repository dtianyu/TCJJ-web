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
    .factory('Beauty', function ($resource) {
        return $resource("app/data/:Id.json", {}, {
            query: {method: "GET", params: {Id: "beauty"}, isArray: true},
            top: {method: "GET", params: {Id: "beautyTop"}, isArray: true}
        });
    })
    .factory('Cart', ['$http', function ($http) {
        return {
            phone: "",
            contacter: "",
            address: "",
            recdate: "",
            rectime: "",
            rechour: new Date().getHours(),
            recmin: new Date().getMinutes(),
            storeid: 0,
            freightfree: 0.0,
            freight: 0.0,
            cartItems: [],
            totalQty: 0,
            totalAmts: 0,
            add: function (item, ff, f) {
                if (ff === undefined || f === undefined) {
                    return;
                }
                this.freightfree = ff;
                this.freight = f;
                var flag = true;
                var diffStore = true;
                var o = this.create(item);
                angular.forEach(this.cartItems, function (cartItem) {
                    if (cartItem.storeid !== o.storeid) {
                        diffStore = false;
                        alert("暂时不支持多个商家同时下单");
                    }
                    if (cartItem.storeid === o.storeid && cartItem.itemid === o.itemid) {
                        cartItem.qty += o.qty;
                        cartItem.amts = cartItem.price * cartItem.qty;
                        flag = false;
                    }
                });
                if (flag === diffStore) {
                    this.storeid = o.storeid;
                    o.amts = o.price * o.qty;
                    this.cartItems.push(o);
                }
                this.save();
                this.sum();
            },
            create: function (item) {
                var o = {
                    "storeid": item.storeid,
                    "userid": item.userid,
                    "itemid": item.id,
                    "content": item.itemdesc,
                    "spec": item.itemspec,
                    "price": item.price,
                    "unit": item.unit,
                    "qty": 1,
                    "logo1": item.logo1,
                    "remark": ""
                };
                return o;
            },
            clear: function () {
                if (this.cartItems.length > 0) {
                    this.cartItems.splice(0, this.cartItems.length);
                    this.save();
                    this.sum();
                }
            },
            isEmpty: function () {
                if (this.cartItems === undefined || this.cartItems.length === 0) {
                    return true;
                } else {
                    return false;
                }
            },
            isRecValidate: function () {
                if (this.rechour < 0 || this.rechour > 24)
                    return false;
                if (this.recmin < 0 || this.recmin > 59)
                    return false;
                return true;
            },
            init: function () {
                var index;
                var cartList = localStorage.getItem(key);
                if (cartList === null || cartList === "") {
                    cartList = [];
                } else {
                    cartList = JSON.parse(cartList);
                }
                for (var i = 0; i < cartList.length; i++) {
                    index = this.cartItems.indexOf(cartList[i]);
                    if (index !== -1) {
                        this.cartItems.push(cartList[i]);
                    }
                }
            },
            less: function (item) {
                if (item !== null) {
                    var index = this.cartItems.indexOf(item);
                    if (index !== -1) {
                        this.cartItems[index].qty -= 1;
                        this.cartItems[index].amts = this.cartItems[index].price * this.cartItems[index].qty;
                        if (this.cartItems[index].qty === 0) {
                            this.remove(item);
                        }
                        this.save();
                        this.sum();
                    }
                }
            },
            more: function (item) {
                if (item !== null) {
                    var index = this.cartItems.indexOf(item);
                    if (index !== -1) {
                        this.cartItems[index].qty += 1;
                        this.cartItems[index].amts = this.cartItems[index].price * this.cartItems[index].qty;
                        this.save();
                        this.sum();
                    }
                }
            },
            remove: function (item) {
                var index = this.cartItems.indexOf(item);
                if (index !== -1) {
                    this.cartItems.splice(index, 1);
                }
                this.save();
                this.sum();
            },
            save: function () {
                localStorage.removeItem(key);
                localStorage.setItem(key, JSON.stringify(this.cartItems));
            },
            sum: function () {
                var qty = 0;
                var amts = 0;
                for (var i = 0; i < this.cartItems.length; i++) {
                    qty += this.cartItems[i].qty;
                    amts += this.cartItems[i].amts;
                }
                this.totalQty = qty;
                this.totalAmts = amts;
                if (this.totalAmts >= this.freightfree) {
                    this.freight = 0;
                }
            },
            submit: function () {
                var _this = this;
                if (this.isEmpty()) {
                    alert("没有购物明细！");
                    return false;
                }
                var validateReg = /^((\+?86)|(\(\+86\)))?1[3|4|5|8]\d{9}$/;
                var value = $("#phone").val();
                if (!validateReg.test(value)) {
                    $('#phonePopover').popover('show');
                    $('div.popover').on('click', function () {
                        $(this).removeAttr('style');
                    });
                    return false;
                }
                this.rectime = "1970-01-01T";
                if (this.rechour < 10) {
                    this.rectime = this.rectime + "0" + this.rechour.toString() + ":";
                } else {
                    this.rectime = this.rectime + this.rechour.toString() + ":";
                }
                if (this.recmin < 10) {
                    this.rectime = this.rectime + "0" + this.recmin + ":00+08:30";
                } else {
                    this.rectime = this.rectime + this.recmin + ":00+08:30";
                }
                var doAfterSubmit = function () {
                    //alert('Begin Clear');
                    _this.clear();
                    //alert('End Clear');
                };
                var cartId = getCartId();
                var url = home_url + '/cart';
                var url_detail = home_url + '/cartdetail';
                var cart = {
                    "cartid": cartId,
                    "storeid": this.storeid,
                    "phone": this.phone,
                    "contacter": this.contacter,
                    "address": this.address,
                    "recdate": this.recdate,
                    "rectime": this.rectime,
                    "amts": this.totalAmts,
                    "freight": this.freight,
                    "remark": ""
                };
                for (var i = 0; i < this.cartItems.length; i++) {
                    this.cartItems[i].cartid = cartId;
                }
                this.save();
                var cartList = JSON.parse(localStorage.getItem(key));
                $http.post(url, cart)
                    .success(function () {
                        $http.post(url_detail, cartList)
                            .success(function () {
                                alert("提交成功!");
                                doAfterSubmit();
                                window.location.href = "http://www.jinshanlife.com/HiJS-store";
                            }).error(function () {
                                alert("提交失败，请重试!");
                            });
                    })
                    .error(function () {
                        alert("提交失败，请重试!");
                    });

            },
            unSubmit: function (o) {
                if (this.isEmpty()) {
                    return true;
                }
                if (!this.isRecValidate()) {
                    return true;
                }
                return o;
            }
        };
    }])
    .factory('Cate', function ($resource) {
        return $resource("app/data/:Id.json", {}, {
            query: {method: "GET", params: {Id: "cate"}, isArray: true},
            top: {method: "GET", params: {Id: "cateTop"}, isArray: true}
        });
    })
    .factory('Category', function ($resource) {
        return $resource("app/data/:Id.json", {}, {
            cate: {method: "GET", params: {Id: "cateCategory"}, isArray: true},
            help: {method: "GET", params: {Id: "helpCategory"}, isArray: true},
            beauty: {method: "GET", params: {Id: "beautyCategory"}, isArray: true},
            fresh: {method: "GET", params: {Id: "freshCategory"}, isArray: true}
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
    .factory('Fresh', function ($resource) {
        return $resource("app/data/:Id.json", {}, {
            query: {method: 'GET', params: {Id: 'fresh'}, isArray: true},
            top: {method: 'GET', params: {Id: 'freshTop'}, isArray: true}
        });
    })
    .factory('Help', function ($resource) {
        return $resource("app/data/:Id.json", {}, {
            query: {method: "GET", params: {Id: "help"}, isArray: true},
            top: {method: "GET", params: {Id: "helpTop"}, isArray: true}
        });
    })
    .factory('StoreKind', function ($resource) {
        return $resource("app/data/:Id.json", {}, {
            query: {method: 'GET', params: {Id: 'storekind'}, isArray: true}
        });
    })
    .factory("Training", function ($resource) {
        return $resource("app/data/:Id.json", {}, {
            query: {method: 'GET', params: {Id: 'training'}, isArray: true},
            top: {method: 'GET', params: {Id: 'trainingTop'}, isArray: true}
        })
    })
    .factory('WebLinks', function ($resource) {
    return $resource("app/data/:Id.json", {}, {
        links: {method: "GET", params: {Id: "Weblink"}, isArray: true},
        shortcuts: {method: "GET", params: {Id: "Weblink2"}, isArray: true}
    });
});

var getCartId = function () {
    return Math.round(new Date().getTime() / 1000);
};

var getTimestamp = function () {
    return Math.round(new Date().getTime() / 100);
};
