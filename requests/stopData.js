const request = require('request');
var stops= ["9021014001960000","9021014001970000","9021014001961000","9021014004490000"];

function getAllStops(token,stop,callback){
  let d = new Date();
  let i = stop;
  let date =d.getFullYear()+ '-'+(d.getMonth()+1) +'-'+d.getDate();
  let time = d.getHours() + '%3A'+ d.getMinutes();

    let getStopOptions={
        url:'https://api.vasttrafik.se/bin/rest.exe/v2/departureBoard?id='+stops[i]+'&date='+date+'&time='+time+'&timeSpan=60&maxDeparturesPerLine=1&format=json',
        headers:{
          Authorization:token
        }
    }



      request(getStopOptions, (error, response, body) => {
        let stopdata = [];
        let data={};
        if(body === undefined){
          stopdata[0]={line:'',destination:'Error',time:'',track:'',bgcolor:'',txtcolor:''};
          data = {stop:'Error',stopData:stopdata};
        }else{
          if(JSON.parse(body).DepartureBoard.Departure!= undefined){

            let departures =JSON.parse(body).DepartureBoard.Departure;
           if(departures.sname!=undefined){
	     console.log("time:");
             stopdata[0]={line:departures.sname,destination:departures.direction,time:departures.time,track:departures.track,bgcolor:departures.bgColor,txtcolor:departures.fgColor};
           }else{
              for(j = 0;j<departures.length;j++){
                let dep = departures[j];
                
		if("rtTime" in dep){
		 dep.time = dep.rtTime;
		}
		console.log(dep);
		stopdata[j]={line:dep.sname,destination:dep.direction,time:dep.time,track:dep.track,bgcolor:dep.bgColor,txtcolor:dep.fgColor};

              }
          }
          }else{

            stopdata[0]={line:'',destination:'No available transportation',time:'',track:'',bgcolor:'',txtcolor:''};


        }
          switch (stop) {
            case 0:
              data = {stop:'Chalmers',stopData:stopdata};
              break;
            case 1:
              data = {stop:'Chalmers tvärgata',stopData:stopdata};
              break;
            case 2:
              data = {stop:'Chalmersplatsen',stopData:stopdata};
            case 3:
              data = {stop:'Lindholmen',stopData:stopdata};
              break;
            default:

          }
        }
        callback(data);
      });

  }


module.exports = {getStops:getAllStops};
