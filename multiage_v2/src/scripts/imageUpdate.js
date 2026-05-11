// scripts/imageUpdate.js
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME || 'your_database_name';

const client = new MongoClient(MONGO_URI);

const imageMap = {
  "Apple iPhone 11": [
    "https://res.cloudinary.com/delaridge/image/upload/v1777051011/vvujmssqgtoddscpp34m.png",
    "https://res.cloudinary.com/delaridge/image/upload/v1777051002/vswtngapwmqfwc7tpf3c.png",
    "https://res.cloudinary.com/delaridge/image/upload/v1777051002/jxnfroq6zqxzwrivul0h.png",
    "https://res.cloudinary.com/delaridge/image/upload/v1777051005/kc5p5zbigzpeecnwynbi.png"
  ],
  "Apple iPhone 11 Pro": [
    "https://res.cloudinary.com/delaridge/image/upload/v1777050832/mth5qvj3gt5nl1bo7sad.png",
    "https://res.cloudinary.com/delaridge/image/upload/v1777050964/yozrqipcavqpuemugdrs.png",
    "https://res.cloudinary.com/delaridge/image/upload/v1777050990/szvjbssruavwrcm4zeof.jpg",
    "https://res.cloudinary.com/delaridge/image/upload/v1777050993/szeoshekv7ogtwyzqy4x.jpg"
  ],
  "Apple iPhone 11 Pro Max": [
    "https://res.cloudinary.com/delaridge/image/upload/v1777050832/mth5qvj3gt5nl1bo7sad.png",
    "https://res.cloudinary.com/delaridge/image/upload/v1777050964/yozrqipcavqpuemugdrs.png",
    "https://res.cloudinary.com/delaridge/image/upload/v1776476120/xaszem4cyofqzavciboy.png",
    "https://res.cloudinary.com/delaridge/image/upload/v1777050833/tuox5xrj9prxxamttovh.png"
  ],
  "Apple iPhone 12": [
    "https://res.cloudinary.com/delaridge/image/upload/v1777051002/jxnfroq6zqxzwrivul0h.png",
    "https://res.cloudinary.com/delaridge/image/upload/v1776476086/ylcq0pzmaz3hseevetnn.png",
    "https://res.cloudinary.com/delaridge/image/upload/v1776476111/wiudhdfuts7jw4xkgv59.png",
    "https://res.cloudinary.com/delaridge/image/upload/v1776476117/yvfz6fucjcbtwvsaqyqy.png"
  ],
  "Apple iPhone 16": [
    "https://res.cloudinary.com/delaridge/image/upload/v1776476120/zw1igymgvier5ay4kvfh.png",
    "https://res.cloudinary.com/delaridge/image/upload/v1777050944/rfoq66abzcdz7b0ql7zb.png",
    "https://res.cloudinary.com/delaridge/image/upload/v1777051009/ajb6klclawbwmcoshtah.png",
    "https://res.cloudinary.com/delaridge/image/upload/v1777057356/ryj9t6ckszzv0kyhvp99.png"
  ],
  "Apple iPhone 16 Plus": [
    "https://res.cloudinary.com/delaridge/image/upload/v1777051009/ajb6klclawbwmcoshtah.png",
    "https://res.cloudinary.com/delaridge/image/upload/v1777057356/ryj9t6ckszzv0kyhvp99.png",
    "https://res.cloudinary.com/delaridge/image/upload/v1777057356/ryj9t6ckszzv0kyhvp99.png",
    "https://res.cloudinary.com/delaridge/image/upload/v1776476120/zw1igymgvier5ay4kvfh.png"
  ],
  "Apple iPhone 16 Pro": [
    "https://res.cloudinary.com/delaridge/image/upload/v1777050997/nujhfnqmtsg2oftzqcad.png",
    "https://res.cloudinary.com/delaridge/image/upload/v1777051005/gmdjyhws8xxnk4cebfze.png",
    "https://res.cloudinary.com/delaridge/image/upload/v1777051007/kkoo6d1wxgnmm62b9ozp.png",
    "https://res.cloudinary.com/delaridge/image/upload/v1777057832/n4xfgd6wrk3kj4y7i8o4.png"
  ],
  "Apple iPhone 16 Pro Max": [
    "https://res.cloudinary.com/delaridge/image/upload/v1777050996/ldevnp7vivjlifl8lhkd.jpg",
    "https://res.cloudinary.com/delaridge/image/upload/v1777051007/kkoo6d1wxgnmm62b9ozp.png",
    "https://res.cloudinary.com/delaridge/image/upload/v1777057832/n4xfgd6wrk3kj4y7i8o4.png",
    "https://res.cloudinary.com/delaridge/image/upload/v1777050996/ldevnp7vivjlifl8lhkd.jpg"
  ],
  "Apple iPhone 17": [
    "https://res.cloudinary.com/delaridge/image/upload/v1778124416/rjqx7fvvtlrnyljcloqb.jpg",
    "https://res.cloudinary.com/delaridge/image/upload/v1778124416/auh1mprrnkhvwd7utbct.jpg",
    "https://res.cloudinary.com/delaridge/image/upload/v1778124416/bonahgo1vlteqxipijja.jpg",
    "https://res.cloudinary.com/delaridge/image/upload/v1778124417/ubtjj7r9fsgqiqvlmdmd.png"
  ],
  "AirPods Pro 3": [
    "https://res.cloudinary.com/delaridge/image/upload/v1778473744/oyzijw9jgmh9cjztd2zp.jpg",
    "https://res.cloudinary.com/delaridge/image/upload/v1778473745/h38gzafwd2dgkrxswjyf.jpg",
    "https://res.cloudinary.com/delaridge/image/upload/v1778473743/yee35gjtdtrufvv7cubd.jpg",
    "https://res.cloudinary.com/delaridge/image/upload/v1778473743/ooownsea2rmblsextux9.jpg"
  ],
  "AirPods (3rd generation)": [
    "https://res.cloudinary.com/delaridge/image/upload/v1778472448/hodedcqftihjhe5gljah.jpg",
    "https://res.cloudinary.com/delaridge/image/upload/v1778472448/unmvxlrdogf6yertsxlj.jpg",
    "https://res.cloudinary.com/delaridge/image/upload/v1778472448/bpe0sqbi0rbkjmtlzxes.jpg",
    "https://res.cloudinary.com/delaridge/image/upload/v1778472448/hodedcqftihjhe5gljah.jpg"
  ],
  "Samsung Galaxy Buds4 Pro": [
    "https://res.cloudinary.com/delaridge/image/upload/v1778472939/fkywjgovt9c81pwdmvvr.jpg",
    "https://res.cloudinary.com/delaridge/image/upload/v1778472939/s6zbstgrz1to4orsj1uy.jpg",
    "https://res.cloudinary.com/delaridge/image/upload/v1778472938/k0lxcxeuld3nsiusqf6e.webp",
    "https://res.cloudinary.com/delaridge/image/upload/v1778472939/fkywjgovt9c81pwdmvvr.jpg"
  ],
  "Samsung Galaxy Buds4": [
    "https://res.cloudinary.com/delaridge/image/upload/v1778473191/jtq6gqzfcabnxtnl6esc.avif",
    "https://res.cloudinary.com/delaridge/image/upload/v1778473190/rnsb8rhdddjjk3dhsbmo.jpg",
    "https://res.cloudinary.com/delaridge/image/upload/v1778473190/ehdm6wozsoyylyiizxyc.jpg",
    "https://res.cloudinary.com/delaridge/image/upload/v1778473191/jtq6gqzfcabnxtnl6esc.avif"
  ],
  "Samsung Galaxy Buds Live": [
    "https://res.cloudinary.com/delaridge/image/upload/v1777681910/ybryn1zjtzenyaja5ke1.jpg",
    "https://res.cloudinary.com/delaridge/image/upload/v1777681912/pvpxh83dlku7es5jokdj.png",
    "https://res.cloudinary.com/delaridge/image/upload/v1777681914/hnvliqkb4zrfcfhq1nqb.png",
    "https://res.cloudinary.com/delaridge/image/upload/v1777681917/iarfjkqklps2wxauspkp.png"
  ],
  "Samsung Galaxy Buds Pro": [
    "https://res.cloudinary.com/delaridge/image/upload/v1778473503/e1jcvaxwi7ockcco7wnp.jpg",
    "https://res.cloudinary.com/delaridge/image/upload/v1778473502/z50lmmxu6ulidrmo6bix.jpg",
    "https://res.cloudinary.com/delaridge/image/upload/v1778473502/buofspbybhthcrnpia9e.jpg",
    "https://res.cloudinary.com/delaridge/image/upload/v1778473503/e1jcvaxwi7ockcco7wnp.jpg"
  ]
  // Add more products here following the same pattern
};

async function updateImages() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(DB_NAME);
    const productsCollection = db.collection('products');

    console.log(`🚀 Starting image update for ${Object.keys(imageMap).length} products...\n`);

    let updated = 0;

    for (const [name, images] of Object.entries(imageMap)) {
      const result = await productsCollection.updateOne(
        { name: name },                       // Matching by name
        { 
          $set: { 
            images: images,
            updatedAt: new Date() 
          } 
        }
      );

      if (result.matchedCount > 0) {
        console.log(`✅ Updated: ${name}`);
        updated++;
      } else {
        console.log(`⚠️  Not found: ${name}`);
      }
    }

    console.log(`\n🎉 Done! Successfully updated ${updated} products.`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
    console.log('Database connection closed.');
  }
}

updateImages();