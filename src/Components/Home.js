import React,{useState,useEffect} from "react";
import "../Styles/home.css";
import { Button } from 'react-bootstrap';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Axios from "axios";
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import ReactJson from 'react-json-view'

function Home(){


const [next,setNext] = useState(false);
const [screenN,setScreenN] = useState(1);
const [showSpin,setShowSpin] = useState(false);
const [nextInput,setNextInput] = useState(false);
const [showSugg,setShowSugg] = useState(false);
const [inter,setInter] = useState("");
const [suggArr,setArr] = useState([]);
const [finalArr,setFinalArr] = useState([]);
const [disable,setDisable] = useState(false);
const [showFinal,setshowFinal] = useState(false);
const [jsonResp,setjsonResp] = useState("");
const [detail,setDetail] = useState({
    name:"",
    email:""
})
const [err,setErr] = useState("");


//proceed next after enter press

function handlePress(e){
  
    if(e.key==="Enter"){
        setScreenN(2);
        setShowSpin(true);
        setTimeout(() => {
            setShowSpin(false);  
        }, 500);
    }
}


//set input value state

function changeD(e){
    setDetail({
        ...detail,
        [e.target.name]:e.target.value
    })
}

//proceed next after enter press

function handlePress2(e){
    if(e.key==="Enter"){
        
        showAuto();
    }
}


//proceed to screen3

function showAuto(){
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if(regex.test(detail.email)){
        setScreenN(3);
        setShowSpin(true);
        setTimeout(() => {
            setShowSpin(false);  
        }, 500);
    }
    else{
     setErr("Please enter a valid email");
     setTimeout(() => {
         setErr("");
     }, 1200);
    }
   
}


//auto suggestions

function changeSuggestions(e){

    setInter(e.target.value);
    if(e.target.value.length>=2){
        autocom(e.target.value)
    }
       

    
    
    
}


//get requests to auto suggestion api

const autocom = async (x) => {
    await Axios.get("https://webit-keyword-search.p.rapidapi.com/autosuggest",
    {
     params:{
         q:x,
         language:"en"
     },
     headers:{
        'x-rapidapi-host': 'webit-keyword-search.p.rapidapi.com',
        'x-rapidapi-key': '28728db04dmsh34d3f140dd059fap1c388ejsn7288577afcf7'
         }
    })
    .then(function(res){
        console.log(res.data.data.results);
        setArr(res.data.data.results);
    })
}


//add selected suggestions to a array

function addToList(x){
    if(finalArr.length<3){
        setFinalArr((prev)=>{
            return [...prev,x]
        })
    }
    if(finalArr.length===2){
        setArr([]);
    }

}


//delete a suggestion

function deleteIt(x){
   console.log(x);
   setFinalArr(finalArr.filter(item => item !== x));
   
}


//final post request to register api

const finalsubmit = async (x) => {
    setDisable(true);
    console.log(detail.name);
    console.log(detail.email);
    console.log(finalArr);
    await Axios({
    method:"post",
    url:"https://testpostapi1.p.rapidapi.com/testBatmanApi/name/register",
    data:{
     name:detail.name,
     email:detail.email,
     interests:finalArr
    },
    headers:{'x-rapidapi-host': 'testpostapi1.p.rapidapi.com',
    'x-rapidapi-key': '28728db04dmsh34d3f140dd059fap1c388ejsn7288577afcf7'
    }
    })
    .then(function(res){
        console.log(res.data);
        setshowFinal(true); 
        setjsonResp(res.data);
        setDisable(false);
       
    })
}



function moveNext(){
    setNext(true);
    setShowSpin(true);
    setTimeout(() => {
        setShowSpin(false);  
    }, 500);

}

//show this until we have all the data

if(!showFinal){
    return(
        !next&&!showSpin ? <div className="mainH"> <h1>hello.</h1>
            {/* <CircularProgress /> */}
      
            <Button variant="outline-light" onClick={moveNext}>let's Go</Button></div>: next&&showSpin ? <div className="secondH">
            <LinearProgress style={{width:"50%"}} />
      
            </div> : 
            next&&!showSpin&&screenN===1 ?

            <div className="secondH">
            <h1>tell us about yourself. You are {detail.name} ?</h1>
            <div className="inputaH">
             <input name="name" type="text" className="form-control" placeholder="name please" onKeyPress={handlePress} onChange={changeD} value={detail.name} />
            <ArrowForwardIcon style={{fontSize:40,cursor:"pointer"}} onClick={()=>{setScreenN(2);
            setShowSpin(true);
            setTimeout(() => {
            setShowSpin(false);  
            }, 500);
            }} /> 
            </div>
            </div> : 

            next&&showSpin&&screenN===2 ? 
            <div className="secondH">
            <LinearProgress style={{width:"50%"}} />
      
            </div> :
             
            next&&!showSpin&&screenN===2 ?
            <div className="secondH">
            <h1>hello {detail.name}.</h1>
            <p style={{color:"red",margin:0}}>{err}</p>
            <div className="inputaH">
            <input name="email" className="form-control" placeholder="email please" onKeyPress={handlePress2} onChange={changeD} value={detail.email} />
            <ArrowForwardIcon style={{fontSize:40,cursor:"pointer"}} onClick={showAuto} /> 
             </div>
             </div> :
             
             next&&showSpin&&screenN===3 ? 
            <div className="secondH">
            <LinearProgress style={{width:"50%"}} />
      
            </div> :

             
             <div className="secondH">
             <h1>select any 3 interests {detail.name}.</h1>
             <div className="inputaH2">
             <div style={{display:"flex",flexDirection:"row",alignItems:"center",marginBottom:20}}> 
             <input name="interests" className="form-control" placeholder="what interests you?" value={inter} onChange={changeSuggestions} />
             <div style={{display:"flex",flexDirection:"row",alignItems:"center"}}>
             {/* display auto suggestions */}
             {
              finalArr.map((val,index)=>{
                  return <p key={index} onClick={()=>{deleteIt(val)}} style={{backgroundColor:"#f4f5db",color:"#252525",marginRight:10,marginBottom:0,cursor:"pointer",padding:5,borderRadius:8}} >{val}</p>
              })
             } 
             </div>
             {disable ? <CircularProgress /> :<ArrowForwardIcon style={{fontSize:40,cursor:"pointer"}} onClick={finalsubmit} />}
             
             </div>

            {/* display selected interests seperately  */}
            
            <div className="autoS">
             {
                 suggArr.map((sugg,index)=>{
                     return <p key={index} onClick={()=>{addToList(sugg)}}>{sugg}</p>
                 })
             }
             </div>
             </div>
             </div>
            
            
        );
}

//display the final data

else{
    return(
    <div className="mainH">
    <div>
    <div>
    <h1>Data Captured</h1>
      <p>Name : {detail.name}</p>
      <p>Email : {detail.email}</p>
      <p>Interests : {finalArr[0]}, {finalArr[1]}, {finalArr[2]}</p>
    </div>
    <div>
    <h1>Response recieved</h1>
      <ReactJson src={jsonResp} theme="monokai" />
    </div>
    </div>

    </div>);
}



}


export default Home;