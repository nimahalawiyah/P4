import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
class App extends Component {
  constructor(){
    super()
  this.state={
    title:"Upload File RESTful API MERN",
    index:'',
    selectedFile: null,
    fuis:[]
}
  }
  componentDidMount(){
    this.getfui();
  }
  getfui= _ =>{
    fetch('http://localhost:4000/file')
    .then(response=>response.json())
    .then(response=>this.setState({fuis:response.data}))
    .catch(err=>console.error(err))
  }

  pilihfoto=e=>{
    console.log(e.target.files[0]);
    this.setState({
      selectedFile:e.target.files[0]     
    })
  }
  insert=(e)=>{
    e.preventDefault();
    let data=new FormData();
    data.append('file', this.state.selectedFile);
    data.append('name', this.refs.nama.value);
    axios.post('http://localhost:4000/file/add',data)
    .then(console.log(data))
    .then(this.getfui)
    .catch(err=>console.error(err))
  }
  fEdit=(i)=>{
    let data=this.state.fuis[i];
    this.refs.eid.value=data.id;
    this.refs.enama.value=data.nama;
    this.refs.efoto.value=data.fileupload
    this.setState({
      index:i
    });
  }
  updatefu=(e)=>{
    e.preventDefault();
    let fileupload=this.refs.efoto.value;
    let nama=this.refs.enama.value;
    let id=this.refs.eid.value;
    fetch('http://localhost:4000/file/edit',{
      method:'post', 
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        id:id,
        fileupload:fileupload,
        nama:nama
      })
    })
    .then(console.log(id))
    .then(this.getfui)
    .catch(err=>console.error(err))
  }
  fRemove=(i)=>{
    fetch('http://localhost:4000/file/delete',{
      method:'post',
       headers:{
        'Content-Type':'application/json'
      }, 
      body:JSON.stringify({
        id:i
      })
    })
    .then(console.log('Deleting '+i+' .....'))
    .then(this.getfui)
    .catch(err=>console.error(err))
  }
  renderImageupload=({id,fui})=><div key={id}>{fui}</div>
  render() {
    const{fuis}=this.state;
    return (
      <div className="container">
       <h2>{this.state.title}</h2>
      <form ref="myform" encType="multipart/form-data">
        <input type="hidden" ref="idmatkul" className="formfield"/>
            <div className="form-group">
              <label>Nama:</label>
              <input type="text" ref="nama" placeholder="Nama" className="form-control"/>
            </div>
            <div className="form-group">
              <label>File:</label>
              <input type="file" ref="file" className="form-control" onChange={this.pilihfoto}/>
            </div>
        <button onClick={this.insert} className="btn btn-danger">Submit</button>
        </form>
        <div className="table-responsive">
      <table className="table table-dark table-striped">
      <thead>
      <tr>
        <td>No</td>
        <td>Nama</td>
        <td>Image</td>
        <td>Aksi</td>
        </tr>
        </thead>
        <tbody>
      {fuis.map((fui, id)=>
          <tr key={id}>
          <td>{id+1}</td>
          <td>{fui.nama}</td>
          <td>{fui.fileupload}</td>
          <td>
          <button onClick={()=>this.fRemove(fui.id)} className="btn btn-warning">Remove</button>
          <button data-toggle="modal" data-target="#myModal" onClick={()=>this.fEdit(id)} className="btn btn-primary">Edit</button></td>
          </tr>
          )}
          </tbody>
          </table>
          </div>


          <div className="modal fade" id="myModal" ref="myModal">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">Edit Data</h4>
          <button type="button" className="close" data-dismiss="modal">&times;</button>
        </div>
        <div className="modal-body">
        <form ref="emyform">
        <input type="hidden" ref="eid" className="formfield"/>
            <div className="form-group">
              <label>Nama:</label>
              <input type="text" ref="enama" placeholder="Mata Kuliah" className="form-control"/>
            </div>
            <div className="form-group">
              <label>Foto:</label>
              <input type="text" ref="efoto" placeholder="SKS" className="form-control"/>
            </div>
          <button onClick={this.updatefu} className="btn btn-danger">Update</button>
        </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
        </div>
        
      </div>
    </div>
  </div>
    

        </div>      
    );
  }
}

export default App;
