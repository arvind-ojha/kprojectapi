const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.urlencoded({extended:true}))
mongoose.connect(
'mongodb://localhost:27017/sampleCsvDB'
    , {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});
const fileSchema = {
     Username: String,
     Accuracy: String,
     Base_payout: String
  }
  
  const File = mongoose.model('File',fileSchema)
  app.post('/csv', (req, res) => {
      const newFile = new File({
        Username: item.Username,
        Accuracy: item.Accuracy,
        Base_payout: item.Base_payout
      })
      newFile.save(function(err){
          if(!err){
              res.send('New Data has been added')
          }else{
              res.send('There is an error')
          }
      })
  });
app.route('/csv/:username')
    .get((req,res)=>{
    const data = req.params.username
    if(data==='all'){
        File.find({},function(err,result){
            if(!err){
                res.send(result)
            } else{
                res.send(err)
            }
        })
    }else{
        
        File.findOne({Username:data},function(err,result){
            if(!err){
                res.send(result)
            } else{
                res.send(err)
            }
        })

    }
         
    })
    .put(function(req,res){
        const data = req.params.username;
        console.log(req.body)
        File.update(
            {Username:data},
            req.body,
            {overwrite:1},
            function(err){
                if(!err){
                    res.send('Done')
                }

            }
            
            )
    })
    .patch(function(req,res){
        const data = req.params.username;
        File.update(
            {Username:data},
            {$set:req.body},
            function(err) {
                res.send('Patched Entry with Username ' + data)
            }
        )
    })
    .delete(function(req,res){
        const data = req.params.username
        if(data==='all'){
            File.remove({}, function(err) { 
                res.send('Collection Removed') 
             });
        }else{
            File.deleteOne(
                {Username:data},
                function(err) {
                    if(!err){
                        res.send('Removed Entry with Username ' + data)
                    }
                })
            
    
        }
})

app.listen(3000, () => {
    console.log(`Server started on port`);
});