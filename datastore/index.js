const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter.js');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, zeroCount) => {
    if (err) {
      throw err;
    } else {
      let file = path.join(exports.dataDir, zeroCount + '.txt');
      fs.writeFile(file, text, (err) => {
        callback(err, { id: zeroCount, text })
      });
    }
  });
};

exports.readAll = (callback) => {
  let array = [];
  fs.readdir(exports.dataDir, (err, filenames) => {
    if (err) {
      throw err;
    } else {
      filenames.forEach((file) => {
        //console.log(path.join(exports.dataDir, file));
        fs.readFile(path.join(exports.dataDir, file), (err, data) => {
          if (err) {
            throw err;
          } else {
            array.push(data);
          }
        })
      })
    }
  })
  callback(null, array);
  // let fileLength = fs.readdirSync(exports.dataDir).length;
  // for (let i = 0; i < fileLength; i++) {
  return array;
  // }
};

exports.readOne = (id, callback) => {
  fs.readdir(exports.dataDir, (err, filenames) => {
    filenames.forEach((file) => {
      if (file.slice(0, -4) === id) {
        console.log("FOUND IT !");
        fs.readFile(exports.dataDir + file, (err, data) => {
          return { id, text: data }
        })

      }
    })
  })
  return "error"
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
