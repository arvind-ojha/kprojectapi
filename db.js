const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose')
const csv = require('csv-parser')
const fs = require('fs');

let fileName = '';
const results = [];
const storage = multer.diskStorage({
    destination:function(req,file,res){
     res(null,__dirname+'/public/upload')
    },
    filename:function(req,file,res){
      fileName=file.originalname;
      res(null,fileName)
    }
})
const fileFilter =(req,file,cb)=>{
    if(file.mimetype==='text/csv'){
        cb(null,true)
    }else{
        cb(new Error('file type is not supported'),false)
    }
}
const upload=multer({storage:storage,fileFilter:fileFilter,limits:{fileSize:1024*1024*6}})

const app = express();
app.use(express.static('public'));
mongoose.connect(
'mongodb://localhost:27017/sampleCsvDB'
, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

const fileSchema = {
  Username:String,
  Accuracy:String,
  Base_payout:String
}


const File = mongoose.model('File',fileSchema)

app.post('/',upload.single('fileUpload'), (req, res) => {
fs.createReadStream(__dirname+'/public/upload'+'/' + fileName)
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    results.forEach(function(item){ 
      const newFile = new File({
        Username:item.Username,
        Accuracy:item.Accuracy,
        Base_payout:item.Base_payout
       
      })
      newFile.save()
    })
      res.send('done')
   });
});


app.listen(3000, () => {
    console.log(`Server started on port`);
})