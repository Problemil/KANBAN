var userID;
var projects;
var projectID;
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
        html += '<span onclick="projectModal()"><i class="fa fa-building">';
        html += '</i> Skapa</span></div><div id="pcontent"></div></div>';
        $('#main').html(html);
        showProjects();
        
    } else {
        $('#header').append('<div onclick="logginModal()"><i class="fa fa-sign-in"></i><br/>Logga in</div>');
        $('#main').html('<h1 class="center">Kanban</h1>');
    }
    
    $(document).on('click', '.project', function(){
        $('.project').removeClass('active');
        $(this).addClass('active');
        projectID = $(this).index();
        showColumns();
        showIssues();
        showLog();
    });
});

// status: error eller success
var showMessage = function(status, message) {
    $(window).scrollTop(0);
    $('#message').html('<div class="'+status+'">'+message+'</div>');
    $('#message div').slideDown(400);
    $('.'+status).delay(4000).slideUp(400, function(){ $(this).remove(); });
};

var logginModal = function() {
    var content, title = 'Logga in';
    content  = '<form><label>Användarnamn</label>';
    content += '<input id="username" type="text" />';
    content += '<label>Lösenord</label>';
    content += '<input id="password" type="password" />';
    content += '<div class="button" onclick="signIn()">Logga in</div><form>';
    showModal(title, content);
};

var projectModal = function() {
    var content, title = 'Skapa projekt';
    content  = '<label>Projektnamn</label>';
    content += '<input id="pname" type="text" />';
    content += '<div class="button" onclick="createProject()">Skapa projekt</div>';
    showModal(title, content);
};

var showModal = function(title, content) {
    var html;
    closeModal();
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
            name   : pname, columns: [[],[],[],[]], issues: [],
            logbok : ['['+(new Date()).toLocaleString()+'] '+users[userID].name+' skapade projektet.']
        };
        projects.push(temp); 
        localStorage.setItem('projects', JSON.stringify(projects));
        showMessage('success', 'Projektet skapades.');
        showProjects();
        closeModal();
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
    if(projectID != undefined) $('.project').eq(projectID).addClass('active');
};

var showColumns = function(){
    var html = '';
    $('.columns').remove();
    html += '<div class="columns">';    
    html += '<div class="column"><div class="title">Att göra<span onclick="issueModal(0)"><i class="fa fa-file"></i> Skapa</span></div></div>';    
    html += '<div class="column"><div class="title">På gång<span onclick="issueModal(1)"><i class="fa fa-file"></i> Skapa</span></div></div>';    
    html += '<div class="column"><div class="title">Testa<span onclick="issueModal(2)"><i class="fa fa-file"></i> Skapa</span></div></div>';        
    html += '<div class="column"><div class="title">Klar<span onclick="issueModal(3)"><i class="fa fa-file"></i> Skapa</span></div></div>';
    html += '<div style="clear:both;"></div></div>';
    $('#main').append(html);  
};

var showIssue = function(column, issue) {
    var temp = projects[projectID].issues[issue];
    var html = '<div class="issue">';
    html += '<div class="title">['+(issue + 1)+'] '+users[temp.user].name;
    html += '<span onclick="moveModal('+column+', '+issue+')">';
    html += '<i class="fa fa-arrows-h"></i> Flytta</span></div>';
    html += '<div class="text">'+temp.text+'</div></div>';
    $('.column').eq(column).append(html);
};

var showIssues = function() {
    var project = projects[projectID];
    for(var column in project.columns) {
        for(var issue of project.columns[column]) {
            showIssue(column, issue);
        }
    }
};

var issueModal = function(column) {
    var content, title = 'Skapa issue';
    content  = '<label>Beskrivning</label>';
    content += '<input id="issue" type="text" />';
    content += '<label>Ansvarig</label>';
    content += '<select id="user">';
    content += '<option value=""> Välj ansvarig användare</option>';
    for(var key in users) {
        content += '<option value="'+key+'"> '+users[key].name+'</option>';
    }    
    content += '</select>';
    content += '<div class="button" onclick="addIssue('+column+')">Skapa issue</div>';
    showModal(title, content); 
};

var addIssue = function(column) {
    var issue = $('#issue').val().trim();
    if(issue == '') showMessage('error', 'Ange beskrivning');
    else {
        var userid = $('#user').val();
        if(userid == '') showMessage('error', 'Välj användare');
        else {
            var temp = {text: issue, user: userid};
            projects[projectID].issues.push(temp);
            temp = projects[projectID].issues.length - 1;
            projects[projectID].columns[column].push(temp);
            addLog('skapade issue #'+ (temp + 1));
            showIssue(column, temp);
            showMessage('success', 'Issue skapades');
            closeModal();
        }
    }
};

var moveModal = function(cIndex, iIndex) {
    var content, title = 'Flytta issue';
<<<<<<< HEAD
    content  = '<label>Flytta till</label>';
    content += '<select id="kolumner">';
    var kolumner = ['Att göra', 'På gång', 'Testa', 'Klar'];
    for(var key in kolumner) {
        if(cIndex == key) content += '<option value="'+key+'" selected> '+kolumner[key]+'</option>';
        else content += '<option value="'+key+'"> '+kolumner[key]+ '</option>';   
    }    
    content += '</select>';
    content += '<div class="button" onclick="moveIssue('+iIndex+', '+cIndex+')">Flytta issue</div>';
    showModal(title, content);
     
=======
    var temp = projects[projectID].issues[iIndex];
    content  = '<p><i class="fa fa-chevron-right"></i> '+temp.text+'</p>';
    temp     = ['Att göra', 'På gång', 'Testa', 'Klar'];
    content += '<label>Flytta till</label>';
    content += '<select id="kolumner">';
    for(var key in temp) {
        if(cIndex == key) content += '<option value="'+key+'" selected> '+temp[key]+'</option>';
        else content += '<option value="'+key+'"> '+temp[key]+'</option>';
    }    
    content += '</select>';
    content += '<div class="button" onclick="moveIssue('+cIndex+', '+iIndex+')">Flytta issue</div>';
    showModal(title, content); 
};

var moveIssue = function(column, issue) {
    var project = projects[projectID];
    var till = Number($('#kolumner').val());
    if(column != till) {
        var index = project.columns[column].indexOf(issue);
        project.columns[column].splice(index, 1);
        project.columns[till].push(issue);
        $('.column').eq(column).children('.issue').eq(index).remove();
        showIssue(till, issue);
        var temp = ['Att göra', 'På gång', 'Testa', 'Klar'];
        addLog('flyttade issue #'+(issue + 1)+' från "'+temp[column]+'" till "'+temp[till]+'"');
    }
    closeModal();
>>>>>>> 4790d9bcb510ae90e9e823ab240f85c1c9df2912
};

var addLog = function(text) {
    text = '['+(new Date()).toLocaleString()+'] '+users[userID].name + ' ' + text;
    projects[projectID].logbok.push(text);
    localStorage.setItem('projects', JSON.stringify(projects));
    $('<p>'+text+'</p>').insertAfter('.logbok .title');
};

var showLog = function() {
    var html = '';
    $('.logbok').remove();
    html += '<div class="logbok">';
    html += '<div class="title">Logbok</div></div>';
    $('#main').append(html);
    for(var text of projects[projectID].logbok) {
        $('<p>'+text+'</p>').insertAfter('.logbok .title');
    }
};