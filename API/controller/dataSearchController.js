const { DbUrl, DbName, soItemMoiPageAdmin, voucher, user, product, order, producttype, orderdetail, comment, orderhistorydetail,
    News, brands, question, category, datasearch, country, local } = require('../config/constant');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const assert = require('assert');
const ids = require('short-id');
const { BoDau } = require('../functionHoTro/index');

module.exports = {
    CapNhatTimKiem: async function (req, res) {
        const client = new MongoClient(DbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        const id = req.body.id;
        
        const dataSearchThem = {
            ten: req.body.search,
            lowerTen: BoDau(req.body.search),
            count: 1,
            idUser: []
        }

        await client.connect();
        console.log("Connected correctly to server");
        const db = client.db(DbName);
        const colDataSearch = db.collection(datasearch);
        let result = await colDataSearch.findOne({ lowerTen: dataSearchThem.lowerTen });

        if (result) {
            let ketqua = 0;
            let arrUser = result.idUser;
            if (id === undefined) {
                await colDataSearch.findOneAndUpdate({ lowerTen: dataSearchThem.lowerTen }, { $inc: { count: 1 } });
            } else {
                for (let index = 0; index < result.idUser.length; index++) {
                    if (result.idUser[index] === id) {
                        ketqua = 1;
                        break;
                    }
                }
                if (ketqua === 1) {
                    await colDataSearch.findOneAndUpdate({ lowerTen: dataSearchThem.lowerTen }, { $inc: { count: 1 } });
                } else {
                    arrUser.push(id);
                    await colDataSearch.findOneAndUpdate({ lowerTen: dataSearchThem.lowerTen }, {
                        $inc: { count: 1 }, $push: {
                            "idUser": id
                        }
                    });
                }
            }
        } else {
            if (id === undefined) {
                await colDataSearch.insertOne(dataSearchThem);
            } else {
                dataSearchThem.idUser.push(id);
                await colDataSearch.insertOne(dataSearchThem);
            }
        }
        client.close();

        res.status(200).json({
            status: 'success',
            message: 'C???p nh???t th??nh c??ng'
        });

    },

    LayDanhSachDataSearchShowPage: async function (req, res) {
        const client = new MongoClient(DbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

        await client.connect();
        console.log("Connected correctly to server");
        const db = client.db(DbName);
        const colDataSearch = db.collection(datasearch);
        let result = await colDataSearch.find().sort({ count: -1 }).limit(12).toArray();

        res.status(200).json({
            status: 'success',
            message: 'C???p nh???t th??nh c??ng',
            data: result
        });

    },

    LayDanhSachDataSearchGoiY: async function (req, res) {
        const client = new MongoClient(DbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

        await client.connect();
        console.log("Connected correctly to server");
        const db = client.db(DbName);
        const colDataSearch = db.collection(datasearch);
        let result = await colDataSearch.find().sort({ count: -1 }).limit(10).toArray();

        res.status(200).json({
            status: 'success',
            message: 'L???y danh s??ch g???i ?? th??nh c??ng',
            data: result
        });
    },

    LayDanhSachDataSearchLichSuTimKiem: async function (req, res) {
        const client = new MongoClient(DbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        const id = req.query.id;
        await client.connect();
        console.log("Connected correctly to server");
        const db = client.db(DbName);
        const colDataSearch = db.collection(datasearch);
        let result = await colDataSearch.find({ idUser: id }).sort({ _id: -1 }).limit(5).toArray();

        res.status(200).json({
            status: 'success',
            message: 'L???y danh s??ch l???ch s??? t??m ki???m th??nh c??ng',
            data: result
        });
    },
}