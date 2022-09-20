import mongo from "mongodb";

  let connection_string = "mongodb+srv://admin:admin2022@cluster0.xyqortd.mongodb.net/?retryWrites=true&w=majority";
  //let connection_string = 'mongodb://localhost:27017/goodfood';

let client = new mongo.MongoClient(connection_string, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db = null;
export default () => {
  return new Promise((resolve, reject) => {

    if (db && client.isConnected()) {  // ako je baza inicijalizirana i klijnt spojen
      resolve(db);
    } 
    
    else {
      client.connect((err) => {
        if (err) {
          reject("Db connection error: " + err);
        } 
        
        else {
          console.log("Db connected successfully!");
          db = client.db("goodfood");
          resolve(db);
        }
      });
    }
  });
};
