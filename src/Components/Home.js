import React,{useState,useEffect} from "react";
import "../Styles/home.css";
import { Button } from 'react-bootstrap';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Axios from "axios";
import ReactJson from 'react-json-view'

function Home(){


const [next,setNext] = useState(false);
const [screenN,setScreenN] = useState(1);
const [nextInput,setNextInput] = useState(false);
const [showSugg,setShowSugg] = useState(false);
const [inter,setInter] = useState("");
const [suggArr,setArr] = useState([]);
const [finalArr,setFinalArr] = useState([]);
const [showFinal,setshowFinal] = useState(false);
const [jsonResp,setjsonResp] = useState("");
const [detail,setDetail] = useState({
    name:"",
    email:""
})


//proceed next after enter press

function handlePress(e){
  
    if(e.key==="Enter"){
        setScreenN(2);
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
   setScreenN(3);
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
       
    })
}

//show this until we have all the data

if(!showFinal){
    return(
        !next ? <div className="mainH"> <h1>hello.</h1>
            <Button variant="outline-light" onClick={()=>{setNext(true)}}>let's Go</Button></div>:
            <div className="secondH"><h1>tell us about yourself.</h1>
        
            {/* screen 1 */}
            {screenN===1 ? 
            <div className="inputaH">
             <input name="name" className="form-control" placeholder="name please" onKeyPress={handlePress} onChange={changeD} value={detail.name} />
            <ArrowForwardIcon style={{fontSize:40,cursor:"pointer"}} onClick={()=>{setScreenN(2)}} /> </div> : 

            //screen 2

            screenN===2 ?
            <div className="inputaH">
            <input name="email" className="form-control" placeholder="email please" onKeyPress={handlePress2} onChange={changeD} value={detail.email} />
            <ArrowForwardIcon style={{fontSize:40,cursor:"pointer"}} onClick={showAuto} /> 
             </div> :

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
             <ArrowForwardIcon style={{fontSize:40,cursor:"pointer"}} onClick={finalsubmit} />
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
        
              }
        
        
        
            
        
                
            </div>
            
            
        )
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