'use strict';


module.exports = function(app){
    let productsCtrl = require('./controllers/ProductsController');

    // test example
    // app.route('/products')
    //     .get(productsCtrl.get) 
    //     .post(productsCtrl.store); 

    // app.route('/products/:productId')
    //     .get(productsCtrl.detail) 
    //     .put(productsCtrl.update) 
    //     .delete(productsCtrl.delete); 

    // hoc vien
    let hocvienControl = require('./controllers/HocVienController');
    app.route('/hocvien/login').post(hocvienControl.login)
    app.route('/hocvien/refresh').post(hocvienControl.refreshToken)
    app.route('/hocvien')
        .get(hocvienControl.get)
        .post(hocvienControl.store)
    app.route('/hocvien/:hv_username')
        .get(hocvienControl.detail) 
        .put(hocvienControl.update) 
        .delete(hocvienControl.delete);

    // giao vien
    let giaovienControl = require('./controllers/GiaoVienController');
    app.route('/giaovien/login').post(giaovienControl.login)
    app.route('/giaovien/refresh').post(giaovienControl.refreshToken)
    app.route('/giaovien')
        .get(giaovienControl.get)
        .post(giaovienControl.store); 

    app.route('/giaovien/:gv_username')
        .get(giaovienControl.detail) 
        .put(giaovienControl.update) 
        .delete(giaovienControl.delete);

}