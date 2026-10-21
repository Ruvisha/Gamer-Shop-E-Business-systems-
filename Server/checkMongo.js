import mongoose from 'mongoose';

async function check() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/gamer_shop', { serverSelectionTimeoutMS: 3000 });
    console.log('Connected to MongoDB gamer_shop!');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in gamer_shop:', collections.map(c => c.name));
    for (const c of collections) {
      const count = await mongoose.connection.db.collection(c.name).countDocuments();
      console.log(`- ${c.name}: ${count} documents`);
      if (c.name === 'products') {
        const sample = await mongoose.connection.db.collection('products').find({}).limit(2).toArray();
        console.log('Sample product:', JSON.stringify(sample, null, 2));
      }
    }
    const adminDb = mongoose.connection.db.admin();
    const dbs = await adminDb.listDatabases();
    console.log('All databases in MongoDB instance:', dbs.databases.map(d => `${d.name} (${d.sizeOnDisk} bytes)`));
    process.exit(0);
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
}

check();
