const dotenv = require("dotenv");
const { connectToMongo } = require("./db");
const { Laptop } = require("./models/Laptop");

dotenv.config();

const seedData = [
  {
    ten: "ASUS TUF Gaming F15",
    danhMuc: "Laptop",
    hang: "ASUS",
    cpu: "Intel Core i7-12700H",
    ramGB: 16,
    oCung: "SSD 512GB",
    manHinh: "15.6\" FHD 144Hz",
    cardDoHoa: "NVIDIA GeForce RTX 4060 8GB",
    giaVND: 28990000,
    tonKho: 12,
    hinhAnhUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    moTa: "Phù hợp gaming và làm đồ hoạ, tản nhiệt tốt."
  },
  {
    ten: "Dell Inspiron 14",
    danhMuc: "Laptop",
    hang: "Dell",
    cpu: "Intel Core i5-1335U",
    ramGB: 16,
    oCung: "SSD 512GB",
    manHinh: "14\" FHD+",
    cardDoHoa: "Intel Iris Xe",
    giaVND: 18490000,
    tonKho: 20,
    hinhAnhUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
    moTa: "Gọn nhẹ, pin ổn, phù hợp học tập và văn phòng."
  },
  {
    ten: "Lenovo Legion 5",
    danhMuc: "Laptop",
    hang: "Lenovo",
    cpu: "AMD Ryzen 7 7840HS",
    ramGB: 16,
    oCung: "SSD 1TB",
    manHinh: "15.6\" QHD 165Hz",
    cardDoHoa: "NVIDIA GeForce RTX 4070 8GB",
    giaVND: 35990000,
    tonKho: 7,
    hinhAnhUrl: "https://images.unsplash.com/photo-1484788984921-03950022c9ef",
    moTa: "Hiệu năng cao cho game và render, màn hình QHD sắc nét."
  },
  {
    ten: "Apple MacBook Air M2",
    danhMuc: "Laptop",
    hang: "Apple",
    cpu: "Apple M2",
    ramGB: 8,
    oCung: "SSD 256GB",
    manHinh: "13.6\" Liquid Retina",
    cardDoHoa: "Apple GPU",
    giaVND: 24490000,
    tonKho: 10,
    hinhAnhUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
    moTa: "Mỏng nhẹ, êm, pin rất tốt cho làm việc di động."
  },
  {
    ten: "HP Pavilion 15",
    danhMuc: "Laptop",
    hang: "HP",
    cpu: "Intel Core i5-12450H",
    ramGB: 8,
    oCung: "SSD 512GB",
    manHinh: "15.6\" FHD",
    cardDoHoa: "NVIDIA GeForce GTX 1650",
    giaVND: 16990000,
    tonKho: 14,
    hinhAnhUrl: "https://images.unsplash.com/photo-1504707748692-419802cf939d",
    moTa: "Cân bằng giá/hiệu năng, chơi game nhẹ và học tập."
  }
];

async function run() {
  await connectToMongo(process.env.MONGODB_URI);
  await Laptop.deleteMany({});
  await Laptop.insertMany(seedData);
  process.stdout.write(`Đã seed ${seedData.length} sản phẩm.\n`);
  process.exit(0);
}

run().catch((e) => {
  process.stderr.write(`${e?.message || e}\n`);
  process.exit(1);
});

