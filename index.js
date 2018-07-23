const express=require('express');
const cors =require('cors');
const mysql=require('mysql');
const bodyParser = require('body-parser');
const app = express();
const multer=require('multer');
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads/');
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname+'-'+ Date.now()+ file.originalname);
    }
});
const upload=multer({storage:storage});
const con= mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'crudmern'
});
con.connect(err=>{
    if(err){
        return err;
    }
});
app.use(cors());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:false})); 
app.use('/upload',express.static('uploads'));
/* app.use((req,res)=>{
    res.header("Access-Control-Allow-Origin","*"); 
   res.header("Access-Control-Allow-Headers",
"Origin, X-Requested-With, Content-Type, Accept, Authorization");
if(req.method==='OPTIONS'){
   res.header("Access-Control-Allow-Methods","PUT,POST,PATCH,DELETE,GET");
}
}); */
app.get('/file',(req, res)=>{
    const selectall="select * from fu";
    con.query(selectall,(err, result)=>{
        if(err){
            return res.send(err)
        }else{
            return res.json({
                data:result
            })
        }
    });
    });
app.post('/file/add',upload.single('file'),(req, res)=>{
    console.log(req.file); 
    console.log(req.body); 
   const input=JSON.parse(JSON.stringify(req.body));
   const data={
    nama:input.name,
    fileupload:req.file.path
};          
            const insert="insert into fu set ?";
            con.query(insert,data,(err, results)=> {
                if(err){
                    return res.send(err)
                }else{
                    return res.send('file ditambahkan')
                }
            });   
});
app.post('/file/edit',(req, res)=>{
    console.log(req.body); 
   const input=JSON.parse(JSON.stringify(req.body));
   const data={
    id:input.id,
    nama:input.nama,
    fileupload:input.fileupload
};          
            const update="update fu set ? where id= ?";
            con.query(update,[data, data.id],(err, results)=> {
                if(err){
                    return res.send(err)
                }else{
                    return res.send('file diubah')
                }
            });   
});

app.post('/file/delete',(req, res)=>{
    const input=JSON.parse(JSON.stringify(req.body));
    console.log('Deleting '+input.id+' .....');
    const data={
        id:input.id
 };
    const dltfu="DELETE FROM fu WHERE id = ?";
    con.query(dltfu,[data.id],(err, results)=> {
        if(err){
            return res.send(err)
        }else{
            return res.send('Data dihapus')
        }
    }); 
    });
app.listen(4000,()=>{
    console.log('File server listening on port 4000')
});
