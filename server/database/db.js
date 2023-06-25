import mongoose  from "mongoose";
import 'dotenv/config';

const Connection = async () => {
  const URL = process.env.MONGO_URL;

  try {
    await mongoose.connect(URL, {useUnifiedTopology: true, useNewUrlParser: true});
    console.log("Datbase connected");
  } catch (error) {
    console.log('Error while connecting with the database', error);
  }
}

export default Connection;