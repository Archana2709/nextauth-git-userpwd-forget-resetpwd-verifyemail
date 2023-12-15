import mongoose from "mongoose";//projectname in mongodb--next-auth ,DBname-AuthMongoNext,tablename-users

const connect = async () => {
  if (mongoose.connections[0].readyState) return;

  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected")
  } catch (error) {

    throw new Error("Error connecting to Mongoose");
  }
};
export default connect;