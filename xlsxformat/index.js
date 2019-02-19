const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');
const reg = /\s+/g; // 1

// 删除本地文件
const deleteDir = path => {
  let files = [];
  if(fs.existsSync(path)){
    files = fs.readdirSync(path);
    files.forEach((file, index) => {
      let curPath = `${path}/${file}`;
      if(fs.statSync(curPath).isDirectory()){
        deleteDir(curPath); //递归删除调用
      } else {
        fs.unlinkSync(curPath); //删除文件
      }
    });
    fs.rmdirSync(path); // 删除目录
  }
};

// 字符前后去空
const valFontEndFormat = val => {
  const r = /(^\s*)|(\s*$)/g;
  return (val + '').replace(r, '').replace(reg, ' ');
};

// 新建目录
const mkdir = path => {
  fs.mkdir(path, (err) => {
    console.log('mkdir: ', path);
  });
};

// 删除、新建sitemap目录
deleteDir(path.resolve(__dirname, './xxxxxx/xxxxxx'));
mkdir(path.resolve(__dirname, './xxxxxx/xxxxxx'));

// 内容模板如xml
let date = new Date();
const day = date.getDate();
const month = date.getMonth() + 1;
date = `${date.getFullYear()}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
const urlsetStart = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">';
const urlsetEnd = '</urlset>';
// 内容模板单元
const getXml = function (name, keyword) {
  const kw = keyword.replace(reg, '-').replace(/\&/g, '&amp;');
  const xml = [
    '\t<url>',
    '\t\t<loc>',
    `${'\t\t\t'}https://xx.xxx.com/${name}/${kw}`,
    `\t\t</loc><lastmod>${date}</lastmod>`,
    '\t</url>'
  ];
  return xml.join('\r');
};

const suffixs = [ 'xlsx', 'csv' ]; // 可转换类型配置
const dataPath = 'original-data'; // 原数据目录名定义
// 文件生成，如json文件生成、xml文件生成-运行函数
const createFiles = function(xs, directory) {
  const size = 49998;
  xs.forEach(fileName => {
    const nArr = fileName.split('.');
    const suffix = nArr[1];
    if (suffixs.indexOf(suffix) >= 0) {
      const name = nArr[0];
      const workbook = XLSX.readFile(path.resolve(__dirname, `./${dataPath}/${directory}/${name}.${suffix}`));
      const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      const key = valFontEndFormat(Object.keys(sheet[0])[0]);
      const words = [ key ];
      const wObj = {};
      let xmls = [];
      let xsPc = [];
      let count = 0;
      
      sheet.forEach(function(item, idx) {
        const val = valFontEndFormat(item[key]);
        const vKey = '_' + (val.replace(reg, '_').replace(/\&/g, '&amp;'));
        if (!wObj[vKey]) {
          count++;
          words.push(val);
          wObj[vKey] = true;
          // xml处理
          if (count % size === 1) { // 新xml文件
            xmls = [ xmlHeader, urlsetStart ];
            xsPc = [ xmlHeader, urlsetStart ];
            if (idx === 0) { // 某路径分类第一个词
              xmls.push(getXml(name, key))
              xsPc.push(getPcXml(name, key))
            };
            xmls.push(getXml(name, val));
            xsPc.push(getPcXml(name, val));
          } else {
            xmls.push(getXml(name, val));
            xsPc.push(getPcXml(name, val));
            if (count % size === 0 || (idx + 1) >= sheet.length) {
              xmls.push(urlsetEnd);
              xsPc.push(urlsetEnd);
              const pgSize = Math.ceil(count / size);
              // 生成xml文件
              fs.writeFileSync(path.resolve(__dirname, `./sitemap/sitemap/seo-${name}-${pgSize}.xml`), xmls.join('\r'));
              fs.writeFileSync(path.resolve(__dirname, `./sitemap/pc_sitemap/seo-${name}-${pgSize}.xml`), xsPc.join('\r'));
            }
          }
        }
      });
      // 生成json文件
      fs.writeFileSync(path.resolve(__dirname, `../config/words/${directory}/${name}.json`), JSON.stringify({ words }, null, 2));
      console.log(`${fileName} done !!!`)
    }
  });
};

const xs = fs.readdirSync(path.resolve(__dirname, `./${dataPath}/xxxxxx`));
createFiles(xs, 'xxxxxx');

console.log('files create done');
