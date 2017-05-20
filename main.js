var statusQueue = {};

function cleanStatus(id, milli, $btn){
  clearInterval(statusQueue[id + "_" + milli]);
   changeBtn($btn, 0, id);
   delete statusQueue[id + "_" + milli];
}

function changeBtn($btn, toDo, id){
  var running = Number($btn.attr("running"));
  switch(toDo){
    case 0:
      $btn.attr("running", --running);
      break;
    case 1:
        $btn.attr("running", ++running);
        break;
  }

  $btn.text("Processo " + id + " - Rodando: " + running);
}

function status(id, milli, $btn){
  console.log("GETTING STATUS: " + id + "-" + milli);
  $.ajax({
    "xhrFields": {
        withCredentials: true
    },
    "url": "http://127.0.0.1:9000/manager/status",
    "data": {"id": id, "milli": milli},
    "type": "GET",
    "dataType": "json",
    "success": function(response){
      if(response.status === "stoped")
        cleanStatus(id, milli, $btn);
    }
  });
}

function run(id, $btn){
  var d = new Date().getTime();
  changeBtn($btn, 1, id);
  $.ajax({
    "xhrFields": {
        withCredentials: true
    },
    "url": "http://127.0.0.1:9000/manager/run",
    "data": {"id": id, "milli": d},
    "type": "GET",
    "dataType": "json",
    "success": function(response){
      console.log(response);
      if(response.status === "running")
        createStatus(id, d, $btn);
    }
  });
}

function createStatus(id, milli, $btn){
  var s = setInterval(function(){
    status(id, milli, $btn);
  }, 2000);
  statusQueue[id + "_" + milli] = s;
}

$(document).ready(function(){
  var $btn1 = $("#button_run_1");
  $btn1.attr("running", 1);
  changeBtn($btn1, 0, 1);
  $btn1.on("click", function(){
     run(1, $btn1);
  });

  var $btn2 = $("#button_run_2");
  $btn2.attr("running", 1);
  changeBtn($btn2, 0, 2);
  $btn2.on("click", function(){
     run(2, $btn2);
  });

});
