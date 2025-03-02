// ./db/db.js:
// conexion con mongoose
import mongoose from "mongoose";

const connectMongoDB = async() => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  console.log("conectado correctamente a MongoDB!");
  } catch (error) {
    console.log("Error al conectar con MongoDB: ", error.message);
  }
}

export default connectMongoDB;