let messages=[]
let userName="ÁlmosVagyok"
let url ="https://szofti-1-e-default-rtdb.europe-west1.firebasedatabase.app/messages"
let body={
    user:userName,
    time:'',
    message:''
}
let xhr = new XMLHttpRequest()
let messagesDiv;
function factoryRequest(method,url,body){
    xhr.onload = function() { feldolgozo(method)}
    url=url+".json"
    xhr.open(method, url, true)
    xhr.setRequestHeader('Content-Type',"application/json")
    xhr.send(JSON.stringify(body))
}

function feldolgozo(method){
    console.log(method,":",xhr.status,",",xhr.readyState)
    if (method == "get"){
        messages=JSON.parse(xhr.responseText)
        firebasePipe()
        render()
    }
}
function firebasePipe(){
    let uzenetek=[]    
    for (const key in messages) {
        console.log(messages[key])
        let uzenet = {
            key:key,
            user:messages[key].user,
            time:messages[key].time,
            message:messages[key].message
        }
        uzenetek.push(uzenet)   
    }
    messages=uzenetek
    }

function sendMessage(){
    let message = document.getElementById('message')
    console.log("Üzi:", message.value)
    let ido= new Date().toLocaleTimeString()

    let body={
        user:userName,
        time:ido,
        message:message.value
    }
    factoryRequest("post",url,body)
}

function render(){
    console.log("Üzenetek", messages)
    messagesDiv.innerHTML=""
    html=""
    for (const uzi of messages) {
        html+=`<div class="my-2 row ${uzi["user"]==userName?"d-flex justify-content-end":""}"><div class="col-6">
        <div class="row">
        ${uzi["user"]==userName?'<div class="col-6">':'<div class="col">'}`
        // for (const key in uzi) {
        //     html+='<div class="col">'+
        //     uzi[key]+'</div>'                
        //     }
        html+=`
        <div class="user">${uzi['user']}</div>
        <div class="message">${uzi['message']}</div>
        <div class="time">${uzi['time']}</div>
        </div>`
        html+=`${uzi["user"]==
        userName?`<div class="col-6"><button onclick="saveMessage('${uzi.key}')" type="button" class="btn btn-primary">Save</button><button onclick="deleteMessage('${uzi.key}')" type="button" class="btn btn-primary">Delete</button></div>`:''}`

        html+='</div></div></div>'
    }
    messagesDiv.innerHTML=html
    }

function deleteMessage(key){
    console.log("Key", key)
    factoryRequest("delete",url+"/"+key)
}

function getMessages(){
    factoryRequest("get",url)
}

function init(){
    document.getElementById('send').onclick=sendMessage
    messagesDiv=document.getElementById('messages')
    setInterval(function () {getMessages()},1000)
    getMessages()

}


init()