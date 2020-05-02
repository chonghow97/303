
// local storage declaration
if (window.localStorage.getItem("profile") == null) {
    var profile = new Object();
    window.localStorage.setItem("profile", JSON.stringify(profile));
    window.localStorage.setItem("count", "0");
}

display();
$('form').submit(function () {
    //calling confirmation api [title = Are you sure, caption= click yes to record callback function performed]
    
    navigator.notification.confirm("click YES to record.", callback, "Are you Sure?", ["YES", "Let me think"]);
})



function callback(button) {
    switch (button) {
        case 1:
        //YES
        //save
        window.localStorage.setItem("profile", JSON.stringify(storearray()));
        alert("submit success!")
        window.location.href = "./index.html";
        break;
        case 2:
        //Letme think
        return 0;
        break;
        default:
        break;
    }
}
function storearray() {
    //parse count into int
    var count = parseInt(localStorage.getItem("count"));
    //declare empty array
    var arr = [];
    // change to json
    var users = JSON.parse(localStorage.getItem("profile"));
    //for each loop to get all value
    $.each($('form').serializeArray(), function (i, field) {
        //add all value to array
        arr.push(field.value);
    })
    // assign array to object
    Object.assign(users, { ["u"+count]: arr });
    //adder
    count++;
    //save count value
    window.localStorage.setItem("count", count.toString());
    return users;
}

function display() {
    var str = "";
    //get
    var users = JSON.parse(localStorage.getItem("profile"));
    $.each(users,function (i,j) {
        str += `<tr class='list' id="${i}"> <td>${j[0]}</td> <td>${j[1]}</td> <td>${j[2]}(${j[3]})</td> <td>${j[4]}</td><td class="edit" id="${i}">${j[5]}</td> <td>${j[6]}</td> <td><input type="button" onClick="DataDelete('${i}');" value="Delete"></input> </tr>`;
    })
    
    

    $("#display").append(str);
    //idea from https://www.w3schools.com/jquery/jquery_filters.asp
    $("#search").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $(".list").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
}

function DataDelete(i) {
    window.textD = i;    
    navigator.notification.confirm("Press yes to delete", callback1, "Are you Sure want to delete?", ["YES", "Let me think"]);
}

function callback1(button) {
    switch (button) {
        case 1:
        //YES
        var users = JSON.parse(localStorage.getItem("profile"));
        delete users[window.textD];
        window.localStorage.setItem("profile", JSON.stringify(users));
        //save
        
        window.location.href = "./index.html";
        break;
        case 2:
        //Letme think
        return 0;
        break;
        default:
        break;
    }
}

$(".edit").dblclick(Update);

function Update(e) {
    //disable listner to prevenet another data update
    $(".edit").off();
    e.stopPropagation();
    var id = this.id;
    var currentEle = $(this);
    var value = $(this).html();
    updateVal(currentEle, value, id);
}

function updateVal(currentEle,value,id) {
    //add in input element
    $(currentEle).html(`<input type="text" class="thval" value="${value}" />`);
    $(".thval").focus();
    $(".thval").keyup(function (event) {
        //if press enter
        if(event.keyCode == 13){
            //get database
            var users = JSON.parse(localStorage.getItem("profile"));
            //update html
            $(currentEle).html($(".thval").val().trim());
            //update value
            users[id][5] = $(currentEle).html();
            //save database
            window.localStorage.setItem("profile", JSON.stringify(users));
            //add back listener
            $(".edit").dblclick(Update);
        }
    });

}