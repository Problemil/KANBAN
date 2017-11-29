// Logged in user
var userID;

// The projects object
var projects;

// Selected project 
var projectID;

// The users object
var users = {
    faroch: {name: 'Faroch Mehri', password: 'faroch'},
    ulrika: {name: 'Ulrika Månsson', password: 'ulrika'},
    anders: {name: 'Anders Hagelkvist', password: 'anders'}, 
    emil  : {name: 'Emil Wärdig Tsoukalas', password: 'emil'},
    joel  : {name: 'Joel Månesköld', password: 'joel'},
    janne : {name: 'Janne Kemi', password: 'janne'}
};

$(document).ready(function(){
    userID   = sessionStorage.getItem('userID');
    projects = localStorage.getItem('projects');
    projects = projects ? JSON.parse(projects) : [];
    
    if(userID) {
        var html;
        $('#header').append('<div onclick="signOut()"><i class="fa fa-sign-out"></i><br/>Logga ut</div>');
        html  = '<div class="projects"><div class="title">Projekten';
        html += '<span onclick="modalHTML(1)"><i class="fa fa-building">';
        html += '</i> Skapa</span></div><div id="pcontent"></div></div>';
        $('#main').html(html);
        showProjects();
        
    } else {
        $('#header').append('<div onclick="modalHTML(0)"><i class="fa fa-sign-in"></i><br/>Logga in</div>');
        $('#main').html('<h1 class="center">Kanban</h1>');
    }
    
    $(document).on('click', '.project', function(){
        $('.project').removeClass('pactive');
        $(this).addClass('pactive');
        projectID = $(this).index();
        showProject();
    });
});

// status: error eller success
var showMessage = function(status, message) {
    $(window).scrollTop(0);
    $('#message').html('<div class="'+status+'">'+message+'</div>');
    $('#message div').slideDown(400);
    $('.'+status).delay(4000).slideUp(400, function(){ $(this).remove(); });
};

// type:
// 0 => Sign In
// 1 => Create Project
var modalHTML = function(type, param) {
    var title;
    var content;
    
    if(type == 0) {
        title    = 'Logga in';
        content  = '<form><label>Användarnamn</label>';
        content += '<input id="username" type="text" />';
        content += '<label>Lösenord</label>';
        content += '<input id="password" type="password" />';
        content += '<div class="button" onclick="signIn()">Logga in</div><form>';     

    } else if(type == 1) {
        title    = 'Skapa projekt';
        content  = '<label>Projektnamn</label>';
        content += '<input id="pname" type="text" />';
        content += '<div class="button" onclick="createProject()">Skapa projekt</div>';
        
    } else return false;
    
    showModal(title, content);
};

var showModal = function(title, content) {
    var html; $('.modal').remove();
    html  = '<div class="modal"><div class="mcontent">';
    html += '<div class="mtitle">'+title+'<i class="fa fa-times" onclick="closeModal()"></i></div>';
    html += '<div class="mhtml">'+content+'</div></div></div>';
    $('body').prepend(html);
};

var closeModal = function(){ $('.modal').remove(); };

var signIn = function() {
    var username = $('#username').val().toLowerCase().trim();
    if(users[username]) {
        var password = $('#password').val();
        
        if(users[username].password == password) {
            sessionStorage.setItem('userID', username);
            window.location.reload();
            
        } else showMessage('error', 'Fel lösenord.');
        
    } else showMessage('error', 'Fel användarnamn.');
};

var signOut = function() {
    sessionStorage.removeItem('userID');
    window.location.reload();
};

var createProject = function() {
    var pname = $('#pname').val().trim();
    if(pname == '') showMessage('error', 'Ange projektnamn!');
    else {
        var temp = {
            name   : pname,
            column0: [],
            column1: [],
            column2: [],
            column3: [],
            issues : [],
            logbok : ['['+(new Date()).toLocaleString()+'] '+users[userID].name+' skapade projektet.']
        };
        projects.push(temp); 
        localStorage.setItem('projects', JSON.stringify(projects));
        showMessage('success', 'Projektet skapades.');
        showProjects(); closeModal();
    }
};

 
var showProjects = function() {
    var html = '';
    if(projects.length) {
        for(var object of projects) {
            html += '<div class="project">'+object.name+'</div>';
        }
        html += '<div style="clear: both;"></div>';
        
    } else html += '<p class="center">Det finns inget projekt!</p>';
    
    $('#pcontent').html(html);
    if(projectID != undefined) $('.project').eq(projectID).addClass('pactive');
};

var showProject = function(index) {
    console.dir(projects[projectID]);
};

var Log = function(text) {
    projects[projectID].logbok.push(text);
    localStorage.setItem('projects', JSON.stringify(projects));
    showLog();
};

var showLog = function() {
    console.dir(projects[projectID].logbok);
};